import { NextRequest, NextResponse } from "next/server"
import createServer from "@/lib/supabase/server"
import { extractAccessToken } from "@/lib/auth/actions"
import { errorResponse } from "@/lib/api/util"

export interface User {
  id: string
  email: string
  role: string
  nickname: string
  avatar_url: string
  created_at: string
  isCurrentUser: boolean
}

export async function GET(request: NextRequest) {
  const accessToken = await extractAccessToken(request)

  if (!accessToken) {
    return errorResponse("No token provided", 401)
  }

  // 토큰 검증
  const supabase = await createServer()
  const { data } = await supabase.auth.getUser(accessToken)
  const { data: users } = await supabase.from("profiles").select("*")

  const mappedUsers: User[] = users?.map((user) => ({
    ...user,
    isCurrentUser: user.id === data?.user?.id,
  })) as User[]

  // const filteredUsers = mappedUsers.filter(
  //   (user) => user.email !== "dillon@sevenlinelabs.com"
  // )

  return NextResponse.json(mappedUsers)
}
