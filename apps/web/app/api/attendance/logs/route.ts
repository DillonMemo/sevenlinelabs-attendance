import { NextRequest, NextResponse } from "next/server"
import createServer from "@/lib/supabase/server"
import { extractAccessToken } from "@/lib/auth/actions"
import { errorResponse } from "@/lib/api/util"
import { omit } from "lodash"

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

  const now = new Date()
  const kstDateString = now.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  }) // 예: 2024. 7. 9.
  // "2024. 7. 9." → "2024-07-09T00:00:00+09:00" 형태로 변환
  const [year, month, day] = kstDateString
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean)
  const todayKST = new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00+09:00`
  )
  const todayISO = todayKST.toISOString()

  // 1. 모든 회원 정보 조회
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, nickname")
  if (!profiles) return NextResponse.json([])

  // 2. 각 회원별로 오늘의 최신 출근/퇴근 기록 조회
  const logs: AttendanceLog[] = await Promise.all(
    profiles.map(async (profile) => {
      const { data: checkInData } = await supabase
        .from("attendance_logs")
        .select("*")
        .eq("user_id", profile.id)
        .eq("type", "check-in")
        .gte("timestamp", todayISO)
        .order("timestamp", { ascending: false })
        .limit(1)
        .single()

      const { data: checkOutData } = await supabase
        .from("attendance_logs")
        .select("*")
        .eq("user_id", profile.id)
        .eq("type", "check-out")
        .gte("timestamp", todayISO)
        .order("timestamp", { ascending: false })
        .limit(1)
        .single()

      const mergedData = {
        ...omit(checkInData, ["timestamp", "created_at"]),
        ...omit(checkOutData, ["timestamp", "created_at"]),
        ...(checkInData &&
          checkInData.timestamp && { startTime: checkInData.timestamp }),
        ...(checkOutData &&
          checkOutData.timestamp && { endTime: checkOutData.timestamp }),
      }

      if (
        mergedData.startTime &&
        mergedData.endTime &&
        new Date(mergedData.endTime) < new Date(mergedData.startTime)
      ) {
        mergedData.endTime = undefined
        mergedData.type = "check-in"
      }

      return {
        ...mergedData,
        email: profile.email,
        nickname: profile.nickname,
        user_id: profile.id,
        type: mergedData?.type || "check-out",
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
  // const message = `
  // ${data.user.user_metadata.nickname}님이 *${now.toLocaleString("en-US", { timeZone: clientTimezone })}*에 ${type === "check-in" ? "출근" : "퇴근"} 했습니다.
  // `
  const message =
    `${data.user.user_metadata.nickname} *${type === "check-in" ? "checked in" : "checked out"}* at ` +
    "`" +
    now.toLocaleString("en-US", { timeZone: clientTimezone }) +
    ` (${clientTimezone})` +
    "`"

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID as string

  // 텔레그램 알림 전송
  console.log("telegram", { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID })
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

  // 슬랙 알림 전송
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL as string
  if (SLACK_WEBHOOK_URL) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({ text: message }),
    })
  }

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
