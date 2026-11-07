import type { Metadata, Viewport } from "next"
import { Jost } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" })

export const metadata: Metadata = {
  description: "Pick Thailand day tours for Indian travellers, with prices in rupees and help planning your trip.",
}

export const viewport: Viewport = { themeColor: "#ffffff" }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("antialiased", jost.variable)}>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
