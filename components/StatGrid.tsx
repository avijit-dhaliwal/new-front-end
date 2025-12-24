'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatItem {
  /** The stat value (e.g., "24/7", "99.9%", "$50") */
  value: string
  /** Label below the value */
  label: string
  /** Optional icon */
  icon?: LucideIcon
  /** Optional description */
  description?: string
}

interface StatGridProps {
  /** Array of stats to display */
  stats: StatItem[]
  /** Number of columns (default: auto based on count) */
  columns?: 2 | 3 | 4
  /** Variant: 'card' for panel cards, 'inline' for minimal */
  variant?: 'card' | 'inline' | 'compact'
  /** Animation delay offset */
  delay?: number
}

export default function StatGrid({
  stats,
  columns,
  variant = 'card',
  delay = 0,
}: StatGridProps) {
  // Auto-determine columns if not specified
  const colCount = columns || (stats.length <= 3 ? stats.length : 4)
  
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }

  if (variant === 'inline') {
    return (
      <div className={`grid ${gridCols[colCount as keyof typeof gridCols]} gap-6 lg:gap-10`}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + index * 0.1 }}
            className="text-center"
          >
            {stat.icon && (
              <div className="icon-container-sm mx-auto mb-3">
                <stat.icon className="h-4 w-4 text-[var(--accent-strong)]" />
              </div>
            )}
            <p className="text-3xl sm:text-4xl font-semibold text-[var(--ink)]">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">{stat.label}</p>
            {stat.description && (
              <p className="mt-2 text-sm text-[var(--ink-muted)]">{stat.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`grid ${gridCols[colCount as keyof typeof gridCols]} gap-3`}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + index * 0.05 }}
            className="stat-card"
          >
            <p className="text-lg font-semibold text-[var(--ink)]">{stat.value}</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    )
  }

  // Default: card variant
  return (
    <div className={`grid ${gridCols[colCount as keyof typeof gridCols]} gap-4`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + index * 0.1 }}
          className="panel-card-sm p-4"
        >
          {stat.icon && (
            <div className="icon-container-sm mb-3">
              <stat.icon className="h-4 w-4 text-[var(--accent-strong)]" />
            </div>
          )}
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{stat.value}</p>
          {stat.description && (
            <p className="mt-2 text-sm text-[var(--ink-muted)]">{stat.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  )
}
