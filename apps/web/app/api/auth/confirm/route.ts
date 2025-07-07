import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

import createServer from "@/lib/supabase/server"

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = "/"
  console.log("confirm 1️⃣", { token_hash, type })

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete("token_hash")
  redirectTo.searchParams.delete("type")

  if (token_hash && type) {
    const supabase = await createServer()
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    console.log("confirm 2️⃣", { data, error })
    if (!error) {
      redirectTo.searchParams.delete("next")
      return NextResponse.redirect(redirectTo)
    } else {
      // return the user to an error page with some instructions
      redirectTo.pathname = `/error`
      redirectTo.searchParams.append("message", error.message)
      return NextResponse.redirect(redirectTo)
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = `/error`
  redirectTo.searchParams.append("message", "token_hash or type is not found")
  return NextResponse.redirect(redirectTo)
}
