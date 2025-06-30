import GameSidebar from "@/components/game-sidebar"
import GNB from "@/components/gnb"
import "@/styles/globals.css"
import type { Metadata } from "next"
import localFont from "next/font/local"

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
})

export const metadata: Metadata = {
  title: "Miracle Play 2.0",
  description: "Miracle Play 2.0",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.className} w-screen h-screen`}>
        <GNB />
        <GameSidebar />
        <div className="pl-[72px] md:pt-[70px] pb-[70px] md:pb-0">
          {children}
        </div>
      </body>
    </html>
  )
}
