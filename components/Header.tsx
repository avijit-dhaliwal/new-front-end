'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, Sun, Moon } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/components/ThemeProvider'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/koby-logo.png"
                  alt="Koby AI Logo"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                Koby AI
              </span>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {['Home', 'Our Services', 'Articles', 'Contact'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                    href={
                      item === "Articles"
                        ? "/articles"
                        : item === "Our Services"
                        ? "/#services"
                        : item === "Home"
                        ? "/"
                        : `#${item.toLowerCase()}`
                    }
                    className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300" />
                  </Link>
              </motion.div>
            ))}
            
            {/* Login temporarily removed */}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div
                  initial={false}
                  animate={{
                    rotate: theme === 'dark' ? 0 : 180,
                    scale: theme === 'dark' ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{
                    rotate: theme === 'light' ? 0 : -180,
                    scale: theme === 'light' ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="#contact">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
                >
                  Book a Demo
                </Button>
              </Link>
            </motion.div>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </motion.div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              {['Home', 'Our Services', 'Articles', 'Contact'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item === 'Articles' ? '/articles' : `#${item === 'Our Services' ? 'services' : item.toLowerCase()}`}
                    className="text-sm hover:text-orange-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
              <Link href="#contact" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  Book a Demo
                </Button>
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}
