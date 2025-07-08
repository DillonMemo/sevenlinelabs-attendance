"use client"

import createClient from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/Button"
import { LogIn, LogOut } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { type User as UserResponse } from "@/app/api/auth/user/route"

interface Props {
  user: User
}

// 상수 정의
const HOUR_WIDTH = 80
const TOTAL_HOURS = 24
const TOTAL_WIDTH = TOTAL_HOURS * HOUR_WIDTH // 24시간 * 80px = 1920px

export default function AttendanceSchedule({ user }: Props) {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [isWorking, setIsWorking] = useState<boolean>(false)

  // 스크롤 동기화를 위한 ref
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const timelineScrollRef = useRef<HTMLDivElement>(null)

  // 스크롤 동기화
  const onHeaderScroll = () => {
    if (headerScrollRef.current && timelineScrollRef.current) {
      timelineScrollRef.current.scrollLeft = headerScrollRef.current.scrollLeft
    }
  }
  const onTimelineScroll = () => {
    if (headerScrollRef.current && timelineScrollRef.current) {
      headerScrollRef.current.scrollLeft = timelineScrollRef.current.scrollLeft
    }
  }

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

  const fetchUsers = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) return
    const res = await fetch("http://localhost:3000/api/auth/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
      },
    })
    const result: UserResponse[] = await res.json()
    setUsers(result)
  }, [])
  const fetchLogs = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) return

    const res = await fetch("http://localhost:3000/api/attendance/logs", {
      method: "GET",
    })
    const result = await res.json()
    setIsWorking(result.status === "check-in")
  }, [])

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers()
    }
  }, [fetchLogs, fetchUsers])

  useEffect(() => {
    if (users.length > 0) {
      fetchLogs()
    }
  }, [users])

  return (
    <div className="mt-4 max-w-2xl">
      {!isWorking ? (
        <Button type="button" role="button" variant="default">
          <LogIn size={16} />
          출근하기
        </Button>
      ) : (
        <Button type="button" role="button" variant="outline">
          <LogOut size={16} />
          퇴근하기
        </Button>
      )}

      <Card className="overflow-hidden">
        {/* 헤더 */}
        <div className="bg-zinc-700 flex items-center">
          {/* 고정된 프로필 헤더 */}
          <div className="md:w-48 w-32 h-16 flex-shrink-0 border-r border-gray-200 flex items-center justify-center px-2">
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
            <div className="flex h-16" style={{ width: TOTAL_WIDTH }}>
              {timeHeaders}
            </div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex">
          <div className="md:w-48 w-32 min-h-16 flex-shrink-0 border-r border-gray-200 divide-y divide-gray-100">
            {users.map((user, index) => (
              <div key={index} className="p-4">
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
                      {console.log("user", user)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
