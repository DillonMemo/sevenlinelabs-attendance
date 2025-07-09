"use client"

import createClient from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/Button"
import { LoaderCircleIcon, LogIn, LogOut } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { type User as UserResponse } from "@/app/api/auth/user/route"
import { type AttendanceLog } from "@/app/api/attendance/logs/route"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface Props {
  user: User
}

// 상수 정의
const HOUR_WIDTH = 80
const TOTAL_HOURS = 24
const TOTAL_WIDTH = TOTAL_HOURS * HOUR_WIDTH // 24시간 * 80px = 1920px

export default function AttendanceSchedule({ user }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [users, setUsers] = useState<UserResponse[]>([])
  const [logs, setLogs] = useState<AttendanceLog[]>([])

  // 스크롤 동기화를 위한 ref
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const bodyScrollRef = useRef<HTMLDivElement>(null)

  const fetchUsers = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    if (!data.session) return
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      }
    )
    const result: UserResponse[] = await res.json()
    setUsers(result)
  }, [])
  const fetchLogs = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/logs`,
      {
        method: "GET",
      }
    )
    const result = await res.json()
    setLogs(result)
    setIsLoading(false)
  }, [])

  // 시간 헤더 생성 (메모이제이션)
  const timeHeaders = useMemo(() => {
    return Array.from({ length: TOTAL_HOURS }, (_, i) => (
      <div
        key={i}
        className={cn(
          "flex-shrink-0 text-center text-sm text-gray-600 font-medium border-r border-gray-200 last:border-r-0 flex items-center justify-center"
        )}
        style={{ width: HOUR_WIDTH, height: "100%" }}
      >
        <div>
          <div className="font-semibold text-gray-200">
            {i.toString().padStart(2, "0")}:00
          </div>
          <div className="text-xs text-gray-400">
            ~{i === 23 ? "23:59" : `${(i + 1).toString().padStart(2, "0")}:00`}
          </div>
        </div>
      </div>
    ))
  }, [])

  // 시간을 픽셀 위치로 변환
  const timeToPixel = useCallback((time: Date): number => {
    const hours = time.getHours()
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()
    const totalHours = hours + minutes / 60 + seconds / 3600
    return totalHours * HOUR_WIDTH
  }, [])

  // 배경 그리드 생성
  const backgroundGrid = useMemo(() => {
    const hourLines = Array.from(
      { length: TOTAL_HOURS + 1 },
      (_, i) =>
        // 처음과 마지막은 선 제거
        i !== 0 &&
        i !== TOTAL_HOURS && (
          <div
            key={`hour-${i}`}
            className={`absolute top-0 bottom-0 w-px bg-zinc-500`}
            style={{ left: i * HOUR_WIDTH - 1 }}
          />
        )
    )

    const minuteMarks = Array.from({ length: TOTAL_HOURS }, (_, i) =>
      Array.from({ length: 3 }, (_, j) => (
        <div
          key={`minute-${i}-${j + 1}`}
          className="absolute top-0 w-px bg-zinc-700"
          style={{
            left: i * HOUR_WIDTH + ((j + 1) * HOUR_WIDTH) / 4,
            height: j === 1 ? "60%" : "40%",
          }}
        />
      ))
    ).flat()

    return [...hourLines, ...minuteMarks]
  }, [])

  // 근무 시간 계산
  const calculateWorkDuration = useCallback((diffMs: number): string => {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    return `${hours}시간 ${minutes}분`
  }, [])

  // 근무 막대 데이터 계산
  const calculateWorkBarData = useCallback(
    (startTime: Date, endTime?: Date) => {
      if (!startTime) return { left: 0, width: 0, rightEnd: 0 }

      const startPixel = timeToPixel(startTime)
      const endPixel = endTime ? timeToPixel(endTime) : timeToPixel(currentTime)
      const width = endPixel - startPixel

      return {
        left: startPixel,
        width: width,
        rightEnd: endPixel,
      }
    },
    [timeToPixel, currentTime]
  )

  /**
   * @description 출퇴근 버튼 클릭 이벤트 핸들러
   */
  const onClickInOut = useCallback(
    (type: "check-in" | "check-out") => async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data } = await supabase.auth.getSession()
        if (!data.session) return

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/logs?type=${type}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          }
        )
        const result = await res.json()
        if (result.ok) await fetchLogs()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchLogs]
  )

  /**
   * @description 로그아웃 버튼 클릭 이벤트 핸들러
   */
  const onClickSignOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()

    router.refresh()
  }, [router])

  // 스크롤 동기화
  const onHeaderScroll = useCallback(() => {
    if (headerScrollRef.current && bodyScrollRef.current) {
      bodyScrollRef.current.scrollLeft = headerScrollRef.current.scrollLeft
    }
  }, [])
  const onBodyScroll = useCallback(() => {
    if (headerScrollRef.current && bodyScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    if (users.length === 0) {
      fetchUsers()
    }

    return () => clearInterval(interval)
  }, [fetchUsers, users.length])

  useEffect(() => {
    if (users.length > 0) {
      fetchLogs()
    }
  }, [fetchLogs, users.length])

  return (
    <div className="mt-4 max-w-2xl flex flex-col gap-4">
      <div className="flex justify-center">
        {isLoading ? (
          <Button type="button" role="button" variant="ghost" disabled>
            <LoaderCircleIcon className="animate-[rotation_1s_linear_infinite] w-10 h-10 text-[var(--color-primary-default)]" />
          </Button>
        ) : logs.find((log) => log.user_id === user.id)?.type === "check-in" ? (
          <Button
            type="button"
            role="button"
            variant="outline"
            onClick={onClickInOut("check-out")}
          >
            <LogOut size={16} />
            퇴근하기
          </Button>
        ) : logs.find((log) => log.user_id === user.id)?.type ===
          "check-out" ? (
          <Button
            type="button"
            role="button"
            variant="default"
            onClick={onClickInOut("check-in")}
          >
            <LogIn size={16} />
            출근하기
          </Button>
        ) : null}
      </div>

      <Card className="overflow-hidden">
        {/* 헤더 */}
        <div className="bg-zinc-700 flex items-center">
          {/* 고정된 프로필 헤더 */}
          <div className="md:w-48 w-32 h-16 flex-shrink-0 border-r border-b border-gray-200 flex items-center justify-center px-2">
            <div className="text-sm font-medium text-gray-200">
              시간대별 근무 현황
            </div>
          </div>

          {/* 스크롤 가능한 시간 헤더 */}
          <div
            className="flex-1 overflow-x-auto"
            ref={headerScrollRef}
            onScroll={onHeaderScroll}
          >
            <div
              className="flex h-16 border-b border-gray-200"
              style={{ width: TOTAL_WIDTH }}
            >
              {timeHeaders}
            </div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex">
          <div className="md:w-48 w-32 min-h-16 flex-shrink-0 border-r border-gray-200 divide-y divide-gray-100">
            {users.map((user) => {
              const log = logs.find((log) => log.user_id === user.id)
              const statusText =
                log?.type === "check-out" && !log?.endTime
                  ? "출근 전"
                  : log?.type === "check-in" && log.startTime
                    ? calculateWorkDuration(
                        currentTime.getTime() -
                          new Date(log.startTime).getTime()
                      )
                    : "퇴근"

              return (
                <div key={`header-${user.id}`} className="p-4 h-20">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.nickname}
                        </p>
                        {user.isCurrentUser && (
                          <Badge variant="default" className="text-xs">
                            본인
                          </Badge>
                        )}
                      </div>
                      <Badge variant="success" className="mt-1 text-xs">
                        {statusText}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className="flex-1 overflow-x-auto"
            ref={bodyScrollRef}
            onScroll={onBodyScroll}
          >
            <div style={{ width: TOTAL_WIDTH }}>
              {users.map((user) => {
                const log = logs.find((log) => log.user_id === user.id)
                return (
                  <div
                    key={`body-${user.id}`}
                    className="relative h-20 border-b border-gray-200 last:border-b-0"
                  >
                    {/* 배경 그리드 */}
                    <div className="absolute inset-0">{backgroundGrid}</div>
                    {log?.startTime && (
                      <div
                        className="absolute top-4 bottom-4 rounded-md flex items-center px-1 bg-teal-200 text-teal-900 overflow-hidden transition-all duration-1000"
                        style={{
                          left: calculateWorkBarData(
                            new Date(log.startTime),
                            log.endTime ? new Date(log.endTime) : undefined
                          ).left,
                          width: calculateWorkBarData(
                            new Date(log.startTime),
                            log.endTime ? new Date(log.endTime) : undefined
                          ).width,
                          height: "60%",
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-20"
                          {...(!log.endTime && {
                            style: {
                              backgroundImage: `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 4px,
                              currentColor 4px,
                              currentColor 8px
                            )`,
                              animation: "move-bg 6s linear infinite", // 애니메이션 적용
                              backgroundSize: "80px 80px", // 패턴 반복 크기
                            },
                          })}
                        />

                        <div className="relative z-10 text-xs font-medium truncate px-1">
                          <div className="opacity-80">
                            {format(new Date(log.startTime), "HH:mm")}
                            &nbsp;-&nbsp;
                            {log.endTime
                              ? `${format(new Date(log.endTime), "HH:mm")}`
                              : "진행 중"}
                          </div>
                          {log.endTime && (
                            <div className="font-normal opacity-80">
                              {calculateWorkDuration(
                                new Date(log.endTime).getTime() -
                                  new Date(log.startTime).getTime()
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>
      <div className="flex justify-center">
        <Button
          type="button"
          role="button"
          variant="link"
          className="text-gray-300"
          onClick={onClickSignOut}
        >
          로그아웃
        </Button>
      </div>
    </div>
  )
}
