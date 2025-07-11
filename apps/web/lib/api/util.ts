import { NextResponse } from "next/server"

export function errorResponse(
  message: string,
  status: number = 401,
  extra?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, ...extra }, { status })
}
