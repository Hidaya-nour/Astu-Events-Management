"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettings from "./profile-settings"
import AccountSettings from "./account-settings"
import NotificationSettings from "./notification-settings"
import SecuritySettings from "./security-settings"

export default function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </div>
    </Tabs>
  )
}
