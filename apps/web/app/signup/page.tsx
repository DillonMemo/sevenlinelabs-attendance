"use client"

import { useCallback, useState } from "react"
import { signup } from "./actions"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import useAuth from "@/hooks/useAuth"
import { redirect } from "next/navigation"
import { LoaderCircleIcon } from "lucide-react"

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const { user, status } = useAuth()

  const onSignup = useCallback(async (formData: FormData) => {
    try {
      const result = await signup(formData)
      if (result.error) {
        setError(result.error.message)
        console.error(result.error.message)
      }
    } catch (error) {
      console.error("Error sign up:", error)
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-2 items-center">
        <LoaderCircleIcon className="animate-[rotation_1s_linear_infinite] w-10 h-10 text-[var(--color-primary-default)]" />
        <p>Loading...</p>
      </div>
    )
  }

  if (status === "authenticated" && user.email !== "dillon@sevenlinelabs.com") {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-2 min-w-xs">
      <h1 className="md:text-2xl text-xl font-bold">Sign Up</h1>
      <form className="flex flex-col gap-2">
        <div className="inline-flex gap-2 items-center">
          <Input
            id="email"
            name="email"
            type="email"
            className="border rounded-md px-2 text-sm"
            placeholder="Email"
            required
          />
        </div>
        <div className="inline-flex gap-2 items-center">
          <Input
            id="nickname"
            name="nickname"
            type="text"
            className="border rounded-md px-2 text-sm"
            placeholder="Nickname"
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
            formAction={onSignup}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}
