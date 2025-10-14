'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Settings, Target, Zap, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

export default function DevOpsImplementationArticle() {
  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />
      
      <div className="pt-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link href="/articles" className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-100">
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
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
              DevOps Implementation: From Theory to Practice
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
              <span className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                DevOps
              </span>
              <span>•</span>
              <span>9 min read</span>
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
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
                DevOps is a set of practices that combines software development and IT operations. It aims to shorten the systems development life cycle and provide continuous delivery with high software quality.
              </p>
              <p className="text-lg text-gray-600">
                Learn how to implement DevOps practices in your organization to improve collaboration, automation, and continuous delivery.
              </p>
            </div>

            {/* What is DevOps */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">What is DevOps?</h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  DevOps is a cultural and technical movement that emphasizes collaboration between development and operations teams. It focuses on automating and streamlining the software development and deployment process to deliver value to customers faster and more reliably.
                </p>
                <p className="text-gray-600">
                  The core principle of DevOps is breaking down silos between teams and creating a culture of shared responsibility for the entire software lifecycle, from development through production.
                </p>
              </div>
            </div>

            {/* Key DevOps Practices */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Key DevOps Practices</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Zap className="w-8 h-8 text-blue-500 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Continuous Integration (CI)</h3>
                  </div>
                  <p className="text-gray-600">
                    Continuous Integration is the practice of merging all developer working copies to a shared mainline several times a day. It involves automated building and testing of code changes to detect integration problems early.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Target className="w-8 h-8 text-green-500 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Continuous Delivery (CD)</h3>
                  </div>
                  <p className="text-gray-600">
                    Continuous Delivery extends CI by ensuring that code is always in a deployable state. Every change that passes automated tests can be released to production at the push of a button.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Settings className="w-8 h-8 text-purple-500 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Infrastructure as Code (IaC)</h3>
                  </div>
                  <p className="text-gray-600">
                    Infrastructure as Code involves managing and provisioning computing infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Users className="w-8 h-8 text-orange-500 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Communication and Collaboration</h3>
                  </div>
                  <p className="text-gray-600">
                    DevOps emphasizes increased communication and collaboration between development, operations, and other stakeholders throughout the software delivery lifecycle.
                  </p>
                </div>
              </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Implementation Roadmap</h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Phase 1: Assessment and Planning</h3>
                      <p className="text-gray-600">Begin by assessing your current development and operations processes. Identify pain points, bottlenecks, and areas for improvement. Define clear goals and metrics for your DevOps transformation.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Phase 2: Build the Foundation</h3>
                      <p className="text-gray-600">Establish version control systems, set up CI/CD pipelines, and implement basic automation. Start with small, low-risk projects to build confidence and demonstrate value.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Phase 3: Expand and Scale</h3>
                      <p className="text-gray-600">Gradually expand DevOps practices to more teams and projects. Implement Infrastructure as Code, enhance monitoring capabilities, and automate more processes.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Phase 4: Optimize and Innovate</h3>
                      <p className="text-gray-600">Continuously improve processes based on metrics and feedback. Explore advanced practices like chaos engineering, progressive delivery, and AI-powered operations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Essential DevOps Tools */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Essential DevOps Tools</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Version Control</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Git
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      GitHub/GitLab/Bitbucket
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">CI/CD</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Jenkins
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      GitLab CI
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      GitHub Actions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      CircleCI
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuration Management</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Ansible
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Puppet
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Chef
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Terraform
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Containerization</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Docker
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Kubernetes
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Docker Compose
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Monitoring</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Prometheus
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Grafana
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ELK Stack
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Datadog
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Best Practices</h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Start Small</h4>
                        <p className="text-gray-600 text-sm">Begin with pilot projects before scaling across the organization</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Automate Everything</h4>
                        <p className="text-gray-600 text-sm">Automate repetitive tasks to reduce errors and save time</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Measure Everything</h4>
                        <p className="text-gray-600 text-sm">Track metrics to understand impact and guide improvements</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Foster Collaboration</h4>
                        <p className="text-gray-600 text-sm">Break down silos between teams</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Embrace Failure</h4>
                        <p className="text-gray-600 text-sm">Learn from failures and implement blameless post-mortems</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Continuous Learning</h4>
                        <p className="text-gray-600 text-sm">Invest in training and skill development</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Security First</h4>
                        <p className="text-gray-600 text-sm">Integrate security into every stage of the pipeline (DevSecOps)</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Document Processes</h4>
                        <p className="text-gray-600 text-sm">Maintain clear documentation for all processes and procedures</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Conclusion</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                DevOps implementation is a journey, not a destination. It requires commitment, cultural change, and continuous improvement. By following the practices and principles outlined in this guide, organizations can achieve faster delivery, improved quality, and better collaboration between teams.
              </p>
              <p className="text-lg text-gray-600">
                Remember that successful DevOps transformation goes beyond tools and technology—it's fundamentally about people, processes, and culture. Start small, measure progress, and continuously iterate to build a robust DevOps practice that delivers value to your customers.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
