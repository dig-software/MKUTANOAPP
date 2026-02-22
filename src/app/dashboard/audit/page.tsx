"use client";
import { Card, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatShortDate } from "@/lib/utils";
import { Activity, Filter, Download, BarChart3, Activity as ActivityIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AuditLogPage() {
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");

  const logs = [
    {
      id: "log1",
      timestamp: "2026-02-19T14:32:00Z",
      user: "Grace Wanjiku",
      action: "meeting_closed",
      actionLabel: "Closed Meeting",
      details: "Session #25: Kangemi Savings Group",
      status: "success",
      ipAddress: "192.168.1.100",
    },
    {
      id: "log2",
      timestamp: "2026-02-19T13:15:00Z",
      user: "Mary Achieng",
      action: "contribution_recorded",
      actionLabel: "Recorded Contribution",
      details: "3 shares for KES 750 in Session #25",
      status: "success",
      ipAddress: "192.168.1.101",
    },
    {
      id: "log3",
      timestamp: "2026-02-19T12:45:00Z",
      user: "Admin Smith",
      action: "group_verified",
      actionLabel: "Verified Group",
      details: "Approved Westlands Women Savers",
      status: "success",
      ipAddress: "192.168.1.102",
    },
    {
      id: "log4",
      timestamp: "2026-02-19T11:20:00Z",
      user: "John Kariuki",
      action: "system_backup",
      actionLabel: "System Backup",
      details: "Daily backup completed successfully",
      status: "success",
      ipAddress: "192.168.1.103",
    },
    {
      id: "log5",
      timestamp: "2026-02-19T10:05:00Z",
      user: "Florence Kipchoge",
      action: "loan_issued",
      actionLabel: "Issued Loan",
      details: "KES 15,000 to Fatuma Hassan (12% interest)",
      status: "success",
      ipAddress: "192.168.1.104",
    },
    {
      id: "log6",
      timestamp: "2026-02-18T16:30:00Z",
      user: "Grace Wanjiku",
      action: "member_added",
      actionLabel: "Added Member",
      details: "Added Esther Wambui to Kangemi Savings Group",
      status: "success",
      ipAddress: "192.168.1.100",
    },
    {
      id: "log7",
      timestamp: "2026-02-18T15:10:00Z",
      user: "David Kipkemei",
      action: "login_failed",
      actionLabel: "Failed Login",
      details: "3 attempts from IP 203.45.67.89",
      status: "warning",
      ipAddress: "203.45.67.89",
    },
    {
      id: "log8",
      timestamp: "2026-02-18T14:45:00Z",
      user: "Sarah Johnson",
      action: "group_analytics_viewed",
      actionLabel: "Viewed Analytics",
      details: "Accessed South B Chama financial reports",
      status: "success",
      ipAddress: "192.168.1.105",
    },
    {
      id: "log9",
      timestamp: "2026-02-18T10:20:00Z",
      user: "Admin Smith",
      action: "user_suspended",
      actionLabel: "Suspended User",
      details: "Suspended account for John Doe due to suspicious activity",
      status: "warning",
      ipAddress: "192.168.1.102",
    },
    {
      id: "log10",
      timestamp: "2026-02-17T17:00:00Z",
      user: "Grace Wanjiku",
      action: "report_generated",
      actionLabel: "Generated Report",
      details: "Monthly financial report for Kangemi Savings Group",
      status: "success",
      ipAddress: "192.168.1.100",
    },
  ];

  const stats = {
    totalActions: logs.length,
    successRate: Math.round((logs.filter(l => l.status === "success").length / logs.length) * 100),
    warningCount: logs.filter(l => l.status === "warning").length,
    uniqueUsers: new Set(logs.map(l => l.user)).size,
  };

  const getActionColor = (action: string) => {
    if (action.includes("error") || action.includes("failed") || action.includes("suspended")) return "danger";
    if (action.includes("warning")) return "warning";
    return "default";
  };

  const filteredLogs = logs.filter(log => {
    if (selectedAction !== "all" && log.action !== selectedAction) return false;
    if (selectedUser !== "all" && log.user !== selectedUser) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-500 mt-1">Complete activity and security audit trail</p>
        </div>
        <button className="btn-outline flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Actions"
          value={stats.totalActions.toString()}
          icon={<Activity className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={<BarChart3 className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
        />
        <StatCard
          title="Warnings"
          value={stats.warningCount.toString()}
          icon={<Activity className="w-5 h-5 text-earth-600" />}
          iconBg="bg-earth-100"
        />
        <StatCard
          title="Unique Users"
          value={stats.uniqueUsers.toString()}
          icon={<Activity className="w-5 h-5 text-terra-600" />}
          iconBg="bg-terra-100"
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="Search by user name or IP address..." />
          </div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-2 border border-sand-200 rounded-lg text-sm bg-white"
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="contribution_recorded">Contribution</option>
            <option value="loan_issued">Loan Issued</option>
            <option value="meeting_closed">Meeting Closed</option>
            <option value="report_generated">Report Generated</option>
            <option value="group_verified">Group Verified</option>
          </select>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 border border-sand-200 rounded-lg text-sm bg-white"
          >
            <option value="all">All Users</option>
            <option value="Grace Wanjiku">Grace Wanjiku</option>
            <option value="Mary Achieng">Mary Achieng</option>
            <option value="Admin Smith">Admin Smith</option>
            <option value="John Kariuki">John Kariuki</option>
          </select>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <div key={log.id} className={`flex gap-4 pb-4 ${index !== filteredLogs.length - 1 ? "border-b border-sand-100" : ""}`}>
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${log.status === "success" ? "bg-forest-500" : log.status === "warning" ? "bg-earth-500" : "bg-terra-500"}`} />
                {index !== filteredLogs.length - 1 && <div className="w-0.5 h-8 bg-sand-200 my-2" />}
              </div>

              {/* Activity details */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{log.actionLabel}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{log.details}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>By {log.user}</span>
                      <span>•</span>
                      <span>{formatDate(log.timestamp)}</span>
                      <span>•</span>
                      <span className="font-mono text-gray-400">{log.ipAddress}</span>
                    </div>
                  </div>
                  <Badge
                    status={log.status === "success" ? "confirmed" : log.status === "warning" ? "pending" : "overdue"}
                    className="shrink-0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <ActivityIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No logs matching the selected filters</p>
          </div>
        )}
      </Card>

      {/* Security Alerts */}
      {logs.filter(l => l.status === "warning").length > 0 && (
        <Card className="border-l-4 border-l-earth-500 bg-earth-50">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Security Alerts</h2>
          <div className="space-y-2">
            {logs
              .filter(l => l.status === "warning")
              .slice(0, 3)
              .map((log) => (
                <p key={log.id} className="text-sm text-earth-800">
                  <span className="font-semibold">{log.actionLabel}:</span> {log.details}
                </p>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
