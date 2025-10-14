'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface KobyLogoProps {
  className?: string
  animated?: boolean
}

export default function KobyLogo({ className = "w-8 h-8", animated = false }: KobyLogoProps) {
  const LogoComponent = () => (
    <Image
      src="/logo.png"
      alt="Koby AI Logo"
      width={100}
      height={100}
      className={`${className} rounded-lg`}
      priority
    />
  )

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <LogoComponent />
      </motion.div>
    )
  }

  return <LogoComponent />
}
