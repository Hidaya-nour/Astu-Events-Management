"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AtSign, Clock, MapPin, Phone, Send, Mail } from "lucide-react"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "general",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4 bg-primary text-primary-foreground">Contact Us</Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Have questions about our events or need assistance? We're here to help.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="mb-6 text-2xl font-semibold text-foreground">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                      <Input
                        id="name"
                    placeholder="Your name"
                    className="bg-background border-border focus:border-primary"
                        value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                    placeholder="your.email@example.com"
                    className="bg-background border-border focus:border-primary"
                        value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground">Subject</Label>
                    <Input
                      id="subject"
                  placeholder="What is this regarding?"
                  className="bg-background border-border focus:border-primary"
                      value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Message</Label>
                    <Textarea
                      id="message"
                  placeholder="Your message..."
                  className="min-h-[150px] bg-background border-border focus:border-primary"
                      value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                    <Button
                      type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                  </>
                      ) : (
                  "Send Message"
                      )}
                    </Button>
              </form>
          </motion.div>

          {/* Contact Information */}
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8"
        >
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold text-foreground">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-secondary p-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Address</h3>
                    <p className="text-muted-foreground">
                      ASTU University<br />
                      Main Campus<br />
                      Adama, Ethiopia
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-secondary p-2">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+251 22 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-secondary p-2">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <p className="text-muted-foreground">events@astu.edu.et</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold text-foreground">Office Hours</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium text-foreground">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium text-foreground">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium text-foreground">Closed</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold text-foreground">Follow Us</h2>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-secondary">
                  <Facebook className="h-5 w-5 text-primary" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-secondary">
                  <Twitter className="h-5 w-5 text-primary" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-secondary">
                  <Instagram className="h-5 w-5 text-primary" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-secondary">
                  <Linkedin className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}
