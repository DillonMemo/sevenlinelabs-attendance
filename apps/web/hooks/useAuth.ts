"use client"

import createClient from "@/lib/supabase/client"
import { type User, type AuthError, Session } from "@supabase/supabase-js"
import { useCallback, useEffect, useState } from "react"

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<
    "unauthenticated" | "authenticated" | "loading"
  >("loading")
  const [error, setError] = useState<AuthError | null>(null)

  const getUser = useCallback(async () => {
    try {
      setError(null)
      const { data, error } = await createClient().auth.getUser()
      if (error) {
        throw error
      }

      setUser(data.user)
      setStatus("authenticated")
    } catch (error: unknown) {
      setError(error as AuthError)
      setUser(null)
      setStatus("unauthenticated")
    }
  }, [])

  useEffect(() => {
    getUser()
  }, [getUser])

  if (status === "authenticated")
    return { user: user!, session: session!, status, error, refresh: getUser }

  return { user, session, status, error, refresh: getUser }
}
