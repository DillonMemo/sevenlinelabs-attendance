"use client"

import { useCallback, useState } from "react"
import { login } from "./actions"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import useAuth from "@/hooks/useAuth"
import { redirect } from "next/navigation"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const { status } = useAuth()

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

  if (status === "authenticated") {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-2 min-w-xs">
      <h1 className="md:text-2xl text-xl font-bold">Login</h1>
      <form className="flex flex-col gap-2">
        <div className="inline-flex gap-2">
          <Input
            id="email"
            name="email"
            type="email"
            className="border rounded-md px-2 text-sm"
            placeholder="Email"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="inline-flex gap-2 justify-end">
          <button
            className={cn(
              "cursor-pointer px-2 py-1 border border-gray-700 rounded-md",
              "transition-colors duration-300 hover:border-gray-400 hover:text-gray-400"
            )}
            formAction={onLogin}
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  )
}
