"use server"

import { singUpWithEmailAndPassword } from "@/lib/auth/actions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    nickname: formData.get("nickname") as string,
  }
  const { error } = await singUpWithEmailAndPassword(data)
  console.log("📌 signup", error)
  if (error) {
    return { error }
  }
  revalidatePath("/", "layout")
  redirect("/")
}
