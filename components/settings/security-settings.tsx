"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Key, Smartphone } from "lucide-react"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

const defaultSecuritySettings = {
  twoFactorEnabled: false,
  loginNotifications: true,
  sessionTimeout: true,
}

export default function SecuritySettings() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [securitySettings, setSecuritySettings] = useState(defaultSecuritySettings)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  async function onSubmit(data: PasswordFormValues) {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(data)
    setIsSaving(false)
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    })

    form.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleToggleSetting = (key: keyof typeof securitySettings) => {
    setSecuritySettings({
      ...securitySettings,
      [key]: !securitySettings[key],
    })

    toast({
      title: "Setting updated",
      description: `${key} has been ${!securitySettings[key] ? "enabled" : "disabled"}.`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-gray-500">Manage your account security and authentication methods.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Key className="mr-2 h-5 w-5 text-primary" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>Password must be at least 8 characters long.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            <CardTitle>Account Security</CardTitle>
          </div>
          <CardDescription>Additional security settings to protect your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="two-factor"
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={() => handleToggleSetting("twoFactorEnabled")}
              />
              {securitySettings.twoFactorEnabled ? (
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              ) : null}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-notifications">Login Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications for new login attempts</p>
            </div>
            <Switch
              id="login-notifications"
              checked={securitySettings.loginNotifications}
              onCheckedChange={() => handleToggleSetting("loginNotifications")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <p className="text-sm text-gray-500">Automatically log out after period of inactivity</p>
            </div>
            <Switch
              id="session-timeout"
              checked={securitySettings.sessionTimeout}
              onCheckedChange={() => handleToggleSetting("sessionTimeout")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Smartphone className="mr-2 h-5 w-5 text-primary" />
            <CardTitle>Active Sessions</CardTitle>
          </div>
          <CardDescription>Manage devices where you're currently logged in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Device</p>
                <p className="text-sm text-gray-500">Chrome on Windows • Adama, Ethiopia</p>
                <p className="text-xs text-gray-400">Last active: Just now</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mobile Device</p>
                <p className="text-sm text-gray-500">Safari on iPhone • Adama, Ethiopia</p>
                <p className="text-xs text-gray-400">Last active: 2 days ago</p>
              </div>
              <Button variant="outline" size="sm">
                Log Out
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" className="mt-2">
              Log Out All Other Devices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
