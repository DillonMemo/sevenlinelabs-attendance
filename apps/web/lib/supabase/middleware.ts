import { NextResponse, type NextRequest } from "next/server"
import createServer from "./server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })
  const supabase = await createServer()

  // refreshing the auth token
  await supabase.auth.getUser()
  return supabaseResponse
}
