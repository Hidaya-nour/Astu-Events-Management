"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      // In a real app, you would make an API call to register the user
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Registration successful!",
        description: "Your account has been created. You can now log in.",
      })

      router.push("/auth/login")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
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
        duration: 0.5,
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
        duration: 0.5,
      },
    },
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50 to-white opacity-70"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <Link href="/" className="text-primary-600 hover:text-primary-800 transition-colors duration-300">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to home</span>
        </Link>
      </motion.div>

      <motion.div
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-primary-100 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-primary-800">Create an account</CardTitle>
              <CardDescription className="text-center">Enter your information to create an account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-4">
                <motion.div className="grid gap-2" variants={itemVariants}>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                    required
                  />
                </motion.div>
                <motion.div className="grid gap-2" variants={itemVariants}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@astu.edu.et"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                    required
                  />
                </motion.div>
                <motion.div className="grid gap-2" variants={itemVariants}>
                  <Label htmlFor="studentId">Student/Staff ID</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    placeholder="e.g., STU12345"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                    required
                  />
                </motion.div>
                <motion.div className="grid gap-2" variants={itemVariants}>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </motion.div>
                <motion.div className="grid gap-2" variants={itemVariants}>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-primary-500 transition-all duration-300"
                    required
                  />
                </motion.div>
                <motion.div className="grid gap-2" variants={itemVariants}>
                  <Label>User Role</Label>
                  <RadioGroup
                    defaultValue="student"
                    value={formData.role}
                    onValueChange={handleRoleChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="font-normal">
                        Student
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="organizer" id="organizer" />
                      <Label htmlFor="organizer" className="font-normal">
                        Event Organizer
                      </Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              </CardContent>
              <CardFooter>
                <motion.div className="w-full" variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
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
                        Creating account...
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
        <motion.div className="text-center text-sm text-gray-600" variants={itemVariants}>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary-600 hover:text-primary-800 font-medium transition-colors duration-300"
          >
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
