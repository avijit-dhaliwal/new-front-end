"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Cpu,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const suites = [
  {
    id: 1,
    title: "Marketing Suite",
    description:
      "Complete AI-powered marketing automation for agencies and businesses. Create campaigns, manage social media, and optimize conversions.",
    icon: "marketing",
    color: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "Unlimited campaign creation",
      "Multi-platform social media posting",
      "Email sequence automation",
      "SEO content optimization",
      "Brand voice consistency",
      "Real-time performance analytics",
    ],
    pricing: "From $79/month",
  },
  {
    id: 2,
    title: "Real Estate Suite",
    description:
      "Specialized AI tools for real estate professionals. Generate property descriptions, qualify leads, and manage client communications.",
    icon: "realestate",
    color: "from-green-500 to-green-600",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    features: [
      "Automated property descriptions",
      "Lead scoring and qualification",
      "Calendar integration for showings",
      "Market trend analysis",
      "Client follow-up automation",
      "Listing optimization tools",
    ],
    pricing: "From $59/month",
  },
  {
    id: 3,
    title: "Boutique Shop Suite",
    description:
      "Perfect for small retail businesses. Manage inventory, create product descriptions, and optimize your online presence.",
    icon: "retail",
    color: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    features: [
      "Automated product descriptions",
      "Inventory level monitoring",
      "24/7 customer support chatbot",
      "Social media content creation",
      "Email marketing campaigns",
      "Sales performance tracking",
    ],
    pricing: "From $39/month",
  },
  {
    id: 4,
    title: "Healthcare Suite",
    description:
      "HIPAA-compliant AI tools for healthcare providers. Manage appointments, handle patient inquiries, and streamline administrative tasks.",
    icon: "healthcare",
    color: "from-accent-500 to-accent-600",
    iconBg: "bg-accent-50",
    iconColor: "text-accent-600",
    features: [
      "HIPAA-compliant patient communication",
      "Automated appointment scheduling",
      "Insurance verification assistance",
      "Medical document generation",
      "Patient follow-up automation",
      "Compliance reporting tools",
    ],
    pricing: "From $99/month",
  },
];

const iconMap: { [key: string]: string } = {
  marketing: "analytics",
  realestate: "home_work",
  retail: "storefront",
  healthcare: "local_hospital",
};

export default function AISuitesPage() {
  const ref = useRef(null);
  const [expandedSuites, setExpandedSuites] = useState<Set<number>>(new Set());

  const toggleExpanded = (suiteId: number) => {
    setExpandedSuites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(suiteId)) {
        newSet.delete(suiteId);
      } else {
        newSet.add(suiteId);
      }
      return newSet;
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-200/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow-orange">
                <Cpu className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              AI Solutions
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display tracking-tight"
            >
              Industry AI Suites
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Specialized AI solutions tailored for your industry. From marketing
              agencies to healthcare providers, we have the perfect suite to
              accelerate your business growth.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Suites Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {suites.map((suite, index) => (
              <motion.div
                key={suite.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all duration-300 h-full">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 ${suite.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <span className={`text-2xl ${suite.iconColor}`}>
                        {suite.icon === "marketing" && ""}
                        {suite.icon === "realestate" && ""}
                        {suite.icon === "retail" && ""}
                        {suite.icon === "healthcare" && ""}
                      </span>
                      <div className={`w-7 h-7 bg-gradient-to-br ${suite.color} rounded-lg`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 font-display mb-1">
                        {suite.title}
                      </h3>
                      <p className="text-sm text-accent-600 font-semibold">{suite.pricing}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {suite.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      What's Included
                    </h4>
                    <ul className="space-y-2">
                      {suite.features.slice(0, expandedSuites.has(suite.id) ? undefined : 4).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {suite.features.length > 4 && (
                      <button
                        onClick={() => toggleExpanded(suite.id)}
                        className="mt-3 flex items-center text-xs text-accent-600 hover:text-accent-700 font-medium transition-colors"
                      >
                        {expandedSuites.has(suite.id) ? (
                          <>
                            Show less <ChevronUp className="w-3 h-3 ml-1" />
                          </>
                        ) : (
                          <>
                            +{suite.features.length - 4} more features <ChevronDown className="w-3 h-3 ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* CTA */}
                  <Link href="/get-started" className="block">
                    <button className={`w-full py-3 px-6 rounded-full font-semibold text-sm bg-gradient-to-r ${suite.color} text-white hover:shadow-lg transition-all duration-200 flex items-center justify-center group/btn`}>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Suite CTA */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft border border-gray-100 text-center"
          >
            <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Cpu className="w-7 h-7 text-accent-600" />
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Don't See What You're Looking For?
            </h2>

            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We understand every business is unique. Our team can create a
              custom AI suite tailored specifically to your industry,
              workflow, and business needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">$</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Custom Features</h3>
                <p className="text-xs text-gray-500">Tailored AI tools for your use cases</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">~</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Integration</h3>
                <p className="text-xs text-gray-500">Seamless with your existing systems</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 text-xl">*</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Dedicated Support</h3>
                <p className="text-xs text-gray-500">Personalized onboarding & assistance</p>
              </div>
            </div>

            <Link href="/contact">
              <button className="btn-primary">
                Contact Us for Custom Suite
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-accent-100 text-lg mb-8 max-w-2xl mx-auto">
              Get started with our AI suites today and see the difference AI can make.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center bg-white text-accent-600 font-semibold py-3.5 px-7 rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
