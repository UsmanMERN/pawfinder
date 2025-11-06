"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Bell, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-8 overflow-auto">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">Configure and manage platform-wide settings</p>
      </div>

      {/* System Settings */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            System Configuration
          </CardTitle>
          <CardDescription>General platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Platform Name</label>
            <Input placeholder="Paw Walks" className="bg-card/50 border-border/40" defaultValue="Paw Walks" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Commission Rate (%)</label>
            <Input placeholder="15" className="bg-card/50 border-border/40" defaultValue="15" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Support Email</label>
            <Input placeholder="support@pawwalks.com" className="bg-card/50 border-border/40" type="email" />
          </div>
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security & Privacy
          </CardTitle>
          <CardDescription>Manage security policies and data protection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/40">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/40">
            <div>
              <p className="font-medium text-foreground">Data Encryption</p>
              <p className="text-sm text-muted-foreground">Enable end-to-end encryption</p>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/40">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Send alerts to admin email</p>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/40">
            <div>
              <p className="font-medium text-foreground">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Database Management */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Database Management
          </CardTitle>
          <CardDescription>Manage database backups and maintenance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-secondary/10 rounded-lg border border-border/40">
            <p className="text-sm font-medium text-foreground mb-3">Last Backup: 2 hours ago</p>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Backup Now
              </Button>
              <Button variant="outline" size="sm">
                Restore
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
