'use client'

import { motion } from 'framer-motion'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-12 border-t border-border"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-orange-600 dark:text-orange-500">Koby AI</h2>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Koby AI Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer