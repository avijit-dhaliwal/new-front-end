import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Koby AI - Advanced AI Solutions',
  description: 'Transform your business with Koby AI\'s cutting-edge AI suites and intelligent chatbot assistant.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#ea580c',
          fontFamily: 'var(--font-sans)',
        },
        elements: {
          card: 'shadow-[var(--shadow-soft)] border border-[var(--line)]',
          headerTitle: 'font-display',
          headerSubtitle: 'text-[var(--ink-muted)]',
          formButtonPrimary: 'bg-[var(--accent-strong)] hover:bg-[var(--accent)]',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="icon" href="/favicon-16x16.ico" sizes="16x16" />
          <link rel="icon" href="/logo.png" type="image/png" />
          <link rel="apple-touch-icon" href="/logo.png" />
        </head>
        <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans transition-colors duration-300`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
