'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionHeaderProps {
  /** Uppercase label above title */
  label?: string
  /** Main section title */
  title: string
  /** Section description/subtitle */
  description?: string
  /** Center align content */
  centered?: boolean
  /** Optional badge */
  badge?: string
  /** Additional content to render (e.g., side panel) */
  children?: ReactNode
  /** Animation delay offset */
  delay?: number
  /** Two-column layout with side content */
  sideContent?: ReactNode
}

export default function SectionHeader({
  label,
  title,
  description,
  centered = false,
  badge,
  children,
  delay = 0,
  sideContent,
}: SectionHeaderProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={centered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}
    >
      {/* Label + Badge */}
      {(label || badge) && (
        <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
          {label && (
            <p className="section-label">{label}</p>
          )}
          {badge && (
            <span className="accent-pill">{badge}</span>
          )}
        </div>
      )}

      {/* Title */}
      <h2 className={`${label || badge ? 'mt-4' : ''} section-title`}>
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="mt-4 section-description">
          {description}
        </p>
      )}

      {/* Additional content */}
      {children}
    </motion.div>
  )

  // If side content provided, render in two-column layout
  if (sideContent) {
    return (
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
        {content}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
        >
          {sideContent}
        </motion.div>
      </div>
    )
  }

  return content
}
