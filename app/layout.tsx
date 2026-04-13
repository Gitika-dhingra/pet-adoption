import type { Metadata, Viewport } from 'next'
import { Nunito, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: 'PawFinder - Find Your Perfect Pet Companion',
  description: 'Adopt pets, get AI-powered care advice, find nearby vets, and help injured animals. Your one-stop platform for pet adoption and animal welfare.',
  keywords: ['pet adoption', 'animal shelter', 'adopt a dog', 'adopt a cat', 'pet care', 'veterinary', 'animal rescue'],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#2d2a26' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${nunito.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
