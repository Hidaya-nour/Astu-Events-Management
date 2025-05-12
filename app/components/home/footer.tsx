import Link from "next/link"
import { Calendar, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span className="font-bold text-xl">EventPro</span>
            </Link>
            <p className="text-sm text-gray-500">
              Your all-in-one platform for planning, organizing, and managing successful events of any size.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-500 hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-500 hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-sm text-gray-500 hover:text-primary">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-gray-500 hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-gray-500 hover:text-primary">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-gray-500 hover:text-primary">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/webinars" className="text-sm text-gray-500 hover:text-primary">
                  Webinars
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-gray-500 hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-sm text-gray-500 hover:text-primary">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EventPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
