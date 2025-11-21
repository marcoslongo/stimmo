import type React from "react"
import type { Metadata } from "next"
import { Sora } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/cookie-consent"

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Stimmo | Móveis planejados",
  description:
    "Transforme seus ambientes com móveis planejados personalizados. Tecnologia europeia, design exclusivo e entrega rápida com frota própria.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={sora.className}>
        <FavoritesProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
        </FavoritesProvider>
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  )
}