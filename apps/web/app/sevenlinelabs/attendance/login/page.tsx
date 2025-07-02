"use client"

import { useCallback, useEffect, useState } from "react"
import { login } from "./actions"
import createClient from "@/lib/supabase/client"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  const onLogin = useCallback(async (formData: FormData) => {
    try {
      const result = await login(formData)
      if (result.error) {
        setError(result.error.message)
      }
    } catch (error) {
      console.error("Error login:", error)
    }
  }, [])
  const getUser = useCallback(async () => {
    const user = await createClient().auth.getUser()
    console.log("📌 test", user)
  }, [])
  useEffect(() => {
    getUser()
  }, [getUser])
  return (
    <div>
      <div>
        <h1>Login</h1>
        <form className="flex flex-col gap-2">
          <div className="inline-flex gap-2">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              className="border rounded-md px-2 text-sm"
              required
            />
          </div>
          <div className="inline-flex gap-2">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              className="border rounded-md px-2 text-sm"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="inline-flex gap-2">
            <button
              className="cursor-pointer border rounded-sm px-2 py-1"
              formAction={onLogin}
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
