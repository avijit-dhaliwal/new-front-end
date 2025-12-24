'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface CTASectionProps {
  /** Section title */
  title: string
  /** Section description */
  description?: string
  /** Primary CTA button */
  primaryCta?: {
    text: string
    href: string
  }
  /** Secondary CTA button */
  secondaryCta?: {
    text: string
    href: string
  }
  /** Variant: 'panel' for card style, 'full' for full-width section, 'inline' for compact */
  variant?: 'panel' | 'full' | 'inline'
  /** Optional icon */
  icon?: LucideIcon
  /** Background style: 'paper' or 'muted' */
  background?: 'paper' | 'muted'
  /** Optional children for custom content */
  children?: ReactNode
}

export default function CTASection({
  title,
  description,
  primaryCta,
  secondaryCta,
  variant = 'panel',
  icon: Icon,
  background = 'paper',
  children,
}: CTASectionProps) {
  const bgClass = background === 'muted' ? 'bg-[var(--paper-muted)]' : 'bg-[var(--paper)]'

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="panel-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="icon-container">
                <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
              {description && (
                <p className="mt-1 text-sm text-[var(--ink-muted)]">{description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {secondaryCta && (
              <Link href={secondaryCta.href} className="btn-secondary text-sm py-2.5 px-5">
                {secondaryCta.text}
              </Link>
            )}
            {primaryCta && (
              <Link href={primaryCta.href} className="btn-primary text-sm py-2.5 px-5">
                {primaryCta.text}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>
        {children}
      </motion.div>
    )
  }

  if (variant === 'panel') {
    return (
      <section className={`py-16 lg:py-20 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="panel-card p-8 lg:p-12"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-4 lg:items-center">
                {Icon && (
                  <div className="icon-container shrink-0">
                    <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
                  </div>
                )}
                <div className="text-center lg:text-left">
                  <h3 className="text-xl lg:text-2xl font-semibold text-[var(--ink)]">{title}</h3>
                  {description && (
                    <p className="mt-2 text-sm lg:text-base text-[var(--ink-muted)] max-w-xl">{description}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                {secondaryCta && (
                  <Link href={secondaryCta.href} className="btn-secondary">
                    {secondaryCta.text}
                  </Link>
                )}
                {primaryCta && (
                  <Link href={primaryCta.href} className="btn-primary">
                    {primaryCta.text}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                )}
              </div>
            </div>
            {children}
          </motion.div>
        </div>
      </section>
    )
  }

  // Full variant - full-width section
  return (
    <section className={`py-20 lg:py-28 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          {Icon && (
            <div className="icon-container mx-auto mb-6">
              <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
            </div>
          )}
          <h2 className="section-title">{title}</h2>
          {description && (
            <p className="mt-4 section-description">{description}</p>
          )}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  )
}
