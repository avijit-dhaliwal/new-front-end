"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Users,
  Shield,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

import Footer from "@/components/Footer";
import article_image_3 from "../images/article_3.jpg";

export default function AIMLArticle() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      
      <NavBar />

      <div className="pt-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link
            href="/articles"
            className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors duration-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Articles
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 mb-12"
        >
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--ink)] mb-6 font-display">
              Leveraging AI and Machine Learning for Business Growth
            </h1>
            <div className="flex items-center justify-center space-x-6 text-[var(--ink-muted)] mb-8">
              <span className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI & Machine Learning
              </span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>Published Dec 2024</span>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 mb-16"
        >
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)]">
              <p className="text-xl text-[var(--ink-muted)] leading-relaxed mb-4">
                Artificial Intelligence and Machine Learning are transforming
                businesses across all industries. These technologies enable
                organizations to automate processes, gain insights from data,
                and create innovative products and services.
              </p>
              <p className="text-lg text-[var(--ink-muted)]">
                Discover practical applications of artificial intelligence and
                machine learning that can transform your business operations and
                drive innovation.
              </p>
            </div>

            <img src={article_image_3.src} alt="image_3" className="mb-5" />

            {/* Understanding AI and Machine Learning */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6">
                Understanding AI and Machine Learning
              </h2>
              <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center">
                      <Brain className="w-6 h-6 mr-3 text-[var(--accent)]" />
                      Artificial Intelligence (AI)
                    </h3>
                    <p className="text-[var(--ink-muted)] mb-4">
                      AI refers to computer systems that can perform tasks
                      typically requiring human intelligence, such as visual
                      perception, speech recognition, decision-making, and
                      language translation.
                    </p>
                    <ul className="space-y-2 text-[var(--ink-muted)]">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                        Pattern recognition
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                        Natural language processing
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                        Decision making
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-3 text-[var(--accent)]" />
                      Machine Learning (ML)
                    </h3>
                    <p className="text-[var(--ink-muted)] mb-4">
                      ML is a subset of AI that enables systems to automatically
                      learn and improve from experience without being explicitly
                      programmed.
                    </p>
                    <ul className="space-y-2 text-[var(--ink-muted)]">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                        Predictive analytics
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                        Data pattern recognition
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                        Automated decision making
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Business Applications */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
                Key Business Applications
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <div className="flex items-center mb-4">
                    <Users className="w-8 h-8 text-[var(--accent)] mr-3" />
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      Customer Service Automation
                    </h3>
                  </div>
                  <p className="text-[var(--ink-muted)] mb-4">
                    AI-powered chatbots and virtual assistants can handle
                    customer inquiries 24/7, providing instant responses and
                    freeing up human agents for complex issues.
                  </p>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="w-8 h-8 text-[var(--accent)] mr-3" />
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      Predictive Analytics
                    </h3>
                  </div>
                  <p className="text-[var(--ink-muted)] mb-4">
                    Machine learning models analyze historical data to predict
                    future trends, helping businesses make informed decisions
                    about inventory, pricing, and market strategies.
                  </p>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <div className="flex items-center mb-4">
                    <Zap className="w-8 h-8 text-[var(--accent)] mr-3" />
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      Process Automation
                    </h3>
                  </div>
                  <p className="text-[var(--ink-muted)] mb-4">
                    Robotic Process Automation (RPA) combined with AI can
                    automate repetitive tasks, reducing errors and improving
                    efficiency across operations.
                  </p>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <div className="flex items-center mb-4">
                    <Target className="w-8 h-8 text-[var(--accent)] mr-3" />
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      Personalization
                    </h3>
                  </div>
                  <p className="text-[var(--ink-muted)] mb-4">
                    AI algorithms analyze customer behavior to deliver
                    personalized experiences, recommendations, and marketing
                    messages that increase engagement and sales.
                  </p>
                </div>
              </div>
            </div>

            {/* Industry-Specific Applications */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
                Industry-Specific Applications
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-3">
                    Healthcare
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Medical diagnosis assistance
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Drug discovery
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Patient monitoring
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Treatment optimization
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-3">
                    Finance
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Algorithmic trading
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Credit scoring
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Risk management
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Fraud prevention
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-3">
                    Retail & E-commerce
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Inventory management
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Price optimization
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Customer service chatbots
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Visual search
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-3">
                    Manufacturing
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Predictive maintenance
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Quality control
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Supply chain optimization
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Production planning
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-3">
                    Marketing
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Content generation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Ad targeting
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Customer segmentation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Campaign optimization
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-3">
                    Human Resources
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Resume screening
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Employee retention
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Performance analysis
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Training recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Implementation Strategy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
                Implementation Strategy
              </h2>
              <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                        Identify Use Cases
                      </h3>
                      <p className="text-[var(--ink-muted)]">
                        Start with specific business problems that AI can solve
                        effectively.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                        Assess Data Readiness
                      </h3>
                      <p className="text-[var(--ink-muted)]">
                        Ensure you have quality data to train and deploy AI
                        models.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                        Start Small
                      </h3>
                      <p className="text-[var(--ink-muted)]">
                        Begin with pilot projects to demonstrate value and build
                        expertise.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                        Build or Buy
                      </h3>
                      <p className="text-[var(--ink-muted)]">
                        Decide whether to develop custom solutions or use
                        existing platforms.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                        Train Your Team
                      </h3>
                      <p className="text-[var(--ink-muted)]">
                        Invest in upskilling employees to work with AI
                        technologies.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                        Measure Impact
                      </h3>
                      <p className="text-[var(--ink-muted)]">
                        Track KPIs to quantify the business value of AI
                        initiatives.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      7
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                        Scale Gradually
                      </h3>
                      <p className="text-[var(--ink-muted)]">
                        Expand successful pilots across the organization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6">
                Conclusion
              </h2>
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                AI and Machine Learning are powerful tools that can transform
                your business operations and drive significant growth. By
                understanding the applications, choosing the right use cases,
                and implementing strategically, businesses can unlock new
                opportunities and stay competitive in today's digital landscape.
              </p>
              <p className="text-lg text-[var(--ink-muted)]">
                The key to success is starting with clear objectives, ensuring
                data quality, and gradually scaling your AI/ML initiatives. With
                the right approach, these technologies can deliver measurable
                results and provide a sustainable competitive advantage.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
