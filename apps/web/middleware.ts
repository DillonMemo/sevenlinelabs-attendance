import { NextRequest } from "next/server"
import { updateSession } from "./lib/supabase/middleware"

async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  response.headers.set("x-current-path", request.nextUrl.pathname)
  response.headers.set("user-agent", request.headers.get("user-agent") || "")
  response.headers.set(
    "x-forwarded-for",
    request.headers.get("x-forwarded-for") || ""
  )

  return response
}

export default middleware

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  matcher: "/((?!trpc|_next|_vercel|favicon.ico|.*\\..*).*)",
}
