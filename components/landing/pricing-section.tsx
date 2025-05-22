"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: "Beginner",
      description: "Perfect to start automating your LinkedIn interactions",
      monthlyPrice: 10,
      annualPrice: 90,
      features: [
        "50 automatic comments per month",
        "5 custom keywords",
        "3 profiles to follow",
        // "Manual comment validation",
        "Email support",
      ],
      cta: "Start free trial",
      highlighted: false,
    },
    {
      name: "Professional",
      description: "For professionals who want to develop their LinkedIn network",
      monthlyPrice: 20,
      annualPrice: 180,
      features: [
        "200 automatic comments per month",
        "20 custom keywords",
        "15 profiles to follow",
        // "Manual or automatic comment validation",
        // "Performance analysis",
        "Priority support",
      ],
      cta: "Start free trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "Dedicated solution tailored to your needs",
      monthlyPrice: -1,
      annualPrice: -1,
      features: [
        // "Unlimited automatic comments",
        // "Unlimited custom keywords",
        // "Unlimited profiles to follow",
        // "Manual or automatic comment validation",
        // "Advanced performance analysis",
        // "CRM integration",
        "Meeting with us",
        "Custom solution",
        "Dedicated support",
        // "Custom training",
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple and transparent pricing</h2>
          <p className="mt-4 text-xl text-gray-600">Choose the plan that best fits your needs</p>

          <div className="flex items-center justify-center mt-8">
            <Label htmlFor="pricing-toggle" className={`mr-2 ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>
              Monthly
            </Label>
            <Switch id="pricing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
            <Label htmlFor="pricing-toggle" className={`ml-2 ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>
              Annually <span className="text-teal-600 font-medium">(2 months free)</span>
            </Label>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`rounded-xl overflow-hidden ${
                plan.highlighted
                  ? "border-2 border-teal-500 shadow-xl relative md:-mt-4 md:mb-4"
                  : "border border-gray-200 shadow-sm"
              } bg-white`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {plan.highlighted && (
                <div className="bg-teal-500 text-white text-center py-1 text-sm font-medium">Recommended</div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2 h-12">{plan.description}</p>
                {plan.monthlyPrice !== -1 && (
                  <div className="mt-6 mb-8">
                    <p className="text-4xl font-bold text-gray-900">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}€
                      <span className="text-lg font-normal text-gray-600">{isAnnual ? "/year" : "/month"}</span>
                    </p>
                    {isAnnual && (
                      <p className="text-sm text-teal-600 mt-1">{Math.round(plan.annualPrice / 12)}€ per month</p>
                    )}
                  </div>
                )}
                <Button
                  className={`w-full text-white ${
                    plan.highlighted ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-900 hover:bg-gray-800"
                  }`} onClick={() => {
                    if (plan.cta === "Contact sales") {
                      window.location.href = "mailto:kasparianpierre@gmail.com"
                    } else {
                      window.location.href = "/login"
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </div>
              <div className="bg-gray-50 p-6 border-t h-full border-gray-100">
                <p className="font-medium text-gray-900 mb-4">What is included :</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
