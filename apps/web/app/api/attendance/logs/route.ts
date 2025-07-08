import { NextResponse } from "next/server"
import createServer from "@/lib/supabase/server"

// Creating a handler to a GET request to route /auth/confirm
export async function GET() {
  const supabase = await createServer()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()
  const { data: logs } = await supabase
    .from("attendance_logs")
    .select("*")
    .gte("timestamp", todayISO)
    .order("created_at", { ascending: true })

  return NextResponse.json(logs)
}
