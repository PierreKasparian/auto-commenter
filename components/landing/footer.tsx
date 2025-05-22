import Link from "next/link"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 mr-2" />
              <span className="text-xl font-bold text-white">CommentPro</span>
            </div>
            <p className="mt-4">
              Automate your LinkedIn interactions and develop your professional network without effort.
            </p>
            <div className="flex space-x-4 mt-6">
              {/* <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Instagram size={20} />
              </Link> */}
              <Link href="mailto:kasparianpierre@gmail.com" className="text-gray-400 hover:text-teal-500 transition-colors">
                <Mail size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="hover:text-teal-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-teal-500 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal" className="hover:text-teal-500 transition-colors">
                  Legal
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-teal-500 transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} CommentPro. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link href="/privacy" className="hover:text-teal-500 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-teal-500 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
