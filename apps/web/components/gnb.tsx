"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { mainMenuItems, plusMenuItems } from "../config/site"
import { Icons } from "./icons"

export default function GNB() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    setActiveRoute(pathname || "")
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const togglePlusMenu = () => {
    setIsPlusMenuOpen(!isPlusMenuOpen)
  }

  const isActive = (path: string) => {
    if (path === "/" && activeRoute === "/") return true
    if (path !== "/" && activeRoute.startsWith(path)) return true
    return false
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="w-full bg-[#121212] text-white fixed top-0 left-0 h-[70px] shadow-[0_10px_8px_0_rgba(0,0,0,0.2)] z-10 hidden md:block">
        <div className="flex items-center justify-between h-full px-[20px] w-full">
          <div className="flex items-center h-full">
            <h1 className="m-0 flex items-center h-full">
              <a href="/" className="flex items-center h-full">
                <img
                  src="/images/miracle-logo.e86c38fdab20c3fbca6e3b7a1bd57a64.svg"
                  alt="logo"
                  className="w-[38px] h-[40px] align-middle"
                />
              </a>
            </h1>
            <div className="flex items-center ml-[20px] h-full">
              <ul className="flex list-none m-0 p-0 h-full">
                {mainMenuItems.map((item, index) => (
                  <li key={index} className="relative h-full">
                    <a
                      href={item.href}
                      target={item.isExternal ? "_blank" : undefined}
                      className="relative text-white no-underline text-[14px] font-bold flex items-center h-full px-[8px] w-full whitespace-nowrap transition-all duration-300 hover:after:w-full hover:after:left-0 after:content-[''] after:absolute after:bg-[#ccb3ff] after:rounded after:h-[32px] after:w-0 after:left-1/2 after:top-1/2 after:-translate-y-1/2 after:transition-[0.2s] after:z-[-1]"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
                <li className="relative h-full">
                  <button
                    onClick={togglePlusMenu}
                    className="bg-transparent border-none text-white text-[14px] font-bold cursor-pointer p-0 flex items-center h-full px-[8px] w-full whitespace-nowrap transition-all duration-300 relative"
                  >
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <ul
                      className={`absolute top-full right-0 bg-[#1A1A1A] rounded p-2 min-w-[160px] mt-2 shadow-lg list-none ${
                        isPlusMenuOpen ? "block" : "hidden"
                      }`}
                    >
                      {plusMenuItems.map((item, index) => (
                        <li key={index} className="p-0">
                          <a
                            href={item.href}
                            target={item.isExternal ? "_blank" : undefined}
                            className="block py-1.5 px-3 text-white no-underline text-xs hover:bg-[#333]"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="bg-transparent border-none p-0 flex items-center justify-center w-8 h-8 rounded hover:bg-[#1A1A1A]"
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 7V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V17M16 12H22M22 12L19 9M22 12L19 15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <div
                className="bg-cover bg-center w-8 h-8 rounded-full overflow-hidden text-[0px] border border-[#333]"
                style={{
                  backgroundImage:
                    "url('https://imagedelivery.net/4PX95f69rbnt9ok_BnJEAA/18abbb3a-a557-4239-7f43-a93c32b10900/public')",
                }}
              >
                프로필사진
              </div>
              <div className="ml-2 hidden md:block">
                <div className="text-sm font-medium">dave</div>
                <div className="text-xs text-[#CCB3FF]">1,500 MPT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 w-full h-[70px] bg-[#121212] border-t border-[#383838] md:hidden flex items-center z-10">
        <Link
          href="/"
          className="flex-1 flex flex-col items-center justify-center h-full"
        >
          <div className="flex items-center justify-center">
            <Icons.home
              width={24}
              height={24}
              fill={isActive("/") ? "white" : "#A3A3A3"}
            />
          </div>
          <span
            className={`text-xs mt-1 ${isActive("/") ? "text-white" : "text-[#A3A3A3]"}`}
          >
            Home
          </span>
        </Link>
        <Link
          href="/tournament"
          className="flex-1 flex flex-col items-center justify-center h-full"
        >
          <div className="flex items-center justify-center">
            <Icons.tournament
              width={24}
              height={24}
              fill={isActive("/tournament") ? "white" : "#A3A3A3"}
            />
          </div>
          <span
            className={`text-xs mt-1 ${isActive("/tournament") ? "text-white" : "text-[#A3A3A3]"}`}
          >
            Tournament
          </span>
        </Link>
        <Link
          href="/game-list"
          className="flex-1 flex flex-col items-center justify-center h-full"
        >
          <div className="flex items-center justify-center">
            <Icons.game
              width={24}
              height={24}
              fill={isActive("/game-list") ? "white" : "#A3A3A3"}
            />
          </div>
          <span
            className={`text-xs mt-1 ${isActive("/game-list") ? "text-white" : "text-[#A3A3A3]"}`}
          >
            Game
          </span>
        </Link>
        <Link
          href="/ai-main"
          className="flex-1 flex flex-col items-center justify-center h-full"
        >
          <div className="flex items-center justify-center">
            <Icons.earn
              width={24}
              height={24}
              fill={isActive("/ai-main") ? "white" : "#A3A3A3"}
            />
          </div>
          <span
            className={`text-xs mt-1 ${isActive("/ai-main") ? "text-white" : "text-[#A3A3A3]"}`}
          >
            AI
          </span>
        </Link>
        <div
          className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer"
          onClick={toggleMenu}
        >
          <div className="flex flex-col items-center justify-center h-6 w-6 space-y-1">
            <span className="w-5 h-0.5 bg-white block"></span>
            <span className="w-5 h-0.5 bg-white block"></span>
            <span className="w-5 h-0.5 bg-white block"></span>
          </div>
          <span className="text-xs mt-1 text-[#A3A3A3]">Menu</span>
        </div>
      </div>
    </>
  )
}
