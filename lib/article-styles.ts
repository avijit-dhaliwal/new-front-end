// Theme-aware styling utilities for articles

export const articleStyles = {
  // Card and container styles
  card: 'bg-card border border-border',
  cardHover: 'hover:shadow-xl hover:border-orange-500/30 transition-all duration-300',

  // Background variations for sections
  sectionHighlight: 'bg-gradient-to-r from-orange-500/5 to-orange-600/5 dark:from-orange-500/10 dark:to-orange-600/10 border border-orange-500/20',
  sectionInfo: 'bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20',
  sectionWarning: 'bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20',
  sectionDanger: 'bg-red-500/5 dark:bg-red-500/10 border border-red-500/20',
  sectionSuccess: 'bg-green-500/5 dark:bg-green-500/10 border border-green-500/20',
  sectionPurple: 'bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20',

  // Alert/callout styles
  alertInfo: 'bg-blue-500/10 border-l-4 border-blue-500 dark:bg-blue-500/20',
  alertWarning: 'bg-yellow-500/10 border-l-4 border-yellow-500 dark:bg-yellow-500/20',
  alertDanger: 'bg-red-500/10 border-l-4 border-red-500 dark:bg-red-500/20',
  alertSuccess: 'bg-green-500/10 border-l-4 border-green-500 dark:bg-green-500/20',

  // Text styles
  heading: 'text-foreground font-bold',
  subheading: 'text-foreground font-semibold',
  bodyText: 'text-foreground',
  accentText: 'text-orange-500 dark:text-orange-400',

  // Code blocks
  codeBlock: 'bg-muted/50 border border-border rounded-lg p-4 font-mono text-sm text-foreground',

  // Badges
  badge: 'inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-500 rounded-full text-xs font-semibold border border-orange-500/30',
  badgeSecondary: 'inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold border border-border',

  // Lists
  listItem: 'text-foreground',
  listItemStrong: 'text-foreground font-bold',

  // Gradients
  gradientOrange: 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 dark:from-orange-500/20 dark:to-orange-600/20',
  gradientBlue: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
  gradientPurple: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20',
  gradientGreen: 'bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20',
}