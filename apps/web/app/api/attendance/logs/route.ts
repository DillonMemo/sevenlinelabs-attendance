import { NextRequest, NextResponse } from "next/server"
import createServer from "@/lib/supabase/server"
import { extractAccessToken } from "@/lib/auth/actions"
import { errorResponse } from "@/lib/api/util"

export interface AttendanceLog {
  email: string
  nickname: string
  id: string
  user_id: string
  type: "check-in" | "check-out"
  startTime?: string
  endTime?: string
  memo?: string
  created_at?: string
}

export async function GET() {
  const supabase = await createServer()

  // 1. 모든 회원 정보 조회
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, nickname")
  if (!profiles) return NextResponse.json([])

  // 2. 각 회원별로 최신 출근/퇴근 기록 조회 (날짜 필터 없이)
  const logs: AttendanceLog[] = await Promise.all(
    profiles.map(async (profile) => {
      // 가장 최근 check-in
      const { data: latestCheckIn } = await supabase
        .from("attendance_logs")
        .select("*")
        .eq("user_id", profile.id)
        .eq("type", "check-in")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single()

      // 가장 최근 check-out
      const { data: latestCheckOut } = await supabase
        .from("attendance_logs")
        .select("*")
        .eq("user_id", profile.id)
        .eq("type", "check-out")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single()

      // 현재 상태 결정: check-in이 check-out보다 최근이면 "출근 중"
      const isCurrentlyWorking =
        latestCheckIn &&
        (!latestCheckOut ||
          new Date(latestCheckIn.timestamp) >
            new Date(latestCheckOut.timestamp))

      // 오늘 날짜인지 확인하는 함수
      const isToday = (date: Date) => {
        const today = new Date()
        return (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        )
      }

      // 퇴근 완료이고, 그 퇴근이 오늘이 아니면 막대바를 숨김
      // (어제 check-out 완료한 사람은 오늘 막대바 안 보임)
      // 단, 어제 check-in만 하고 check-out 안 한 사람은 막대바 유지 (isCurrentlyWorking = true)
      const isCompletedOnPreviousDay =
        !isCurrentlyWorking &&
        latestCheckOut &&
        !isToday(new Date(latestCheckOut.timestamp))

      const startTime = isCompletedOnPreviousDay
        ? undefined
        : latestCheckIn?.timestamp
      const endTime = isCurrentlyWorking ? undefined : latestCheckOut?.timestamp

      return {
        id: latestCheckIn?.id || latestCheckOut?.id,
        email: profile.email,
        nickname: profile.nickname,
        user_id: profile.id,
        type: isCurrentlyWorking ? "check-in" : "check-out",
        startTime,
        endTime,
        memo: latestCheckIn?.memo || latestCheckOut?.memo,
      }
    })
  )

  return NextResponse.json(logs)
}

export async function PUT(request: NextRequest) {
  const accessToken = await extractAccessToken(request)

  if (!accessToken) {
    return errorResponse("No token provided", 401)
  }

  // 토큰 검증
  const supabase = await createServer()
  const { data } = await supabase.auth.getUser(accessToken)
  if (!data.user) {
    return errorResponse("Invalid user", 401)
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const clientTimezone = searchParams.get("timezone") || "Asia/Seoul"

  // 알림 메시지 생성 (사용자의 타임존으로 시간 표시)
  const now = new Date()
  const message =
    `${data.user.user_metadata.nickname} *${type === "check-in" ? "checked in" : "checked out"}* at ` +
    "`" +
    now.toLocaleString("en-US", { timeZone: clientTimezone }) +
    ` (${clientTimezone})` +
    "`"

  await sendTelegramMessage(message)

  await sendSlackMessage(message)

  const { error } = await supabase.from("attendance_logs").insert([
    {
      user_id: data.user.id,
      type,
      timestamp: new Date().toISOString(),
    },
  ])

  if (error) {
    return errorResponse(error.message, 500)
  }

  return NextResponse.json({ ok: true })
}

/**
 * @deprecated
 * @description 텔레그램 알림 전송
 */
async function sendTelegramMessage(message: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID as string

  // 텔레그램 알림 전송
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    await fetch(telegramUrl, {
      method: "POST",
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    })
  }
}

/**
 * @description 슬랙 알림 전송
 */
async function sendSlackMessage(message: string) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL as string
  if (SLACK_WEBHOOK_URL) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({ text: message }),
    })
  }
}
