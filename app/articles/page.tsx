"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";

const articles = [
  {
    id: 1,
    title: "AI-Powered Cloud Computing: The Future of Business Operations",
    excerpt:
      "Discover how AI-powered cloud solutions are revolutionizing business operations and learn the key strategies for successful cloud transformation in 2025.",
    category: "AI & Cloud",
    readTime: "8 min read",
    publishDate: "Sep 2025",
    author: "Koby AI Team",
    image: "/images/test.jpg",
    featured: true,
    slug: "ai-powered-cloud-computing",
  },
  {
    id: 2,
    title: "AI-Enhanced Cybersecurity for Small Businesses",
    excerpt:
      "Protect your business with AI-powered security solutions and proven strategies designed for small and medium enterprises.",
    category: "AI Security",
    readTime: "10 min read",
    publishDate: "Sep 2025",
    author: "Security AI Expert",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "ai-enhanced-cybersecurity",
  },
  {
    id: 3,
    title: "Leveraging AI and Machine Learning for Business Growth",
    excerpt:
      "Explore practical applications of artificial intelligence and machine learning that can transform your business operations and drive innovation.",
    category: "Artificial Intelligence",
    readTime: "12 min read",
    publishDate: "Sep 2025",
    author: "AI Specialist",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "ai-ml-business-applications",
  },
  {
    id: 4,
    title: "AI-Driven Digital Transformation Roadmap",
    excerpt:
      "A comprehensive guide to planning and executing AI-powered digital transformation strategies for modern businesses.",
    category: "Digital Transformation",
    readTime: "15 min read",
    publishDate: "Sep 2025",
    author: "Digital AI Strategy Team",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "digital-transformation-roadmap",
  },
  {
    id: 5,
    title: "DevOps Implementation: From Theory to Practice",
    excerpt:
      "Learn how to implement DevOps practices in your organization to improve collaboration, automation, and continuous delivery.",
    category: "DevOps",
    readTime: "9 min read",
    publishDate: "Sep 2025",
    author: "DevOps Engineer",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "devops-implementation-guide",
  },
  {
    id: 6,
    title: "Data Backup and Disaster Recovery Strategies",
    excerpt:
      "Ensure business continuity with comprehensive backup solutions and disaster recovery planning for your critical data and systems.",
    category: "Infrastructure",
    readTime: "11 min read",
    publishDate: "Sep 2025",
    author: "Infrastructure Team",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "data-backup-disaster-recovery",
  },
  {
    id: 7,
    title: "Remote Work Technology: Building a Connected Workforce",
    excerpt:
      "Discover the essential technologies and best practices for enabling productive remote work in your organization.",
    category: "Remote Work",
    readTime: "7 min read",
    publishDate: "Sep 2025",
    author: "Workplace Technology Expert",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "remote-work-technology-solutions",
  },
  {
    id: 8,
    title: "IT Infrastructure Modernization: Key Considerations",
    excerpt:
      "Navigate the complexities of modernizing legacy IT infrastructure while maintaining operational continuity and maximizing ROI.",
    category: "Infrastructure",
    readTime: "13 min read",
    publishDate: "Sep 2025",
    author: "Infrastructure Architect",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "it-infrastructure-modernization",
  },
  {
    id: 9,
    title: "The New Brief Partner: How AI is Changing Legal Practice",
    excerpt:
      "AI is rapidly transforming legal practice by automating research, document review, and administrative tasks allowing law firms to operate more efficiently and focus more of their time on achieving better outcomes for clients.",
    category: "Legal",
    readTime: "10 min read",
    publishDate: "Oct 2025",
    author: "N/A",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "how-ai-is-changing-legal-practice",
  },
  {
    id: 10,
    title: "Smarter Care, Stronger Outcomes: How AI Is Transforming Healthcare",
    excerpt:
      "AI is already transforming healthcare by improving diagnostic accuracy, reducing administrative burden, and enabling clinicians to focus more time on patients for better outcomes.",
    category: "Healthcare",
    readTime: "10 min read",
    publishDate: "Oct 2025",
    author: "N/A",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "ai-is-transforming-healthcare",
  },
  {
    id: 11,
    title:
      "Smarter Properties, Happier Tenants: How AI Is Changing Property Management",
    excerpt:
      "AI is transforming property management by automating tenant communication, predicting maintenance needs, and improving operational efficiency to deliver better experiences and stronger financial results.",
    category: "Property Management",
    readTime: "10 min read",
    publishDate: "Oct 2025",
    author: "N/A",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "ai-is-changing-property-management",
  },
  {
    id: 12,
    title:
      "AI for Home Services: How Contractors Are Winning More Jobs and Serving Customers Better",
    excerpt:
      "AI is helping home service contractors win more jobs, respond faster, and operate more efficiently by automating customer communication, scheduling, and paperwork.",
    category: "Contractors",
    readTime: "10 min read",
    publishDate: "Oct 2025",
    author: "N/A",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "contractors-are-winning-more-jobs",
  },
  {
    id: 13,
    title:
      "Smarter Dining, Seamless Service: How AI Is Changing Restaurants and Food Service",
    excerpt:
      "AI is transforming restaurants and food service by automating guest communication, optimizing operations, and boosting revenue delivering smoother service and better dining experiences.",
    category: "Restaurants",
    readTime: "10 min read",
    publishDate: "Oct 2025",
    author: "N/A",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "how-ai-is-changing-restaurants",
  },
  {
    id: 14,
    title:
      "Smarter Shopping, Stronger Businesses: How AI Is Transforming Retail and E Commerce",
    excerpt:
      "AI is helping retail and e-commerce businesses deliver faster service, personalized shopping, and more efficient operations driving stronger customer experiences and growth.",
    category: "Retail/Ecommerce",
    readTime: "10 min read",
    publishDate: "Oct 2025",
    author: "N/A",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "ai-is-transforming-retail",
  },
  {
    id: 15,
    title:
      "Seamless Journeys, Smarter Service: How AI Is Transforming Travel and Hospitality",
    excerpt:
      "AI is transforming travel and hospitality by delivering faster guest support, smarter booking automation, and personalized experiences helping businesses run efficiently while elevating service.",
    category: "Travel/Hospitality",
    readTime: "10 min read",
    publishDate: "Oct 2025",
    author: "N/A",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "how-ai-is-transforming-travel",
  },
  {
    id: 16,
    title:
      "Driving Smarter Service: How AI Is Transforming Automotive Sales and Repair",
    excerpt:
      "AI is helping automotive dealerships and service centers deliver faster, more reliable customer experiences by automating calls, scheduling, follow-ups, and back-office work—capturing more revenue with less effort.",
    category: "Auto",
    readTime: "10 min read",
    publishDate: "Oct 2025",
    author: "N/A",
    image: "/api/placeholder/400/250",
    featured: false,
    slug: "ai-transforming-automotive",
  },
];

export default function ArticlesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const featuredArticle = articles.find((article) => article.featured);
  const regularArticles = articles.filter((article) => !article.featured);

  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />

      <div className="pt-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-accent-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
          className="text-center max-w-4xl mx-auto px-6 sm:px-8 mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6 font-display">
            AI & Technology Articles
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Stay informed with the latest insights in artificial intelligence,
            automation, and business transformation.
          </p>
        </motion.div>

        {/* Featured Article */}
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            style={{
              transform: "translateZ(0)",
              willChange: "transform, opacity",
            }}
            className="max-w-7xl mx-auto px-6 sm:px-8 mb-16"
          >
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-white">
              <div className="flex items-center mb-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold mr-4">
                  Featured Article
                </span>
                <span className="text-accent-100">
                  {featuredArticle.category}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">
                {featuredArticle.title}
              </h2>
              <p className="text-accent-100 text-lg mb-6 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center text-accent-100 text-sm mb-6">
                <User className="w-4 h-4 mr-2" />
                <span className="mr-6">{featuredArticle.author}</span>
                <Calendar className="w-4 h-4 mr-2" />
                <span className="mr-6">{featuredArticle.publishDate}</span>
                <Clock className="w-4 h-4 mr-2" />
                <span>{featuredArticle.readTime}</span>
              </div>
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="bg-white text-accent-500 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 flex items-center"
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
          style={{
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
          className="max-w-7xl mx-auto px-6 sm:px-8 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * index,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                style={{
                  transform: "translateZ(0)",
                  willChange: "transform, opacity",
                }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden group cursor-pointer"
              >
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-accent-500 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <User className="w-4 h-4 mr-2" />
                    <span className="mr-4">{article.author}</span>
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="mr-4">{article.publishDate}</span>
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{article.readTime}</span>
                  </div>

                  {/* Read More Button */}
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-accent-500 font-semibold hover:text-accent-600 flex items-center group"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
          style={{
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8">
              Get the latest AI insights and technology articles delivered to
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <button className="bg-accent-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-accent-600">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
