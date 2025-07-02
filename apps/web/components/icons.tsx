import { LucideIcon } from "lucide-react"

export type Icon = LucideIcon

interface IconProps {
  width?: number | string
  height?: number | string
  fill?: string
}

export const Icons = {
  home: ({ width = 24, height = 24, fill = "#A3A3A3" }: IconProps = {}) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 15.14C14.5 15.3665 14.4181 15.5838 14.2722 15.744C14.1263 15.9042 13.9285 15.9941 13.7222 15.9941H1.27778C1.0715 15.9941 0.873668 15.9042 0.727806 15.744C0.581944 15.5838 0.5 15.3665 0.5 15.14V6.1632C0.499918 6.03304 0.526924 5.90459 0.578957 5.78764C0.630989 5.6707 0.706671 5.56836 0.800222 5.48844L7.02244 0.174099C7.15898 0.0574645 7.32702 -0.00585938 7.5 -0.00585938C7.67298 -0.00585938 7.84102 0.0574645 7.97756 0.174099L14.1998 5.48844C14.2933 5.56836 14.369 5.6707 14.421 5.78764C14.4731 5.90459 14.5001 6.03304 14.5 6.1632V15.14ZM6.72222 9.16117V14.2859H8.27778V9.16117H6.72222Z"
        fill={fill}
      />
    </svg>
  ),
}
