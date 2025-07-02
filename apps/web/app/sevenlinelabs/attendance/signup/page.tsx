"use client"

import { useCallback, useState } from "react"
import { signup } from "./actions"

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const onSignup = useCallback(async (formData: FormData) => {
    try {
      const result = await signup(formData)
      if (result.error) {
        console.log("📌 result.error", result.error)
        setError(result.error.message)
      }
    } catch (error) {
      console.error("Error sign up:", error)
    }
  }, [])
  return (
    <div>
      <div>
        <h1>Sign Up</h1>
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
              formAction={onSignup}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
