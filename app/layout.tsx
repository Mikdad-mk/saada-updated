import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import SessionProviderWrapper from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SA'ADA STUDENTS' UNION",
  description: "Empowering Students through Unity and Knowledge",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <SessionProviderWrapper>
          <main className="pt-16">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
