"use client"

import createClient from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { type User } from "@supabase/supabase-js"
import Link from "next/link"
import { useCallback, useEffect } from "react"

interface Props {
  user: User
}

export default function AttendanceSchedule({ user }: Props) {
  console.log("user detail", user)

  const fetchProtected = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) return
    console.log("??", data.session)
    const res = await fetch("http://localhost:4000/auth/protected", {
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
      },
    })
    const result = await res.json()
    console.log("📌 result", result)
  }, [])

  useEffect(() => {
    fetchProtected()
  }, [fetchProtected])

  return (
    <div className="mt-4">
      <button
        type="button"
        role="button"
        className={cn(
          "cursor-pointer px-2 py-1 border border-gray-700 rounded-md",
          "transition-colors duration-300 hover:border-gray-400 hover:text-gray-400"
        )}
      >
        출근하기
      </button>
      <div className="flex gap-2 items-center">
        <Link
          href="/login"
          className={cn(
            "px-2 py-1 border border-gray-700 rounded-md",
            "transition-colors duration-300 hover:border-gray-400 hover:text-gray-400"
          )}
        >
          Go to Login
        </Link>
        <Link
          href="/signup"
          className={cn(
            "px-2 py-1 border border-gray-700 rounded-md",
            "transition-colors duration-300 hover:border-gray-400 hover:text-gray-400"
          )}
        >
          Go to Sing up
        </Link>
      </div>
    </div>
  )
}
