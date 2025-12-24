'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface InfoCardProps {
  /** Card title */
  title: string
  /** Card description */
  description?: string
  /** Optional icon */
  icon?: LucideIcon
  /** Optional badge */
  badge?: string
  /** Optional link */
  href?: string
  /** Link text (default: "Learn more") */
  linkText?: string
  /** Variant: 'default', 'highlight', 'compact' */
  variant?: 'default' | 'highlight' | 'compact'
  /** Optional children for custom content */
  children?: ReactNode
  /** Animation delay */
  delay?: number
  /** Whether the card is interactive (adds hover effects) */
  interactive?: boolean
}

export default function InfoCard({
  title,
  description,
  icon: Icon,
  badge,
  href,
  linkText = 'Learn more',
  variant = 'default',
  children,
  delay = 0,
  interactive = false,
}: InfoCardProps) {
  const baseClasses = interactive
    ? 'panel-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer'
    : 'panel-card p-5'

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={variant === 'highlight' ? `${baseClasses} border-[var(--accent-soft)]` : baseClasses}
    >
      {variant === 'compact' ? (
        // Compact variant - horizontal layout
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="icon-container-sm shrink-0">
              <Icon className="h-4 w-4 text-[var(--accent-strong)]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--ink)] truncate">{title}</p>
              {badge && <span className="accent-pill shrink-0">{badge}</span>}
            </div>
            {description && (
              <p className="mt-1 text-xs text-[var(--ink-muted)]">{description}</p>
            )}
            {children}
          </div>
        </div>
      ) : (
        // Default and highlight variants - vertical layout
        <>
          <div className="flex items-center justify-between">
            {Icon ? (
              <div className="icon-container">
                <Icon className="h-5 w-5 text-[var(--accent-strong)]" />
              </div>
            ) : (
              <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
            )}
            {badge && <span className="accent-pill">{badge}</span>}
          </div>
          {Icon && (
            <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{title}</h3>
          )}
          {description && (
            <p className={`${Icon ? 'mt-2' : 'mt-3'} text-sm text-[var(--ink-muted)]`}>{description}</p>
          )}
          {children}
          {href && (
            <Link href={href} className="mt-4 accent-link">
              {linkText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
        </>
      )}
    </motion.div>
  )

  // If interactive and has href, wrap entire card in link
  if (interactive && href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

// Nested component for card content sections
InfoCard.Content = function InfoCardContent({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mt-4 ${className}`}>{children}</div>
}

// Nested component for card tags
InfoCard.Tags = function InfoCardTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  )
}

// Nested component for card stats
InfoCard.Stats = function InfoCardStats({
  stats,
}: {
  stats: Array<{ label: string; value: string }>
}) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <p className="text-lg font-semibold text-[var(--ink)]">{stat.value}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
