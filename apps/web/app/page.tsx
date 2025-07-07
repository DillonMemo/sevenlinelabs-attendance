import AttendanceSchedule from "@/components/attendance-schedule"
import createServer from "@/lib/supabase/server"
import { MAIN_TITLE } from "@name/shared"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createServer()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="md:text-2xl text-xl font-bold text-center">
        {MAIN_TITLE}
      </h1>
      <h2 className="md:text-xl text-lg text-center">
        👋 안녕하세요 <b>{data.user.user_metadata.nickname}</b>님
      </h2>
      <AttendanceSchedule user={data.user} />
    </div>
  )
}
