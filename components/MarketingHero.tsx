'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ReactNode } from 'react'

interface HighlightItem {
  text: string
}

interface StatItem {
  label: string
  value: string
}

interface MarketingHeroProps {
  /** Label displayed above the title (uppercase, tracking-wide) */
  label?: string
  /** Main hero title */
  title: string
  /** Hero description/subtitle */
  description: string
  /** Primary CTA button text */
  primaryCta?: {
    text: string
    href: string
  }
  /** Secondary CTA button text */
  secondaryCta?: {
    text: string
    href: string
  }
  /** Array of highlight points to display below CTAs */
  highlights?: HighlightItem[]
  /** Optional side panel content */
  sidePanel?: ReactNode
  /** Show back link */
  backLink?: {
    text: string
    href: string
  }
  /** Optional badge displayed next to label */
  badge?: string
  /** Optional stats displayed in hero */
  stats?: StatItem[]
  /** Center align content (no side panel) */
  centered?: boolean
}

export default function MarketingHero({
  label,
  title,
  description,
  primaryCta,
  secondaryCta,
  highlights,
  sidePanel,
  backLink,
  badge,
  stats,
  centered = false,
}: MarketingHeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 lg:pt-32 pb-20 noise-overlay">
      {/* Background textures */}
      <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
      <div className="absolute -top-28 right-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="absolute -bottom-24 left-[-5%] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        {backLink && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link href={backLink.href} className="back-link">
              <ArrowLeft className="w-4 h-4" />
              {backLink.text}
            </Link>
          </motion.div>
        )}

        <div className={centered ? 'max-w-3xl mx-auto text-center' : 'grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center'}>
          {/* Main content */}
          <div className={centered ? '' : ''}>
            {/* Label + Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
            >
              {label && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  {label}
                </span>
              )}
              {badge && (
                <span className="accent-pill">{badge}</span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-[var(--ink)]"
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`mt-5 text-base sm:text-lg text-[var(--ink-muted)] ${centered ? '' : 'max-w-2xl'}`}
            >
              {description}
            </motion.p>

            {/* CTAs */}
            {(primaryCta || secondaryCta) && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className={`mt-8 flex flex-col sm:flex-row items-center gap-4 ${centered ? 'justify-center' : ''}`}
              >
                {primaryCta && (
                  <Link href={primaryCta.href} className="btn-primary">
                    {primaryCta.text}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                )}
                {secondaryCta && (
                  <Link href={secondaryCta.href} className="btn-secondary">
                    {secondaryCta.text}
                  </Link>
                )}
              </motion.div>
            )}

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--ink-muted)] ${centered ? 'max-w-xl mx-auto' : ''}`}
              >
                {highlights.map((item) => (
                  <div key={item.text} className={`flex items-start gap-2 ${centered ? 'justify-center text-center' : ''}`}>
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className={`mt-10 grid grid-cols-3 gap-4 ${centered ? 'max-w-md mx-auto' : ''}`}
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-card">
                    <p className="text-lg font-semibold text-[var(--ink)]">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Side Panel */}
          {!centered && sidePanel && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative"
            >
              {sidePanel}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
