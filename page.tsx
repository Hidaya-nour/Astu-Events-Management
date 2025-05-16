"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Calendar, CheckCircle, Clock, MapPin, Shield, Sparkles, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  // Array of event images for the carousel
  const eventImages = [
    "/images/astu-computer-lab.png",
    "/images/astu-group-photo.png",
    "/images/engineering-workshop.png",
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section with Animated Background */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-primary-50 z-0">
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-primary-300"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 300 + 50}px`,
                    height: `${Math.random() * 300 + 50}px`,
                    opacity: Math.random() * 0.5,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="container relative px-4 md:px-6 z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Badge className="bg-primary-600 text-white hover:bg-primary-700 shadow-md">ASTU University</Badge>
                  </motion.div>
                  <motion.h1
                    className="text-3xl font-bold tracking-tighter text-primary-800 sm:text-5xl xl:text-6xl/none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Student Event Management System
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-gray-600 md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    A centralized platform for organizing, discovering, and participating in university events.
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Link href="/events">
                    <Button
                      size="lg"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Explore Events
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary-600 text-primary-600 hover:bg-primary-50 px-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="relative w-full h-[550px] rounded-lg overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={eventImages[currentIndex] || "/placeholder.svg"}
                        width={550}
                        height={550}
                        alt="ASTU University Events"
                        className="object-cover h-full w-full"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{events[currentIndex].title}</h3>
                    <p className="text-sm opacity-90">{events[currentIndex].date}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Animated wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,69.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Features Section with Animation */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={containerVariants}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <motion.div variants={itemVariants}>
                  <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200 shadow-sm">Features</Badge>
                </motion.div>
                <motion.h2
                  variants={itemVariants}
                  className="text-3xl font-bold tracking-tighter text-primary-800 md:text-4xl"
                >
                  Simplifying Event Management
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Our platform offers powerful tools for students, event organizers, and administrators.
                </motion.p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div key={index} custom={index} variants={cardVariants} initial="hidden" animate={controls}>
                  <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 shadow-inner">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl text-primary-800">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events with Hover Effects */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary-50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 rounded-full bg-primary-200 opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-primary-300 opacity-20"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200 shadow-sm">Calendar</Badge>
                <h2 className="text-3xl font-bold tracking-tighter text-primary-800 md:text-4xl">Upcoming Events</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover and register for these exciting events at ASTU University.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl group">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={eventImages[index] || "/placeholder.svg"}
                        alt={event.title}
                        width={400}
                        height={200}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary-600 text-white shadow-md">{event.category}</Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium">Click to view details and register</p>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="line-clamp-1 text-xl text-primary-800 group-hover:text-primary-600 transition-colors duration-300">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      <div className="flex items-center text-gray-500 mb-2">
                        <Calendar className="mr-2 h-4 w-4 text-primary-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="mr-2 h-4 w-4 text-primary-500" />
                        <span>{event.location}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/events/${event.id}`} className="w-full">
                        <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                          Register Now
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/events">
                <Button
                  variant="outline"
                  className="border-primary-600 text-primary-600 hover:bg-primary-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* User Roles with Animated Cards */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200 shadow-sm">User Roles</Badge>
                <h2 className="text-3xl font-bold tracking-tighter text-primary-800 md:text-4xl">
                  Tailored for Everyone
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform serves the unique needs of different user roles in the university community.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
              {roles.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="text-center border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-primary-300 overflow-hidden h-full">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                    <CardHeader>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 shadow-inner">
                        {role.icon}
                      </div>
                      <CardTitle className="text-xl text-primary-800 mt-4">{role.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">{role.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Link href={role.link}>
                        <Button
                          variant="outline"
                          className="border-primary-600 text-primary-600 hover:bg-primary-50 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with Animated Background */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary-700 to-primary-900 text-white relative overflow-hidden">
          {/* Animated particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: Math.random() * 0.3,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: [null, Math.random() * -50],
                  opacity: [null, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  width: Math.random() * 6 + 2 + "px",
                  height: Math.random() * 6 + 2 + "px",
                }}
              />
            ))}
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get Started Today</h2>
                  <p className="text-white/90 md:text-xl/relaxed">
                    Join the ASTU Event Management System and be part of a vibrant campus community. Create, discover,
                    and participate in events that matter to you.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-white text-primary-600 hover:bg-white/90 px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Sign Up Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 px-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="space-y-4 rounded-xl bg-white/10 p-6 backdrop-blur-sm shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold">Benefits at a Glance</h3>
                  <ul className="space-y-3">
                    <motion.li
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="mr-2 h-5 w-5 text-primary-300 flex-shrink-0" />
                      <span>Centralized event management platform</span>
                    </motion.li>
                    <motion.li
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="mr-2 h-5 w-5 text-primary-300 flex-shrink-0" />
                      <span>Real-time notifications and updates</span>
                    </motion.li>
                    <motion.li
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="mr-2 h-5 w-5 text-primary-300 flex-shrink-0" />
                      <span>Customized experiences for different user roles</span>
                    </motion.li>
                    <motion.li
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="mr-2 h-5 w-5 text-primary-300 flex-shrink-0" />
                      <span>Streamlined event creation and registration</span>
                    </motion.li>
                    <motion.li
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="mr-2 h-5 w-5 text-primary-300 flex-shrink-0" />
                      <span>Enhanced campus engagement and interaction</span>
                    </motion.li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section className="w-full py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">24+</div>
                <div className="text-sm text-gray-600">Events Per Month</div>
              </motion.div>
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">1,200+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </motion.div>
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </motion.div>
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">15+</div>
                <div className="text-sm text-gray-600">Event Categories</div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const features = [
  {
    title: "Event Creation",
    description: "Create and publish events with detailed information including title, description, date, and venue.",
    icon: <Calendar className="h-6 w-6 text-primary-600" />,
  },
  {
    title: "User Authentication",
    description: "Secure sign-up and sign-in features with customized experiences for different user roles.",
    icon: <Shield className="h-6 w-6 text-primary-600" />,
  },
  {
    title: "Event Management",
    description: "Manage event details, attendee lists, and updates in real-time with comprehensive tools.",
    icon: <Sparkles className="h-6 w-6 text-primary-600" />,
  },
  {
    title: "Notifications",
    description: "Receive timely notifications about event updates, approvals, and other important information.",
    icon: <Clock className="h-6 w-6 text-primary-600" />,
  },
  {
    title: "Registration",
    description: "Easily register for events and track your participation history in one place.",
    icon: <CheckCircle className="h-6 w-6 text-primary-600" />,
  },
  {
    title: "Analytics",
    description: "Access insights and statistics about event attendance, engagement, and performance.",
    icon: <Users className="h-6 w-6 text-primary-600" />,
  },
]

const events = [
  {
    id: "1",
    title: "Annual Technology Symposium",
    description: "Join leading researchers and industry experts for ASTU's flagship technology conference.",
    date: "June 15-17, 2025",
    location: "Main Auditorium, ASTU Campus",
    category: "Academic",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "Cultural Festival",
    description: "Celebrate the diverse cultures and traditions represented at ASTU University.",
    date: "July 8, 2025",
    location: "University Square",
    category: "Cultural",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "Engineering Workshop",
    description: "Hands-on workshop on the latest engineering practices and technologies.",
    date: "June 25, 2025",
    location: "Engineering Building, Room 302",
    category: "Workshop",
    image: "/placeholder.svg?height=200&width=400",
  },
]

const roles = [
  {
    title: "Students",
    description: "Discover events, register for participation, request new events, and track your event history.",
    icon: <Users className="h-8 w-8 text-primary-600" />,
    link: "/roles/students",
  },
  {
    title: "Event Organizers",
    description: "Create and manage events, track attendees, send updates, and analyze event performance.",
    icon: <Calendar className="h-8 w-8 text-primary-600" />,
    link: "/roles/organizers",
  },
  {
    title: "Administrators",
    description: "Oversee the entire system, approve events, manage users, and ensure smooth operation.",
    icon: <Shield className="h-8 w-8 text-primary-600" />,
    link: "/roles/administrators",
  },
]
