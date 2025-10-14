'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Target, Zap, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

export default function DataBackupArticle() {
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
              Data Backup and Disaster Recovery Strategies
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
              <span className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Infrastructure
              </span>
              <span>•</span>
              <span>11 min read</span>
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
                Data is the lifeblood of modern businesses. Protecting it from loss and ensuring rapid recovery from disasters is critical for business continuity and success.
              </p>
              <p className="text-lg text-gray-600">
                Data backup and disaster recovery are two critical components of a comprehensive data protection strategy. While backup focuses on creating copies of data for restoration, disaster recovery encompasses the entire process of resuming operations after a catastrophic event.
              </p>
            </div>

            {/* Understanding Data Backup and Recovery */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Understanding Data Backup and Recovery</h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  The importance of these strategies cannot be overstated. Data loss can result from hardware failures, human error, cyberattacks, or natural disasters. Without proper backup and recovery plans, businesses risk permanent data loss, extended downtime, and significant financial impacts.
                </p>
              </div>
            </div>

            {/* The 3-2-1 Backup Rule */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">The 3-2-1 Backup Rule</h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  The 3-2-1 rule is a fundamental principle of data backup:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">3</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">3 copies of data</h3>
                    <p className="text-gray-600">Keep at least three copies of important data (one primary and two backups)</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">2</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2 different media types</h3>
                    <p className="text-gray-600">Store copies on two different types of storage media</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">1</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">1 offsite backup</h3>
                    <p className="text-gray-600">Keep one backup copy offsite or in the cloud</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-6">
                  This approach ensures data protection against various failure scenarios, from local hardware failures to site-wide disasters.
                </p>
              </div>
            </div>

            {/* Types of Backup */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Types of Backup</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Full Backup</h3>
                  <p className="text-gray-600 mb-4">A complete copy of all data. While comprehensive, full backups require significant storage space and time. They serve as the foundation for other backup types and are essential for complete system restoration.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Incremental Backup</h3>
                  <p className="text-gray-600 mb-4">Backs up only data that has changed since the last backup (full or incremental). This method saves storage space and time but requires all incremental backups in the chain for complete restoration.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Differential Backup</h3>
                  <p className="text-gray-600 mb-4">Backs up all data changed since the last full backup. While requiring more storage than incremental backups, differential backups simplify restoration by only needing the last full backup and the latest differential.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Synthetic Full Backup</h3>
                  <p className="text-gray-600 mb-4">Creates a full backup by combining a previous full backup with subsequent incremental backups. This reduces network load and backup window requirements while maintaining the benefits of full backups.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Continuous Data Protection (CDP)</h3>
                  <p className="text-gray-600 mb-4">Captures every change to data in real-time or near-real-time, allowing restoration to any point in time. CDP provides the most granular recovery options but requires significant resources.</p>
                </div>
              </div>
            </div>

            {/* Disaster Recovery Planning */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Disaster Recovery Planning</h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Key Metrics</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Recovery Time Objective (RTO)</h4>
                        <p className="text-gray-600 text-sm">Maximum acceptable time to restore operations</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Recovery Point Objective (RPO)</h4>
                        <p className="text-gray-600 text-sm">Maximum acceptable data loss measured in time</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Maximum Tolerable Downtime (MTD)</h4>
                        <p className="text-gray-600 text-sm">Time after which business viability is threatened</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Work Recovery Time (WRT)</h4>
                        <p className="text-gray-600 text-sm">Time to verify system integrity and functionality</p>
                      </div>
                    </div>
                  </div>
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
                        <h4 className="font-semibold text-gray-800">Regular Testing</h4>
                        <p className="text-gray-600 text-sm">Test backup and recovery procedures regularly to ensure they work when needed</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Documentation</h4>
                        <p className="text-gray-600 text-sm">Maintain detailed documentation of all backup and recovery procedures</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Automation</h4>
                        <p className="text-gray-600 text-sm">Automate backup processes to reduce human error and ensure consistency</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Encryption</h4>
                        <p className="text-gray-600 text-sm">Encrypt backups both in transit and at rest to protect sensitive data</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Monitoring</h4>
                        <p className="text-gray-600 text-sm">Implement monitoring and alerting for backup failures or issues</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Version Control</h4>
                        <p className="text-gray-600 text-sm">Maintain multiple versions of backups to protect against corruption</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Access Control</h4>
                        <p className="text-gray-600 text-sm">Implement strict access controls for backup systems and data</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Regular Updates</h4>
                        <p className="text-gray-600 text-sm">Keep backup software and systems updated with latest patches</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Business Alignment</h4>
                        <p className="text-gray-600 text-sm">Align backup and recovery strategies with business requirements</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Compliance</h4>
                        <p className="text-gray-600 text-sm">Ensure backup and recovery practices meet regulatory requirements</p>
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
                Effective data backup and disaster recovery strategies are essential for business resilience in today's digital world. By implementing comprehensive backup solutions, developing robust recovery plans, and regularly testing procedures, organizations can protect their critical data assets and ensure business continuity.
              </p>
              <p className="text-lg text-gray-600">
                Remember that backup and disaster recovery is not a one-time project but an ongoing process that requires continuous attention, testing, and improvement. As your business evolves and technology advances, regularly review and update your strategies to ensure they remain effective and aligned with business objectives.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
