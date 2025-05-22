"use client"

import { motion } from "framer-motion"
import { Clock, Target, Bot, CheckCircle } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Clock className="h-6 w-6 text-teal-600" />,
      title: "Save time",
      description: "Save up to 5 hours per week by automating your interactions on LinkedIn.",
    },
    {
      icon: <Target className="h-6 w-6 text-teal-600" />,
      title: "Precise targeting",
      description: "Choose the keywords and profiles that interest you for relevant comments.",
    },
    {
      icon: <Bot className="h-6 w-6 text-teal-600" />,
      title: "Custom AI",
      description: "Our AI learns your writing style for comments that reflect you.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-teal-600" />,
      title: "Validation before publication",
      description: "Keep control by approving each comment before it is published.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Main features</h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover how CommentPro can transform your LinkedIn presence
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
              variants={item}
            >
              <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
