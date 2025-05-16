import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Award, BookOpen, GraduationCap, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-primary-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-primary-600 text-white hover:bg-primary-700">About Us</Badge>
                <h1 className="text-3xl font-bold tracking-tighter text-primary-800 sm:text-5xl">
                  About ASTU University
                </h1>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Adama Science and Technology University (ASTU) is a leading institution dedicated to excellence in
                  education, research, and innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* University History */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200">Our History</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter text-primary-800 sm:text-4xl">
                    A Legacy of Excellence
                  </h2>
                  <p className="text-gray-600 md:text-xl/relaxed">
                    Founded in 1993, Adama Science and Technology University has grown from a small technical college to
                    a comprehensive university offering a wide range of programs.
                  </p>
                  <p className="text-gray-600 md:text-xl/relaxed">
                    Over the decades, ASTU has established itself as a center of excellence in science, technology,
                    engineering, and mathematics (STEM) education in Ethiopia.
                  </p>
                  <p className="text-gray-600 md:text-xl/relaxed">
                    Today, ASTU continues to expand its academic offerings, research capabilities, and community
                    engagement initiatives to address the evolving needs of society.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/images/astu-faculty-group.png"
                  width={550}
                  height={550}
                  alt="ASTU University Faculty and Students"
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6 rounded-lg bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200">Our Mission</Badge>
                  <h3 className="text-2xl font-bold text-primary-800">Mission Statement</h3>
                  <p className="text-gray-600">
                    To provide quality education and training in science and technology, conduct innovative research,
                    and engage in community service to contribute to the socio-economic development of Ethiopia.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-primary-700">Core Objectives</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary-600"></div>
                      <span>Deliver high-quality education in science and technology</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary-600"></div>
                      <span>Conduct innovative research to address national challenges</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary-600"></div>
                      <span>Engage in community service and knowledge transfer</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-6 rounded-lg bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200">Our Vision</Badge>
                  <h3 className="text-2xl font-bold text-primary-800">Vision Statement</h3>
                  <p className="text-gray-600">
                    To be a premier African university renowned for excellence in science and technology education,
                    research, and innovation by 2030.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-primary-700">Strategic Goals</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary-600"></div>
                      <span>Achieve international recognition for academic excellence</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary-600"></div>
                      <span>Develop innovative solutions to national and regional challenges</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary-600"></div>
                      <span>Foster partnerships with industry and international institutions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200">Why ASTU</Badge>
                <h2 className="text-3xl font-bold tracking-tighter text-primary-800 md:text-4xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  What makes Adama Science and Technology University stand out.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-primary-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary-800">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200">Leadership</Badge>
                <h2 className="text-3xl font-bold tracking-tighter text-primary-800 md:text-4xl">
                  University Leadership
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Meet the dedicated leaders guiding ASTU University.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {leadership.map((leader, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg bg-white p-6 text-center shadow-sm"
                >
                  <div className="h-32 w-32 overflow-hidden rounded-full bg-gray-100">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      width={128}
                      height={128}
                      alt={leader.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-primary-800">{leader.name}</h3>
                  <p className="text-primary-600">{leader.title}</p>
                  <p className="text-sm text-gray-500">{leader.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary-600 text-white">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Join Our Events</h2>
              <p className="mx-auto max-w-[600px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover the vibrant academic and cultural events happening at ASTU University.
              </p>
            </div>
            <div className="mx-auto flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link href="/">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-white/90 px-8">
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
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
