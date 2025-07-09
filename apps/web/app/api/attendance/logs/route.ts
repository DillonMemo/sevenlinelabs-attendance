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

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

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
