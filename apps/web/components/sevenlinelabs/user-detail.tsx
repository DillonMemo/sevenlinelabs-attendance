"use client"

import createClient from "@/lib/supabase/client"
import { useCallback, useEffect } from "react"

export default function UserDetail() {
  const getUser = useCallback(async () => {
    const user = await createClient().auth.getUser()
    console.log("📌 test", user)
  }, [])
  useEffect(() => {
    getUser()
  }, [getUser])
  return <div>User Detail</div>
}
