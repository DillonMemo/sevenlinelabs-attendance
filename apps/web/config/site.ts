export interface MenuItem {
  title: string
  href: string
  isExternal?: boolean
}

export interface PlusMenuItem extends MenuItem {}

export const mainMenuItems: MenuItem[] = [
  {
    title: "TOURNAMENT",
    href: "/tournament",
  },
  {
    title: "GAME",
    href: "/game-list",
  },
  {
    title: "AI AGENT",
    href: "/ai-main",
  },
  {
    title: "SHOP",
    href: "/shop",
  },
  {
    title: "EARN",
    href: "https://apex-earn.miracleplay.gg",
    isExternal: true,
  },
]

export const plusMenuItems: PlusMenuItem[] = [
  {
    title: "GitBook",
    href: "https://miracleplay.gitbook.io/miracle-play-esports-tournament-platform",
    isExternal: true,
  },
  {
    title: "GitHub",
    href: "https://github.com/miracleplay",
    isExternal: true,
  },
  {
    title: "Whitepaper",
    href: "https://docsend.com/view/j8shpxsjyhtiya9y",
    isExternal: true,
  },
  {
    title: "Miracle Scan",
    href: "https://scan.miracleplay.io/",
    isExternal: true,
  },
]
