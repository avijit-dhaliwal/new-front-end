'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from '@/components/LoadingScreen'
import NavBar from '@/components/NavBar'
import LandingHero from '@/components/LandingHero'
import AnimatedBackground from '@/components/AnimatedBackground'
import FloatingFeaturesCarousel from '@/components/FloatingFeaturesCarousel'
import NewTestimonialsSection from '@/components/NewTestimonialsSection'
import SimplePricingSection from '@/components/SimplePricingSection'
import Footer from '@/components/Footer'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <main className="relative min-h-screen bg-white">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <NavBar />
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <LandingHero />
        <FloatingFeaturesCarousel />
        <NewTestimonialsSection />
        <SimplePricingSection />
        <Footer />
      </motion.div>
    </main>
  )
}