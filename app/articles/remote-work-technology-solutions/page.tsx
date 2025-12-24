"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Home,
  Target,
  Zap,
  Users,
  CheckCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

import Footer from "@/components/Footer";
import article_image_7 from "../images/article_7.jpg";

export default function RemoteWorkArticle() {
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
              Remote Work Technology: Building a Connected Workforce
            </h1>
            <div className="flex items-center justify-center space-x-6 text-[var(--ink-muted)] mb-8">
              <span className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Remote Work
              </span>
              <span>•</span>
              <span>7 min read</span>
              <span>•</span>
              <span>Published Sep 2025</span>
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
          <img src={article_image_7.src} alt="image_7" className="pb-6" />

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)]">
              <p className="text-xl text-[var(--ink-muted)] leading-relaxed mb-4">
                Remote work has transformed from a temporary solution to a
                permanent fixture in the modern workplace. Success requires the
                right technology, processes, and culture to keep teams connected
                and productive.
              </p>
              <p className="text-lg text-[var(--ink-muted)]">
                The shift to remote work has accelerated digital transformation
                across industries. Organizations that successfully enable remote
                work gain access to global talent, reduce overhead costs, and
                often see improved employee satisfaction and productivity.
              </p>
            </div>

            {/* The Remote Work Revolution */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6">
                The Remote Work Revolution
              </h2>
              <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                  However, effective remote work requires more than just sending
                  employees home with laptops. It demands a comprehensive
                  technology strategy that enables collaboration, maintains
                  security, and preserves company culture across distributed
                  teams.
                </p>
              </div>
            </div>

            {/* Essential Remote Work Technologies */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
                Essential Remote Work Technologies
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <div className="flex items-center mb-4">
                    <Users className="w-8 h-8 text-[var(--accent)] mr-3" />
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      Communication Tools
                    </h3>
                  </div>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Video Conferencing: Zoom, Microsoft Teams, Google Meet
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Instant Messaging: Slack, Microsoft Teams Chat, Discord
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Async Communication: Loom, Notion, Confluence
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Virtual Phone Systems: RingCentral, 8x8, Vonage
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <div className="flex items-center mb-4">
                    <Target className="w-8 h-8 text-[var(--accent)] mr-3" />
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      Collaboration Platforms
                    </h3>
                  </div>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Project Management: Asana, Trello, Monday.com, Jira
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Document Collaboration: Google Workspace, Microsoft 365,
                      Dropbox
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Virtual Whiteboards: Miro, Mural, Figma
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Code Collaboration: GitHub, GitLab, Bitbucket
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <div className="flex items-center mb-4">
                    <Shield className="w-8 h-8 text-[var(--accent)] mr-3" />
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      Security and Access
                    </h3>
                  </div>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      VPN Solutions: NordLayer, Perimeter 81, ExpressVPN
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Zero Trust Security: Cloudflare Access, Zscaler, Palo Alto
                      Prisma
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Password Management: 1Password, LastPass, Dashlane
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Multi-Factor Authentication: Duo, Okta, Auth0
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <div className="flex items-center mb-4">
                    <Zap className="w-8 h-8 text-[var(--accent)] mr-3" />
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      Employee Experience
                    </h3>
                  </div>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Virtual Desktop: Citrix, VMware Horizon, Amazon WorkSpaces
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Time Tracking: Toggl, Harvest, RescueTime
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Employee Engagement: 15Five, Culture Amp, Officevibe
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Learning Platforms: Udemy Business, LinkedIn Learning,
                      Coursera
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Building a Remote Work Infrastructure */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
                Building a Remote Work Infrastructure
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-xl font-semibold text-[var(--ink)] mb-4">
                    Network Requirements
                  </h3>
                  <p className="text-[var(--ink-muted)] mb-4">
                    Ensure employees have reliable internet connections with
                    sufficient bandwidth for video calls and file transfers.
                    Consider providing internet stipends or mobile hotspots for
                    critical roles.
                  </p>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-xl font-semibold text-[var(--ink)] mb-4">
                    Hardware Provisioning
                  </h3>
                  <p className="text-[var(--ink-muted)] mb-4">
                    Standardize hardware configurations and establish processes
                    for shipping, setup, and return of equipment. Include
                    laptops, monitors, keyboards, mice, and ergonomic
                    accessories.
                  </p>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-xl font-semibold text-[var(--ink)] mb-4">
                    Software Licensing
                  </h3>
                  <p className="text-[var(--ink-muted)] mb-4">
                    Manage software licenses centrally and ensure all remote
                    workers have access to necessary applications. Consider
                    cloud-based solutions that don't require local installation.
                  </p>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-xl font-semibold text-[var(--ink)] mb-4">
                    IT Support
                  </h3>
                  <p className="text-[var(--ink-muted)] mb-4">
                    Establish remote support capabilities including help desk
                    software, remote desktop tools, and self-service resources.
                    Ensure support hours align with distributed team schedules.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Best Practices */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
                Security Best Practices
              </h2>
              <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--accent)] mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[var(--ink)]">
                          Endpoint Security
                        </h4>
                        <p className="text-[var(--ink-muted)] text-sm">
                          Deploy antivirus, firewall, and endpoint detection on
                          all devices
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--accent)] mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[var(--ink)]">
                          Data Encryption
                        </h4>
                        <p className="text-[var(--ink-muted)] text-sm">
                          Encrypt data at rest and in transit
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--accent)] mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[var(--ink)]">
                          Access Control
                        </h4>
                        <p className="text-[var(--ink-muted)] text-sm">
                          Implement role-based access and principle of least
                          privilege
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--accent)] mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[var(--ink)]">
                          Regular Updates
                        </h4>
                        <p className="text-[var(--ink-muted)] text-sm">
                          Automate OS and software updates
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--accent)] mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[var(--ink)]">
                          Security Training
                        </h4>
                        <p className="text-[var(--ink-muted)] text-sm">
                          Educate employees on phishing and social engineering
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--accent)] mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[var(--ink)]">
                          Secure Networks
                        </h4>
                        <p className="text-[var(--ink-muted)] text-sm">
                          Use VPNs and secure Wi-Fi connections
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--accent)] mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[var(--ink)]">
                          Device Management
                        </h4>
                        <p className="text-[var(--ink-muted)] text-sm">
                          Implement mobile device management (MDM) solutions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--accent)] mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[var(--ink)]">
                          Incident Response
                        </h4>
                        <p className="text-[var(--ink-muted)] text-sm">
                          Have clear procedures for security incidents
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Managing Remote Teams */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
                Managing Remote Teams
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-4">
                    Performance Management
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Focus on outcomes rather than hours worked
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Set clear expectations and measurable goals
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Regular one-on-ones and feedback sessions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Use OKRs or similar frameworks for alignment
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-4">
                    Communication Strategies
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Overcommunicate to compensate for lack of casual
                      interaction
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Use video when possible to maintain personal connection
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Establish communication protocols and response time
                      expectations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Create virtual office hours for informal discussions
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-4">
                    Work-Life Balance
                  </h3>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Respect time zones and working hours
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Encourage regular breaks and time off
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Provide mental health resources and support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] mr-2" />
                      Lead by example with healthy boundaries
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6">
                Conclusion
              </h2>
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                Successful remote work requires thoughtful implementation of
                technology, processes, and culture. By investing in the right
                tools, establishing clear communication protocols, and
                prioritizing employee experience, organizations can build
                thriving distributed teams.
              </p>
              <p className="text-lg text-[var(--ink-muted)]">
                The future of work is flexible, and organizations that master
                remote work technology and practices will have significant
                competitive advantages in attracting talent, reducing costs, and
                adapting to changing business conditions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
