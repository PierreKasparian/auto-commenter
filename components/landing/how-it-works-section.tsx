"use client"

import { motion } from "framer-motion"
import { Search, MessageSquare, CheckSquare, Send } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-white" />,
      title: "Define your criteria",
      description:
        "Choose the keywords that interest you and/ or the profiles you want to comment on their posts.",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-white" />,
      title: "AI writes the comments",
      description:
        "Our AI analyzes the posts and writes relevant comments in your writing style.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-white" />,
      title: "Validate the comments",
      description:
        "Review and approve the comments before they are published, or modify them if necessary.",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: <Send className="h-8 w-8 text-white" />,
      title: "Automatic publication",
      description:
        "Approved comments are automatically published when you validate them.",
      color: "from-emerald-500 to-emerald-600",
    },
  ]

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How it works</h2>
          <p className="mt-4 text-xl text-gray-600">
            A simple process in 4 steps to automate your LinkedIn interactions
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>

          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div
                    className={`h-16 w-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}
                  >
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
