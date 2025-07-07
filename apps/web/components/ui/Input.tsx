import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-gray-700 bg-background px-3 py-2",
          "text-base md:text-sm placeholder:text-gray-400",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
          type === "number" &&
            "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-number-spin-box]:appearance-none"
        )}
        ref={ref}
        {...props}
        {...(type === "number" && {
          step: "any",
          onInput: (e) => {
            const el = e.target as HTMLInputElement
            const nativeEvent = e.nativeEvent as InputEvent
            const value = el.value

            // 숫자와 소수점만 허용하는 정규식
            const onlyNumbersAndDot = value.replace(/[^0-9.]/g, "")
            // 소수점이 여러 개인 경우 첫 번째 소수점만 유지
            const parts = onlyNumbersAndDot.split(".")
            const formattedValue =
              parts.length > 1
                ? `${parts[0]}.${parts[1].replace(/\./g, "")}`
                : onlyNumbersAndDot

            if (el.value !== formattedValue) {
              el.value = formattedValue
            } else if (
              nativeEvent.data &&
              /[ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(nativeEvent.data)
            ) {
              // 한글 입력 방지
              el.value = formattedValue
            } else if (
              el.max !== undefined &&
              el.max !== "" &&
              Number(formattedValue) > Number(el.max)
            ) {
              el.value = String(el.max)
            } else if (
              el.min !== undefined &&
              el.min !== "" &&
              Number(formattedValue) < Number(el.min)
            ) {
              el.value = String(el.min)
            }
          },
          onKeyDown: (e) => {
            // 전체 선택 단축키 허용 (Ctrl+A, Command+A)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
              return
            }

            // 소수점이 이미 있는 경우 추가 소수점 입력 방지
            if (
              e.key === "." &&
              (e.target as HTMLInputElement).value.includes(".")
            ) {
              e.preventDefault()
              return
            }

            // 허용된 키만 입력 가능
            if (
              !/^[0-9]$/.test(e.key) &&
              ![
                "Backspace", // 삭제
                "ArrowLeft", // 왼쪽 이동
                "ArrowRight", // 오른쪽 이동
                "ArrowUp", // 위로 이동
                "ArrowDown", // 아래로 이동
                "Tab", // 탭 이동
                ".", // 소수점
              ].includes(e.key)
            ) {
              e.preventDefault()
            }
          },
        })}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
