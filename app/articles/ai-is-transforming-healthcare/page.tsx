"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Target,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import article_image_10 from "../images/article_10.jpg";

export default function AIHealthcareArticle() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-12 relative overflow-hidden noise-overlay">
        <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
        <div className="absolute -top-28 right-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/articles"
              className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </motion.div>

          {/* Article Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <span className="bg-[var(--accent-soft)] text-[var(--accent)] px-3 py-1 rounded-full text-sm font-semibold">
              Healthcare & AI
            </span>
            <div className="flex items-center text-[var(--ink-muted)] text-sm gap-4">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1.5" />
                12 min read
              </span>
              <span>Published Oct 2025</span>
            </div>
          </motion.div>

          {/* Article Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-[var(--ink)] mb-6 font-display leading-tight tracking-tight"
          >
            Smarter Care, Stronger Outcomes: How AI Is Transforming Healthcare
          </motion.h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <img src={article_image_10.src} alt="AI Transforming Healthcare" className="w-full rounded-2xl mb-12" />

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-[var(--panel)] rounded-3xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                Healthcare has always balanced two priorities: providing the best
                possible patient care and managing the complex systems that
                deliver it. Today, artificial intelligence is helping clinicians
                and administrators bridge that gap. AI is already assisting
                doctors, nurses, and veterinarians in real-world settings, cutting
                costs, improving accuracy, and allowing providers to focus more on
                patients.
              </p>
            </div>

            {/* From Buzzword to Bedside */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-4 font-display">
              From Buzzword to Bedside
            </h2>
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <p className="text-[var(--ink-muted)] mb-4">
                Not long ago, AI in medicine sounded like science fiction. Now it
                is quietly woven into daily workflows. Hospitals are using AI to
                analyze imaging scans in seconds, alert teams to patients at risk
                of sepsis, and even transcribe clinical notes during appointments.
                Reports show that AI tools are achieving accuracy comparable to
                medical experts in diagnostics, while also reducing burnout by
                taking over routine administrative work.
              </p>
              <p className="text-[var(--ink-muted)]">
                The technology is not replacing doctors, but supporting them. AI
                augments human intelligence, freeing clinicians from clerical
                burdens so they can spend more time in direct patient care.
              </p>
            </div>

            {/* Real Benefits in Practice */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Real Benefits in Practice
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Efficiency & Workflow
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  At Valley Medical Center, nurses implemented an AI platform to
                  help with utilization management. Case review rates jumped from
                  60% to 100%, and the observation admit rate rose from 4% to 13%,
                  aligning with Medicare benchmarks. Extended observation stays
                  dropped by 25%, saving money and staff time.
                </p>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Virtual Assistants & Savings
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  At OSF HealthCare, a virtual assistant became a 24/7
                  "digital front door" for patients. One in ten patients interacts
                  with it, saving $1.2M in call center costs while capturing
                  another $1.2M in additional revenue through better appointment
                  booking.
                </p>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Target className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Generative AI for Physicians
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  Mass General Brigham used an AI voice system to handle over
                  40,000 patient calls in a single week, reducing wait times from
                  30+ minutes to near zero. Nearly 10% of physicians now use
                  generative AI tools to transcribe visit notes.
                </p>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <DollarSign className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Administrative & Financial Efficiency
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  AI also optimizes billing and scheduling, reduces missed
                  appointments, predicts denied claims, and ensures faster
                  reimbursements. Clinicians gain instant access to the latest
                  medical knowledge for faster, evidence-based decisions.
                </p>
              </div>
            </div>

            {/* Smarter Diagnosis and Proactive Care */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Smarter Diagnosis and Proactive Care
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Pattern Recognition
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  AI scans colonoscopy video feeds, cardiology EKGs, radiology
                  imaging, and more to detect polyps, subtle arrhythmias, heart
                  failure risks, or suspicious areas on mammograms and eye scans,
                  acting as a second set of eyes.
                </p>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Target className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Proactive Patient Care
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  AI algorithms flag patients at risk for sepsis or post-surgery
                  complications, enabling early interventions. Healthcare systems
                  shift from reactive treatment to proactive prevention.
                </p>
              </div>
            </div>

            {/* Beyond the Hospital Walls */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Beyond the Hospital Walls
            </h2>
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <p className="text-[var(--ink-muted)]">
                AI is transforming administrative operations in dentistry,
                veterinary medicine, and outpatient clinics. Scheduling
                assistants, AI-powered phone systems, and billing platforms reduce
                errors, ensure appointments aren't missed, and optimize revenue
                capture. Clinicians also gain instant access to updated medical
                knowledge for faster, evidence-based treatment.
              </p>
            </div>

            {/* Dentistry and Veterinary */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Dentistry and Veterinary Medicine
            </h2>
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <p className="text-[var(--ink-muted)]">
                Dentists use AI to review X-rays for cavities, infections, or bone
                loss. Veterinary clinics detect dozens of dental pathologies in
                cats and dogs. AI-generated visual reports improve communication
                with owners and informed consent. AI-powered practice management
                tools automate calls and bookings, freeing staff to focus on
                patients and animals.
              </p>
            </div>

            {/* Koby AI */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Where Koby AI Fits In
            </h2>
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <p className="text-[var(--ink-muted)]">
                Koby AI builds custom automations that integrate seamlessly with
                healthcare workflows. From scheduling assistants to claims review
                and clinical documentation, these tools enhance efficiency without
                imposing rigid systems. By embedding AI thoughtfully,
                organizations can improve operational performance and patient care
                simultaneously.
              </p>
            </div>

            {/* Looking Ahead */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Looking Ahead
            </h2>
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="space-y-4">
                <p className="text-[var(--ink-muted)]">
                  Artificial intelligence is not a cure-all, but it is proving to
                  be a powerful tool. From hospitals to dental offices to
                  veterinary clinics, AI delivers measurable value: faster
                  diagnoses, lower costs, increased revenue, and improved patient
                  experiences.
                </p>
                <p className="text-[var(--ink-muted)]">
                  The future of healthcare will not be defined by humans or
                  machines alone, but by collaboration. Doctors, dentists, and
                  veterinarians who integrate AI tools gain more time, better
                  data, and stronger patient relationships.
                </p>
                <p className="text-[var(--ink-muted)]">
                  Off-the-shelf tools provide some value, but every healthcare
                  organization has unique workflows, data systems, and patient
                  populations. Custom solutions from Koby AI ensure that
                  automations strengthen existing practices rather than forcing
                  rigid processes.
                </p>
                <p className="text-[var(--ink-muted)]">
                  By embedding AI into daily operations in ways that make sense
                  for the team, organizations can improve efficiency, expand
                  capacity, and deliver better care without disrupting workflows.
                  Those who embrace AI today will set the new standard of care
                  tomorrow.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-[var(--panel)] rounded-3xl p-10 lg:p-14 shadow-[var(--shadow-soft)] border border-[var(--line)] text-center">
            <h3 className="text-2xl font-bold text-[var(--ink)] mb-4 font-display">
              Ready to Transform Your Healthcare Practice?
            </h3>
            <p className="text-[var(--ink-muted)] mb-8 max-w-xl mx-auto">
              Get expert guidance on AI-powered healthcare solutions tailored to
              your organization's needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started"
                className="btn-primary"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="btn-secondary"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
