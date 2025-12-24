'use client'

type Tone = 'success' | 'warning' | 'critical' | 'info' | 'neutral'

interface StatusPillProps {
  label: string
  tone?: Tone
}

const toneStyles: Record<Tone, string> = {
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  info: 'bg-[var(--accent-soft)] text-[var(--accent-strong)]',
  neutral: 'bg-[var(--paper-muted)] text-[var(--ink-muted)]',
}

export default function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
      {label}
    </span>
  )
}
