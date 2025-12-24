"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import LandingHero from "@/components/LandingHero";
import PlatformDepthSection from "@/components/PlatformDepthSection";
import DemosSection from "@/components/DemosSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import UseCasesSection from "@/components/UseCasesSection";
import EthicsSection from "@/components/EthicsSection";
import NewTestimonialsSection from "@/components/NewTestimonialsSection";
import TrustedBySection from "@/components/TrustedBySection";
import FAQSection from "@/components/FAQSection";
import SimplePricingSection from "@/components/SimplePricingSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-[var(--paper)]">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <LandingHero />
        <UseCasesSection />
        <PlatformDepthSection />
        <DemosSection />
        <EthicsSection />
        <TrustedBySection />
        <IntegrationsSection />
        <NewTestimonialsSection />
        <SimplePricingSection />
        <FAQSection />
        <Footer />
      </motion.div>
    </main>
  );
}
