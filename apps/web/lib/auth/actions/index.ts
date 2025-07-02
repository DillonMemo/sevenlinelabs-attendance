"use server"

import createServer from "@/lib/supabase/server"

export async function singInWithEmailAndPassword(data: {
  email: string
  password: string
}) {
  const supabase = await createServer()
  console.log("📌 singInWithEmailAndPassword", supabase)
  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  return result
}

export async function singUpWithEmailAndPassword(data: {
  email: string
  password: string
}) {
  const supabase = await createServer()
  console.log("📌 singUpWithEmailAndPassword", supabase)
  const result = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  return result
}
