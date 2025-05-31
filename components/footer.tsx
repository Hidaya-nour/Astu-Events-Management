"use client"

import Link from "next/link"

const Footer = () => {
  return (
    <footer className="footer bg-gray-100 py-8 border-t mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">
        <div className="footer-section max-w-sm">
          <h3 className="text-lg font-semibold mb-2">About Us</h3>
          <p className="text-sm text-gray-600">
            We are dedicated to providing the best event management services.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-primary transition-colors">
                Events
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-primary transition-colors">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <p className="text-sm text-gray-600">Email: info@eventmanager.com</p>
          <p className="text-sm text-gray-600">Phone: +1234567890</p>
        </div>
      </div>

      <div className="footer-bottom text-center mt-8 text-sm text-gray-500">
        <p>&copy; 2023 Event Manager. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
