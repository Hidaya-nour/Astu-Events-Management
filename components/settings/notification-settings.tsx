"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail } from "lucide-react"

const defaultSettings = {
  emailNotifications: {
    events: true,
    reminders: true,
    updates: false,
    newsletter: false,
  },
  pushNotifications: {
    events: true,
    reminders: true,
    messages: true,
    updates: true,
  },
}

export default function NotificationSettings() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)

  const handleToggleEmailNotification = (key: keyof typeof settings.emailNotifications) => {
    setSettings({
      ...settings,
      emailNotifications: {
        ...settings.emailNotifications,
        [key]: !settings.emailNotifications[key],
      },
    })
  }

  const handleTogglePushNotification = (key: keyof typeof settings.pushNotifications) => {
    setSettings({
      ...settings,
      pushNotifications: {
        ...settings.pushNotifications,
        [key]: !settings.pushNotifications[key],
      },
    })
  }

  async function onSubmit() {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(settings)
    setIsSaving(false)
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-gray-500">Manage how you receive notifications from the Astu Events platform.</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-primary" />
            <h4 className="text-base font-medium">Email Notifications</h4>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-events">Event Invitations</Label>
                <p className="text-sm text-gray-500">Receive emails when you're invited to events</p>
              </div>
              <Switch
                id="email-events"
                checked={settings.emailNotifications.events}
                onCheckedChange={() => handleToggleEmailNotification("events")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-reminders">Event Reminders</Label>
                <p className="text-sm text-gray-500">Receive reminder emails before events you're attending</p>
              </div>
              <Switch
                id="email-reminders"
                checked={settings.emailNotifications.reminders}
                onCheckedChange={() => handleToggleEmailNotification("reminders")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-updates">Platform Updates</Label>
                <p className="text-sm text-gray-500">Receive emails about new features and updates</p>
              </div>
              <Switch
                id="email-updates"
                checked={settings.emailNotifications.updates}
                onCheckedChange={() => handleToggleEmailNotification("updates")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-newsletter">Newsletter</Label>
                <p className="text-sm text-gray-500">Receive our monthly newsletter with event highlights</p>
              </div>
              <Switch
                id="email-newsletter"
                checked={settings.emailNotifications.newsletter}
                onCheckedChange={() => handleToggleEmailNotification("newsletter")}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            <h4 className="text-base font-medium">Push Notifications</h4>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-events">Event Updates</Label>
                <p className="text-sm text-gray-500">Receive notifications about changes to events you're attending</p>
              </div>
              <Switch
                id="push-events"
                checked={settings.pushNotifications.events}
                onCheckedChange={() => handleTogglePushNotification("events")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-reminders">Event Reminders</Label>
                <p className="text-sm text-gray-500">Receive reminders before events start</p>
              </div>
              <Switch
                id="push-reminders"
                checked={settings.pushNotifications.reminders}
                onCheckedChange={() => handleTogglePushNotification("reminders")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-messages">Messages</Label>
                <p className="text-sm text-gray-500">Receive notifications for new messages</p>
              </div>
              <Switch
                id="push-messages"
                checked={settings.pushNotifications.messages}
                onCheckedChange={() => handleTogglePushNotification("messages")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-updates">Platform Updates</Label>
                <p className="text-sm text-gray-500">Receive notifications about new features</p>
              </div>
              <Switch
                id="push-updates"
                checked={settings.pushNotifications.updates}
                onCheckedChange={() => handleTogglePushNotification("updates")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
