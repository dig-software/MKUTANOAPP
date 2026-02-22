"use client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockUser, mockGroup } from "@/lib/mockData";
import { Save, User, Lock, Bell, Globe, Shield } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and group preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-forest-600" />
          <h2 className="text-base font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue={mockUser.name} />
            <Input label="Phone Number" defaultValue={mockUser.phone} />
          </div>
          <Input label="Email Address" type="email" defaultValue={mockUser.email} />
          <Input label="Role" defaultValue={mockUser.role} disabled helpText="Contact admin to change your role" />
        </div>
      </Card>

      {/* Group Settings */}
      {mockUser.role === "secretary" && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-earth-600" />
            <h2 className="text-base font-semibold text-gray-900">Group Settings</h2>
          </div>
          <div className="space-y-4">
            <Input label="Group Name" defaultValue={mockGroup.name} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Village / Ward" defaultValue={mockGroup.village} />
              <Input label="District / County" defaultValue={mockGroup.district} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Currency" defaultValue={mockGroup.currency} />
              <Input label="Member Count" defaultValue={mockGroup.memberCount.toString()} disabled />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Cycle Start Date" type="date" defaultValue={mockGroup.cycleStartDate} />
              <Input label="Cycle End Date" type="date" defaultValue={mockGroup.cycleEndDate} />
            </div>
          </div>
        </Card>
      )}

      {/* Security */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-terra-600" />
          <h2 className="text-base font-semibold text-gray-900">Security</h2>
        </div>
        <div className="space-y-4">
          <Input label="Current Password" type="password" placeholder="Enter current password" />
          <Input label="New Password" type="password" placeholder="Choose a new password" />
          <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-forest-600" />
          <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Meeting reminders", desc: "Get notified 24 hours before each meeting" },
            { label: "Overdue loan alerts", desc: "Notify me when a loan becomes overdue" },
            { label: "Report generation", desc: "Notify me when a new report is ready" },
            { label: "Member activity", desc: "Notify me when a member joins or leaves" },
            { label: "Sync status", desc: "Notify me when offline data syncs successfully" },
          ].map((notif) => (
            <label key={notif.label} className="flex items-start gap-3 p-3 bg-sand-50 rounded-xl cursor-pointer hover:bg-sand-100 transition-colors">
              <input type="checkbox" defaultChecked className="mt-0.5 w-5 h-5 rounded border-gray-300 text-forest-600 focus:ring-forest-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{notif.label}</p>
                <p className="text-xs text-gray-500">{notif.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card className="bg-sand-50 border-sand-200">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-semibold text-gray-900">Data & Privacy</h2>
        </div>
        <div className="space-y-3">
          <Button variant="outline" size="sm">Export All My Data</Button>
          <Button variant="outline" size="sm">Download Audit Trail</Button>
          <Button variant="danger" size="sm">Delete My Account</Button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Deleting your account is permanent and cannot be undone. All your data will be removed within 30 days.
        </p>
      </Card>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3 sticky bottom-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
