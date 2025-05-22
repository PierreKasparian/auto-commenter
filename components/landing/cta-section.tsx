"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 py-16 sm:px-12 lg:px-16 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="pattern"
                    patternUnits="userSpaceOnUse"
                    width="40"
                    height="40"
                    patternTransform="rotate(45)"
                  >
                    <rect x="20" y="0" width="2" height="40" fill="white" />
                  </pattern>
                </defs>
                <rect width="800" height="800" fill="url(#pattern)" />
              </svg>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to transform your LinkedIn presence?
              </h2>
              <p className="text-xl text-teal-50 mb-8">
                Join thousands of professionals saving time and growing their network with CommentPro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 text-lg" onClick={() => {
                  window.location.href = "/login"
                }}>
                  Start for free
                </Button>
                <Button size="lg" variant="outline" className="border-white  hover:text-teal-600 text-white bg-teal-700/20 hover:bg-white text-lg" onClick={() => {
                  window.location.href = "mailto:kasparianpierre@gmail.com"
                }}>
                  Request a demo
                </Button>
              </div>
              <p className="text-teal-100 mt-6">Free trial for 7 days • No credit card required</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
