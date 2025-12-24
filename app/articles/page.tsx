"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import image_article_1 from "./images/article_1.jpg";
import image_article_2 from "./images/article_2.jpg";
import image_article_3 from "./images/article_3.jpg";
import image_article_4 from "./images/article_4.jpg";
import image_article_5 from "./images/article_5.jpg";
import image_article_6 from "./images/article_6.jpg";
import image_article_7 from "./images/article_7.jpg";
import image_article_8 from "./images/article_8.jpg";
import image_article_9 from "./images/article_9.jpg";
import image_article_10 from "./images/article_10.jpg";
import image_article_11 from "./images/article_11.jpg";
import image_article_12 from "./images/article_12.jpg";
import image_article_13 from "./images/article_13.jpg";
import image_article_14 from "./images/article_14.jpg";
import image_article_15 from "./images/article_15.jpg";
import image_article_16 from "./images/article_16.jpg";

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
    image: image_article_1,
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
    image: image_article_2,
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
    image: image_article_3,
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
    image: image_article_4,
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
    image: image_article_5,
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
    image: image_article_6,
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
    image: image_article_7,
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
    image: image_article_8,
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
    author: "The Sales Team",
    image: image_article_9,
    featured: false,
    slug: "how-ai-is-changing-legal-practice",
  },
  {
    id: 10,
    title: "Smarter Care, Stronger Outcomes: How AI Is Transforming Healthcare",
    excerpt:
      "AI is already transforming healthcare by improving diagnostic accuracy, reducing administrative burden, and enabling clinicians to focus more time on patients for better outcomes.",
    category: "Healthcare",
    readTime: "12 min read",
    publishDate: "Oct 2025",
    author: "The Sales Team",
    image: image_article_10,
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
    author: "The Sales Team",
    image: image_article_11,
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
    readTime: "9 min read",
    publishDate: "Oct 2025",
    author: "The Sales Team",
    image: image_article_12,
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
    readTime: "8 min read",
    publishDate: "Oct 2025",
    author: "The Sales Team",
    image: image_article_13,
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
    readTime: "8 min read",
    publishDate: "Oct 2025",
    author: "The Sales Team",
    image: image_article_14,
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
    readTime: "9 min read",
    publishDate: "Oct 2025",
    author: "The Sales Team",
    image: image_article_15,
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
    readTime: "7 min read",
    publishDate: "Oct 2025",
    author: "The Sales Team",
    image: image_article_16,
    featured: false,
    slug: "ai-transforming-automotive",
  },
];

export default function ArticlesPage() {
  const featuredArticle = articles.find((article) => article.featured);
  const regularArticles = articles.filter((article) => !article.featured);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl" />

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
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              Articles
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display tracking-tight"
            >
              AI & Technology{" "}
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
                Insights
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Stay informed with the latest insights in artificial intelligence,
              automation, and business transformation.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-8 lg:p-12 text-white"
            >
              <div className="flex items-center mb-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold mr-4">
                  Featured Article
                </span>
                <span className="text-accent-100">
                  {featuredArticle.category}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display tracking-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-accent-100 text-lg mb-6 leading-relaxed max-w-3xl">
                {featuredArticle.excerpt}
              </p>
              <div className="flex flex-wrap items-center text-accent-100 text-sm mb-6 gap-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{featuredArticle.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{featuredArticle.publishDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{featuredArticle.readTime}</span>
                </div>
              </div>
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="inline-flex items-center bg-white text-accent-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors"
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {regularArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-soft hover:shadow-soft-lg overflow-hidden group border border-gray-100 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <img
                    src={article.image.src}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-accent-600 transition-colors line-clamp-2 font-display">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center text-gray-500 text-xs mb-4 gap-3">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{article.publishDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-accent-600 font-semibold text-sm hover:text-accent-700 flex items-center group/link"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft border border-gray-100 text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Get the latest AI insights and technology articles delivered to
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              See how our AI solutions can help your business grow.
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
