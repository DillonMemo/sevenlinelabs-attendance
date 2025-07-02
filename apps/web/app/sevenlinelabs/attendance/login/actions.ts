"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { singInWithEmailAndPassword } from "@/lib/auth/actions"

export async function login(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }
  console.log("📌 login", data)
  const { error } = await singInWithEmailAndPassword(data)
  if (error) {
    return { error }
  }
  revalidatePath("/sevenlinelabs/attendance", "layout")
  redirect("/sevenlinelabs/attendance/account")
}
