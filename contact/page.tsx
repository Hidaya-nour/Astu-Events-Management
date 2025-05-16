"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AtSign, Clock, MapPin, Phone, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

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
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30">
      <div className="container py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4 bg-primary-600 text-white">Contact Us</Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-800 md:text-5xl">Get in Touch</h1>
          <p className="mx-auto max-w-2xl text-gray-600 md:text-lg">
            Have questions about ASTU events? We're here to help. Reach out to our team for assistance.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <motion.div
            className="space-y-6 md:col-span-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-primary-100 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-primary-50 pb-2">
                  <CardTitle className="text-xl text-primary-800">Contact Information</CardTitle>
                  <CardDescription>Ways to reach the ASTU Events team</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Address</h3>
                      <p className="text-sm text-gray-500">
                        Adama Science and Technology University
                        <br />
                        P.O. Box 1888, Adama, Ethiopia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <p className="text-sm text-gray-500">+251 22 110 0036</p>
                      <p className="text-sm text-gray-500">+251 22 110 0037</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <AtSign className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-sm text-gray-500">events@astu.edu.et</p>
                      <p className="text-sm text-gray-500">info@astu.edu.et</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Office Hours</h3>
                      <p className="text-sm text-gray-500">Monday - Friday: 8:00 AM - 5:00 PM</p>
                      <p className="text-sm text-gray-500">Saturday: 9:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-primary-100 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-primary-50 pb-2">
                  <CardTitle className="text-xl text-primary-800">Quick Links</CardTitle>
                  <CardDescription>Helpful resources for event information</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/events"
                        className="flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-300"
                      >
                        <span className="mr-2">→</span> Browse All Events
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faq"
                        className="flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-300"
                      >
                        <span className="mr-2">→</span> Frequently Asked Questions
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-300"
                      >
                        <span className="mr-2">→</span> About ASTU University
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/events/request"
                        className="flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-300"
                      >
                        <span className="mr-2">→</span> Request an Event
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="md:col-span-1 lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-primary-100 shadow-md">
              <CardHeader className="bg-primary-50 pb-2">
                <CardTitle className="text-xl text-primary-800">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Inquiry Type</Label>
                    <RadioGroup
                      value={formData.inquiryType}
                      onValueChange={handleRadioChange}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="general" id="general" />
                        <Label htmlFor="general" className="font-normal">
                          General Inquiry
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="registration" id="registration" />
                        <Label htmlFor="registration" className="font-normal">
                          Event Registration
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="technical" id="technical" />
                        <Label htmlFor="technical" className="font-normal">
                          Technical Support
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="feedback" id="feedback" />
                        <Label htmlFor="feedback" className="font-normal">
                          Feedback
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="border-primary-100 shadow-md overflow-hidden">
            <CardHeader className="bg-primary-50 pb-2">
              <CardTitle className="text-xl text-primary-800">Find Us</CardTitle>
              <CardDescription>Visit the ASTU University campus</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-[400px] w-full bg-gray-200">
                {/* This would be replaced with an actual map in a real application */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-primary-600" />
                    <p className="mt-2 text-gray-600">Interactive map would be displayed here</p>
                    <Button className="mt-4 bg-primary-600 hover:bg-primary-700 text-white">Get Directions</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ASTU Faculty Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="border-primary-100 shadow-md overflow-hidden">
            <CardHeader className="bg-primary-50 pb-2">
              <CardTitle className="text-xl text-primary-800">Meet Our Team</CardTitle>
              <CardDescription>The dedicated faculty and staff at ASTU University</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Image
                  src="/images/astu-faculty-group.png"
                  width={800}
                  height={400}
                  alt="ASTU Faculty and Staff"
                  className="rounded-lg shadow-md mb-4"
                />
                <p className="text-center text-gray-600 mt-4">
                  Our dedicated team of faculty and staff work tirelessly to organize and manage events that enrich the
                  academic and cultural experience at ASTU University.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
