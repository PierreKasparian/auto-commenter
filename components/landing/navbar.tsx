"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "@/utils/supabase/queries";

export function Navbar({ isDashboard }: { isDashboard?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 mr-2"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                CommentPro
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          {!isDashboard ? (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                How it works
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Pricing
              </Link>
              <Button
                variant="outline"
                className="border-teal-600 text-teal-600 bg-white hover:bg-teal-50"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login
              </Button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/purchase-credits"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Buy credits
              </Link>
              <Button
                variant="outline"
                className="border-teal-600 text-teal-600 bg-white hover:bg-teal-50"
                onClick={signOut}
              >
                Logout
              </Button>
            </nav>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-teal-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-white border-b"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {isDashboard ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-600 hover:text-teal-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/purchase-credits"
                  className="block text-gray-600 hover:text-teal-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy credits
                </Link>
                <div className="pt-4 space-y-3">
                  <Button
                    variant="outline"
                    className=" w-full border-teal-600 text-teal-600 bg-white hover:bg-teal-50"
                    onClick={signOut}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="#features"
                  className="block text-gray-600 hover:text-teal-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="block text-gray-600 hover:text-teal-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it works
                </Link>
                <Link
                  href="#pricing"
                  className="block text-gray-600 hover:text-teal-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="pt-4 space-y-3">
                  <Button
                    variant="outline"
                    className=" w-full border-teal-600 text-teal-600 bg-white hover:bg-teal-50"
                    onClick={() => {
                      window.location.href = "/login";
                    }}
                  >
                    Login
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
