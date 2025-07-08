import { NextResponse } from "next/server"

export function errorResponse(
  message: string,
  status: number = 401,
  extra?: Record<string, any>
) {
  return NextResponse.json({ error: message, ...extra }, { status })
}
