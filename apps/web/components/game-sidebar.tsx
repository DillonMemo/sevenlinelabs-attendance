"use client"

import Link from "next/link"
import { useState } from "react"

interface GameItem {
  id: string
  href: string
  imgSrc: string
}

const gameItems: GameItem[] = [
  {
    id: "CHAMPION-STRIKE",
    href: "/game-detail?game=CHAMPION-STRIKE",
    imgSrc: "/images/game-icons/championStrike-side-bar-img.png",
  },
]

export default function GameSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <div
        className={`fixed left-0 z-10 flex flex-col gap-4 border-r border-[#222] bg-[#0b0b0c] p-4 transition-all duration-300 
          top-0 md:top-[70px] h-screen md:h-[calc(100%-70px)] w-[72px]
          ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%-5px)]"}`}
      >
        <Link
          href="/ai-main"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#242424] text-white transition-all hover:bg-[#333]"
        >
          <span className="sr-only">Add</span>
          <span className="absolute h-0.5 w-4 bg-white" />
          <span className="absolute h-0.5 w-4 rotate-90 bg-white" />
        </Link>

        {gameItems.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className="block h-10 w-10 cursor-pointer rounded-lg bg-center bg-cover bg-no-repeat transition-transform hover:scale-110"
            style={{ backgroundImage: `url("${game.imgSrc}")` }}
          >
            <span className="sr-only">{game.id}</span>
          </Link>
        ))}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-[-21px] top-1/2 z-[3] h-9 w-5 -translate-y-1/2 cursor-pointer rounded-r-md bg-[#ccb3ff] transition-all duration-300"
          aria-label="사이드바 열고 닫기"
        >
          <div className="relative h-full w-full">
            <div className="absolute left-1/2 top-1/2 h-5 w-[1px] -translate-x-[calc(50%-2px)] -translate-y-1/2 bg-[#0b0b0c] opacity-40"></div>
            <div className="absolute left-1/2 top-1/2 h-5 w-[1px] -translate-x-[calc(50%+2px)] -translate-y-1/2 bg-[#0b0b0c] opacity-40"></div>
          </div>
        </button>
      </div>
    </>
  )
}
