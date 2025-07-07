import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const message = searchParams?.message
  return (
    <div className="flex flex-col gap-4 items-center">
      <div>{message ?? "Unknown error"}</div>
      <Link href="/" className="flex items-center gap-2 hover:text-blue-300">
        go to Home <ArrowRight />
      </Link>
    </div>
  )
}
