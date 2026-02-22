"use client";
import { Card, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Settings, Database, Shield, Mail, Bell, Zap, Save, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/UserContext";
import { isDemoModeAllowed, isDemoModeEnabled, setDemoModeEnabled } from "@/lib/demoMode";

export default function SystemSettingsPage() {
  const { currentUser } = useCurrentUser();
  const [settings, setSettings] = useState({
    platformName: "Mkutano",
    supportEmail: "support@mkutano.app",
    maxGroupSize: 30,
    minGroupSize: 3,
    defaultLoanInterestRate: 12,
    maxLoanAmount: 500000,
    minLoanAmount: 5000,
    backupFrequency: "daily",
    maintenanceMode: false,
    enableNotifications: true,
    enableOfflineSync: true,
  });

  const [saved, setSaved] = useState(false);
  const [demoModeAllowed, setDemoModeAllowed] = useState(false);
  const [demoModeEnabled, setDemoModeEnabledState] = useState(false);

  useEffect(() => {
    setDemoModeAllowed(isDemoModeAllowed());
    setDemoModeEnabledState(isDemoModeEnabled());
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const systemStatus = {
    database: { status: "healthy", lastCheck: "2 minutes ago" },
    apiServer: { status: "healthy", lastCheck: "1 minute ago" },
    syncService: { status: "healthy", lastCheck: "30 seconds ago" },
    backupService: { status: "healthy", lastCheck: "2 hours ago" },
    emailService: { status: "healthy", lastCheck: "5 minutes ago" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure platform-wide settings and preferences</p>
        </div>
        <button className="btn-outline flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
      </div>

      {/* System Status */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(systemStatus).map(([service, data]) => (
            <div key={service} className="p-3 bg-sand-50 rounded-lg border border-sand-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-forest-500 rounded-full" />
                <p className="text-sm font-semibold text-gray-900 capitalize">{service.replace(/([A-Z])/g, " $1")}</p>
              </div>
              <p className="text-xs text-gray-500">{data.lastCheck}</p>
              <Badge status="confirmed" />
            </div>
          ))}
        </div>
      </Card>

      {/* General Settings */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Platform Name"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
            />
            <Input
              label="Support Email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Group Configuration */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Group Configuration
        </h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxGroupSize" className="block text-sm font-semibold text-gray-700 mb-2">Max Group Size</label>
              <input
                id="maxGroupSize"
                type="number"
                value={settings.maxGroupSize}
                onChange={(e) => setSettings({ ...settings, maxGroupSize: parseInt(e.target.value) })}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum members allowed per group</p>
            </div>
            <div>
              <label htmlFor="minGroupSize" className="block text-sm font-semibold text-gray-700 mb-2">Min Group Size</label>
              <input
                id="minGroupSize"
                type="number"
                value={settings.minGroupSize}
                onChange={(e) => setSettings({ ...settings, minGroupSize: parseInt(e.target.value) })}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum members required for group formation</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Loan Settings */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Loan Configuration
        </h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="interestRate" className="block text-sm font-semibold text-gray-700 mb-2">Default Interest Rate (%)</label>
              <input
                id="interestRate"
                type="number"
                step="0.5"
                value={settings.defaultLoanInterestRate}
                onChange={(e) => setSettings({ ...settings, defaultLoanInterestRate: parseFloat(e.target.value) })}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Default interest rate for new loans</p>
            </div>
            <div>
              <label htmlFor="maxLoanAmount" className="block text-sm font-semibold text-gray-700 mb-2">Max Loan Amount (KES)</label>
              <input
                id="maxLoanAmount"
                type="number"
                value={settings.maxLoanAmount}
                onChange={(e) => setSettings({ ...settings, maxLoanAmount: parseInt(e.target.value) })}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum loan size</p>
            </div>
            <div>
              <label htmlFor="minLoanAmount" className="block text-sm font-semibold text-gray-700 mb-2">Min Loan Amount (KES)</label>
              <input
                id="minLoanAmount"
                type="number"
                value={settings.minLoanAmount}
                onChange={(e) => setSettings({ ...settings, minLoanAmount: parseInt(e.target.value) })}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum loan size</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Backup & Maintenance */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Backup & Maintenance
        </h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="backupFreq" className="block text-sm font-semibold text-gray-700 mb-2">Backup Frequency</label>
              <select
                id="backupFreq"
                value={settings.backupFrequency}
                onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                className="input-field"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">How often to backup the database</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Backup</label>
              <div className="p-2.5 bg-sand-50 rounded-lg border border-sand-200 text-sm text-gray-600">
                February 19, 2026 at 02:00 AM
              </div>
              <p className="text-xs text-gray-500 mt-1">Date and time of last system backup</p>
            </div>
          </div>
          <button className="btn-outline flex items-center gap-2">
            <Database className="w-4 h-4" />
            Run Backup Now
          </button>
        </div>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Feature Toggles
        </h2>
        <div className="space-y-3">
          {demoModeAllowed && currentUser?.role === "admin" && (
            <div className="flex items-center justify-between p-3 bg-forest-50 rounded-lg border border-forest-200">
              <div>
                <p className="font-semibold text-gray-900">Demo Mode</p>
                <p className="text-sm text-gray-600">Force mock data for demos and pitches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={demoModeEnabled}
                  onChange={(e) => {
                    setDemoModeEnabled(e.target.checked);
                    setDemoModeEnabledState(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-forest-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-600" />
              </label>
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-sand-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Disable access for non-admin users during updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-forest-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-600" />
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-sand-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Send alerts to users about important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-forest-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-600" />
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-sand-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Offline Sync</p>
              <p className="text-sm text-gray-500">Allow data capture without internet connection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableOfflineSync}
                onChange={(e) => setSettings({ ...settings, enableOfflineSync: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-forest-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-600" />
            </label>
          </div>
        </div>
      </Card>

      {/* Save Status */}
      {saved && (
        <div className="p-4 bg-forest-50 border border-forest-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-forest-600" />
          <p className="text-sm font-semibold text-forest-800">Settings saved successfully!</p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex gap-3 justify-end">
        <button className="btn-outline">Cancel</button>
        <button className="btn-primary flex items-center gap-2" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      {/* Security Notice */}
      <Card className="border-l-4 border-l-earth-500 bg-earth-50">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-earth-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-earth-900">Security Notice</h3>
            <p className="text-sm text-earth-800 mt-1">
              Changes to system settings are logged and can only be made by platform administrators. Always verify settings before saving.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
