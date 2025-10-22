'use client'

import Link from 'next/link'
import { ArrowLeft, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface ArticleLayoutProps {
  children: React.ReactNode
}

export function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <article className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            {children}

            <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border">
              <div className="flex justify-between items-center">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Articles
                </Link>
                <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share Article
                </button>
              </div>
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  )
}