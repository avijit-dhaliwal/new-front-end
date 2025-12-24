'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface FeatureItem {
  /** Feature title */
  title: string
  /** Feature description */
  description: string
  /** Optional icon */
  icon?: LucideIcon
  /** Optional badge */
  badge?: string
  /** Optional link */
  href?: string
  /** Optional link text (default: "Learn more") */
  linkText?: string
}

interface FeatureGridProps {
  /** Array of features to display */
  features: FeatureItem[]
  /** Number of columns */
  columns?: 2 | 3
  /** Variant: 'card' for panel cards, 'list' for stacked layout */
  variant?: 'card' | 'list' | 'compact'
  /** Animation delay offset */
  delay?: number
}

export default function FeatureGrid({
  features,
  columns = 3,
  variant = 'card',
  delay = 0,
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  }

  if (variant === 'list') {
    return (
      <div className="grid grid-cols-1 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: delay + index * 0.05 }}
            className="panel-card p-5"
          >
            <div className="flex items-start gap-4">
              {feature.icon && (
                <div className="icon-container shrink-0">
                  <feature.icon className="h-5 w-5 text-[var(--accent-strong)]" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-[var(--ink)]">{feature.title}</p>
                  {feature.badge && (
                    <span className="accent-pill">{feature.badge}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{feature.description}</p>
                {feature.href && (
                  <Link
                    href={feature.href}
                    className="mt-3 accent-link"
                  >
                    {feature.linkText || 'Learn more'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-1 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: delay + index * 0.05 }}
            className="inner-card"
          >
            <p className="text-sm font-semibold text-[var(--ink)]">{feature.title}</p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    )
  }

  // Default: card variant
  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: delay + index * 0.08 }}
          className="panel-card p-6"
        >
          {feature.icon && (
            <div className="icon-container">
              <feature.icon className="h-5 w-5 text-[var(--accent-strong)]" />
            </div>
          )}
          <div className="flex items-center gap-3 mt-4">
            <h3 className="text-lg font-semibold text-[var(--ink)]">{feature.title}</h3>
            {feature.badge && (
              <span className="accent-pill">{feature.badge}</span>
            )}
          </div>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{feature.description}</p>
          {feature.href && (
            <Link
              href={feature.href}
              className="mt-4 accent-link"
            >
              {feature.linkText || 'Learn more'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  )
}
