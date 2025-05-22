import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Award, BookOpen, GraduationCap, Users } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
              <SiteHeader />

      <div className="container py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4 bg-primary text-primary-foreground">About ASTU</Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Welcome to ASTU University
                </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Empowering students through education, innovation, and community engagement.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 grid gap-8 md:grid-cols-2"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide quality education and training, conduct research, and render community services in the fields
                of science, technology, and engineering to meet the development needs of the country.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To be a leading university in science, technology, and engineering education, research, and community
                service in Ethiopia and Africa.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Our History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="text-muted-foreground">
                  Adama Science and Technology University (ASTU) was established in 1993 as a technical college. Over the
                  years, it has grown into a comprehensive university offering various programs in science, technology,
                  and engineering.
                </p>
                <p className="text-muted-foreground">
                  Today, ASTU is recognized as one of Ethiopia's leading institutions for higher education, with a strong
                  focus on research and innovation. Our campus hosts state-of-the-art facilities and laboratories,
                  providing students with hands-on learning experiences.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campus Life */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="mb-6 text-3xl font-bold text-foreground">Campus Life</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Academic Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our rigorous academic programs are designed to prepare students for successful careers in their chosen
                  fields.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Research & Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Students and faculty engage in cutting-edge research projects that address real-world challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Student Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From cultural events to sports competitions, there's always something happening on campus.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Leadership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="mb-6 text-3xl font-bold text-foreground">University Leadership</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">President</CardTitle>
                <CardDescription className="text-muted-foreground">Dr. John Doe</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Leading the university's vision and strategic initiatives since 2020.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Vice President</CardTitle>
                <CardDescription className="text-muted-foreground">Dr. Jane Smith</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Overseeing academic affairs and student success programs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Dean of Students</CardTitle>
                <CardDescription className="text-muted-foreground">Dr. Michael Johnson</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ensuring a supportive and engaging campus environment for all students.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Join Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Be part of our vibrant academic community and shape your future with ASTU.
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Apply Now
                </Button>
                <Button variant="outline" className="border-border hover:bg-secondary">
                  Learn More
                </Button>
            </div>
            </CardContent>
          </Card>
        </motion.div>
          </div>
          <SiteFooter />
    </div>
  )
}

const features = [
  {
    title: "Academic Excellence",
    description: "Rigorous academic programs taught by expert faculty",
    icon: <GraduationCap className="h-6 w-6 text-primary-600" />,
  },
  {
    title: "Research Innovation",
    description: "Cutting-edge research facilities and opportunities",
    icon: <BookOpen className="h-6 w-6 text-primary-600" />,
  },
  {
    title: "Global Partnerships",
    description: "Collaborations with universities worldwide",
    icon: <Users className="h-6 w-6 text-primary-600" />,
  },
  {
    title: "Industry Connections",
    description: "Strong ties with industry for practical learning",
    icon: <Award className="h-6 w-6 text-primary-600" />,
  },
]

const leadership = [
  {
    name: "Prof. Hirpa Lemu",
    title: "President",
    description: "Leading ASTU's strategic vision and institutional advancement since 2020.",
  },
  {
    name: "Dr. Abebe Kebede",
    title: "Vice President, Academic Affairs",
    description: "Overseeing curriculum development and academic excellence initiatives.",
  },
  {
    name: "Dr. Tigist Haile",
    title: "Vice President, Research",
    description: "Directing research initiatives and fostering innovation across disciplines.",
  },
  {
    name: "Dr. Solomon Tadesse",
    title: "Dean of Students",
    description: "Ensuring student success and enhancing the campus experience.",
  },
  {
    name: "Prof. Yohannes Mengistu",
    title: "Dean, College of Engineering",
    description: "Leading ASTU's largest college with multiple engineering disciplines.",
  },
  {
    name: "Dr. Fatima Ahmed",
    title: "Director of International Relations",
    description: "Developing global partnerships and exchange programs.",
  },
]
