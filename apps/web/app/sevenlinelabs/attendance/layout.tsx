import "@/styles/globals.css"
import type { Metadata } from "next"
import localFont from "next/font/local"

const pretendard = localFont({
  src: "../../../assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
})

export const metadata: Metadata = {
  title: "Sevenlinelabs Attendance",
  description: "Sevenlinelabs Attendance Management System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.className} w-screen h-screen`}>
        <div className="md:p-8 p-4">{children}</div>
      </body>
    </html>
  )
}
