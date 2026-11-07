"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/** Fades content up with shadcn's tw-animate classes the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -6% 0px" }
    )
    observer.observe(ref.current!)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        shown
          ? "animate-in duration-700 fill-mode-both fade-in slide-in-from-bottom-6 motion-reduce:animate-none"
          : "reveal-waiting",
        className
      )}
    >
      {children}
    </div>
  )
}
