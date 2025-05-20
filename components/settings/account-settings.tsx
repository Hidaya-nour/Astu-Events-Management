"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const accountFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  studentId: z.string().min(5, {
    message: "Student ID must be at least 5 characters.",
  }),
  role: z.string({
    required_error: "Please select a role.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

const defaultValues: Partial<AccountFormValues> = {
  email: "ezex.kedir@astu.edu.et",
  studentId: "Ugr25363/14",
  role: "student",
}

export default function AccountSettings() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: AccountFormValues) {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(data)
    setIsSaving(false)
    toast({
      title: "Account updated",
      description: "Your account information has been updated successfully.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Account Information</h3>
        <p className="text-sm text-gray-500">Manage your account details and preferences.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
                </FormControl>
                <FormDescription>This is your primary email address for communications.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Your student ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="organizer">Event Organizer</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Your role determines your permissions in the system.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>

      <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Actions in this section can permanently affect your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Deleting your account will remove all of your data and cannot be undone.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="destructive">Delete Account</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
