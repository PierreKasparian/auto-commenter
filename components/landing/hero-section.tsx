"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2 lg:pr-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Automate your interactions on LinkedIn
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl">
              Save time by automating your interactions on LinkedIn. Our AI writes personalized comments that match your
              style and voice.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg text-white">
                  Start free trial
                </Button>
              </Link>

            </div>
            <div className="mt-8 flex items-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-teal-500 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 mt-12 lg:mt-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden border">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                      LP
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">LinkedIn Post</div>
                      <div className="text-sm text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Very happy to announce that our company has just raised 5M€ to develop our AI generative solution
                    for digital marketing! #AI #startup #financement
                  </p>
                  <div className="border-t pt-4">
                    <motion.div
                      className="bg-gray-50 p-3 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                          VP
                        </div>
                        <div className="ml-2 font-medium text-sm">Your Profile</div>
                        <div className="ml-auto text-xs text-teal-600 font-medium">Automated comment</div>
                      </div>
                      <p className="text-gray-700 text-sm mb-4">
                        Congratulations on this impressive fundraising! Your work on AI generative is truly inspiring.
                        I would like to discuss potential applications in our sector.
                        #AI #innovation
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 text-green-600 hover:bg-green-100"
                        >
                          Accept
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
