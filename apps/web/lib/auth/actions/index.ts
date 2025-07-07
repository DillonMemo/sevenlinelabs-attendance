"use server"

import createServer from "@/lib/supabase/server"
import { pick } from "lodash"
import { AuthError } from "@supabase/supabase-js"

export async function singInWithEmailAndPassword(data: {
  email: string
  password: string
}) {
  const supabase = await createServer()
  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })
  console.log("📌 singInWithEmailAndPassword", result)

  return result
}

export async function singUpWithEmailAndPassword(data: {
  email: string
  password: string
  nickname: string
}) {
  const supabase = await createServer()

  const { data: findUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .single()

  if (findUser?.id) {
    return {
      error: new AuthError("User already exists", 400, "user_already_exists"),
    }
  }

  const result = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        nickname: data.nickname,
        role: data.email === "dillon@sevenlinelabs.com" ? "admin" : "user",
      },
    },
  })

  console.log("📌 singUpWithEmailAndPassword", result)
  if (!result.error && result.data.user) {
    await supabase.from("profiles").insert([
      {
        ...pick(result.data.user, ["id", "email"]),
        role: data.email === "dillon@sevenlinelabs.com" ? "admin" : "user",
        nickname: data.nickname,
        avatar_url: "",
      },
    ])
  }

  return result
}
