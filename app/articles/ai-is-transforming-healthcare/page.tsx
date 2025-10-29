"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Target,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";

export default function AIHealthcareArticle() {
  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />

      <div className="pt-20 max-w-4xl mx-auto px-6 sm:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="py-8"
        >
          <Link
            href="/articles"
            className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-100"
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
            Smarter Care, Stronger Outcomes: How AI Is Transforming Healthcare
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
            <span className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Healthcare & AI
            </span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span>Published Oct 2025</span>
          </div>
        </motion.div>

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            From Buzzword to Bedside
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <p className="text-gray-600 mb-4">
              Not long ago, AI in medicine sounded like science fiction. Now it
              is quietly woven into daily workflows. Hospitals are using AI to
              analyze imaging scans in seconds, alert teams to patients at risk
              of sepsis, and even transcribe clinical notes during appointments.
              Reports show that AI tools are achieving accuracy comparable to
              medical experts in diagnostics, while also reducing burnout by
              taking over routine administrative work.
            </p>
            <p className="text-gray-600 mb-8">
              The technology is not replacing doctors, but supporting them. AI
              augments human intelligence, freeing clinicians from clerical
              burdens so they can spend more time in direct patient care.
            </p>
          </div>

          {/* Real Benefits in Practice */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Real Benefits in Practice
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Efficiency & Workflow
                </h3>
              </div>
              <p className="text-gray-600">
                At Valley Medical Center, nurses implemented an AI platform to
                help with utilization management. Case review rates jumped from
                60% to 100%, and the observation admit rate rose from 4% to 13%,
                aligning with Medicare benchmarks. Extended observation stays
                dropped by 25%, saving money and staff time. Nurses reported
                feeling “relieved” that the system guided them to the right
                cases.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Virtual Assistants & Savings
                </h3>
              </div>
              <p className="text-gray-600">
                At OSF HealthCare, a virtual assistant named Clare became a 24/7
                “digital front door” for patients. One in ten patients interacts
                with Clare, saving $1.2M in call center costs while capturing
                another $1.2M in additional revenue through better appointment
                booking. Patients enjoy faster access without waiting on hold.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Generative AI for Physicians
                </h3>
              </div>
              <p className="text-gray-600">
                Mass General Brigham used an AI voice system to handle over
                40,000 patient calls in a single week, reducing wait times from
                30+ minutes to near zero. Nearly 10% of physicians now use
                generative AI tools to transcribe visit notes, improving
                accuracy, reducing typing, and increasing patient engagement.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <DollarSign className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Administrative & Financial Efficiency
                </h3>
              </div>
              <p className="text-gray-600">
                AI also optimizes billing and scheduling, reduces missed
                appointments, predicts denied claims, and ensures faster
                reimbursements. Clinicians gain instant access to the latest
                medical knowledge, supporting faster, evidence-based decisions.
              </p>
            </div>
          </div>

          {/* Smarter Diagnosis and Proactive Care */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Smarter Diagnosis and Proactive Care
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Pattern Recognition
                </h3>
              </div>
              <p className="text-gray-600">
                AI scans colonoscopy video feeds, cardiology EKGs, radiology
                imaging, and more to detect polyps, subtle arrhythmias, heart
                failure risks, or suspicious areas on mammograms and eye scans,
                acting as a second set of eyes.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Proactive Patient Care
                </h3>
              </div>
              <p className="text-gray-600">
                AI algorithms flag patients at risk for sepsis or post-surgery
                complications, enabling early interventions. Healthcare systems
                shift from reactive treatment to proactive prevention.
              </p>
            </div>
          </div>

          {/* Beyond the Hospital Walls */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Beyond the Hospital Walls
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <p className="text-gray-600 mb-8">
              AI is transforming administrative operations in dentistry,
              veterinary medicine, and outpatient clinics. Scheduling
              assistants, AI-powered phone systems, and billing platforms reduce
              errors, ensure appointments aren’t missed, and optimize revenue
              capture. Clinicians also gain instant access to updated medical
              knowledge for faster, evidence-based treatment.
            </p>
          </div>
          {/* Dentistry and Veterinary */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Dentistry and Veterinary Medicine
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <p className="text-gray-600 mb-8">
              Dentists use AI to review X-rays for cavities, infections, or bone
              loss. Veterinary clinics detect dozens of dental pathologies in
              cats and dogs. AI-generated visual reports improve communication
              with owners and informed consent. AI-powered practice management
              tools automate calls and bookings, freeing staff to focus on
              patients and animals.
            </p>
          </div>
          {/* Koby AI */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Where Koby AI Fits In
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <p className="text-gray-600 mb-8">
              Koby AI builds custom automations that integrate seamlessly with
              healthcare workflows. From scheduling assistants to claims review
              and clinical documentation, these tools enhance efficiency without
              imposing rigid systems. By embedding AI thoughtfully,
              organizations can improve operational performance and patient care
              simultaneously.
            </p>
          </div>
          {/* Looking Ahead */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Looking Ahead
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <div className="space-y-4">
              <p className="text-gray-600">
                Artificial intelligence is not a cure-all, but it is proving to
                be a powerful tool. From hospitals to dental offices to
                veterinary clinics, AI delivers measurable value: faster
                diagnoses, lower costs, increased revenue, and improved patient
                experiences.
              </p>
              <p className="text-gray-600">
                The future of healthcare will not be defined by humans or
                machines alone, but by collaboration. Doctors, dentists, and
                veterinarians who integrate AI tools gain more time, better
                data, and stronger patient relationships.
              </p>
              <p className="text-gray-600">
                Off-the-shelf tools provide some value, but every healthcare
                organization has unique workflows, data systems, and patient
                populations. Custom solutions from Koby AI ensure that
                automations strengthen existing practices rather than forcing
                rigid processes.
              </p>
              <p className="text-gray-600">
                By embedding AI into daily operations in ways that make sense
                for the team, organizations can improve efficiency, expand
                capacity, and deliver better care without disrupting workflows.
                Those who embrace AI today will set the new standard of care
                tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
