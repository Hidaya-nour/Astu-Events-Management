"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function SiteFooter() {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <motion.footer
      className="w-full border-t bg-gradient-to-br from-primary to-primary/90 text-primary-foreground py-12 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/20 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        <motion.div variants={itemVariants}>
          <h3 className="mb-4 text-lg font-bold">ASTU Events</h3>
          <p className="text-primary-foreground/80 mb-4">
            Adama Science and Technology University
            <br />
            P.O. Box 1888
            <br />
            Adama, Ethiopia
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://facebook.com"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </motion.div>
            </Link>
            <Link
              href="https://twitter.com"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </motion.div>
            </Link>
            <Link
              href="https://instagram.com"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </motion.div>
            </Link>
            <Link
              href="https://youtube.com"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "Events", "About ASTU", "FAQ", "Contact Us"].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                viewport={{ once: true }}
              >
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 relative group flex items-center"
                >
                  <span className="absolute left-0 w-0 h-0.5 bg-primary-foreground opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300"></span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">{item}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="mb-4 text-lg font-bold">Event Categories</h3>
          <ul className="space-y-2">
            {[
              "Academic Conferences",
              "Cultural Events",
              "Workshops & Training",
              "Career Events",
              "Sports Competitions",
            ].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/events/category/${item.toLowerCase().replace(/[&\s]+/g, "-")}`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 relative group flex items-center"
                >
                  <span className="absolute left-0 w-0 h-0.5 bg-primary-foreground opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300"></span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">{item}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
          <ul className="space-y-2">
            <li className="text-primary-foreground/80">Phone: +251 22 110 0036</li>
            <li className="text-primary-foreground/80">Email: events@astu.edu.et</li>
          </ul>
          <div className="mt-4">
            <h4 className="mb-2 font-medium">Subscribe to Newsletter</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-l-md border-0 bg-primary/20 px-3 py-2 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 transition-all duration-300"
                required
              />
              <motion.button
                type="submit"
                className="rounded-r-md bg-primary-foreground px-3 py-2 text-primary hover:bg-primary-foreground/90 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
      <motion.div className="container mt-8 border-t border-primary/20 pt-8" variants={itemVariants}>
        <p className="text-center text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Adama Science and Technology University. All rights reserved.
        </p>
      </motion.div>
    </motion.footer>
  )
}
