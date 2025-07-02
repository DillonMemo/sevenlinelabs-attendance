import { singUpWithEmailAndPassword } from "@/lib/auth/actions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }
  console.log("📌 signup", data)
  const { error } = await singUpWithEmailAndPassword(data)
  if (error) {
    return { error }
  }
  revalidatePath("/sevenlinelabs/attendance", "layout")
  redirect("/")
}
