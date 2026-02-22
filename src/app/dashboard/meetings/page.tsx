"use client";
import { Badge } from "@/components/ui/Badge";
import { mockMeetings } from "@/lib/mockData";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Calendar, Users, ChevronRight } from "lucide-react";

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Meetings</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all group meetings</p>
        </div>
        <Link href="/dashboard/meetings/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          New Meeting
        </Link>
      </div>

      {/* Meeting list */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-100">
              <tr>
                <th className="table-header text-left">Session</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Venue</th>
                <th className="table-header text-right">Contributions</th>
                <th className="table-header text-right">Loans</th>
                <th className="table-header text-right">Repayments</th>
                <th className="table-header text-center">Attendance</th>
                <th className="table-header text-center">Status</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {mockMeetings.map((m) => (
                <tr key={m.id} className="hover:bg-sand-50 transition-colors">
                  <td className="table-cell">
                    <span className="font-semibold text-gray-900">#{m.sessionNumber}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatShortDate(m.date)}
                    </div>
                  </td>
                  <td className="table-cell text-gray-600">{m.venue}</td>
                  <td className="table-cell text-right font-semibold text-forest-700">
                    {formatCurrency(m.totalContributions)}
                  </td>
                  <td className="table-cell text-right font-semibold text-earth-700">
                    {formatCurrency(m.totalLoansIssued)}
                  </td>
                  <td className="table-cell text-right font-semibold text-terra-700">
                    {formatCurrency(m.totalRepayments)}
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Users className="w-3 h-3 text-gray-400" />
                      {m.attendanceCount}/18
                    </div>
                  </td>
                  <td className="table-cell text-center">
                    <Badge status={m.status} />
                  </td>
                  <td className="table-cell text-right">
                    <Link href={`/dashboard/meetings/${m.id}`} className="text-forest-600 hover:text-forest-700">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Meetings This Cycle", value: mockMeetings.length, color: "text-forest-700" },
          { label: "Total Contributions", value: formatCurrency(mockMeetings.reduce((s, m) => s + m.totalContributions, 0)), color: "text-earth-700" },
          { label: "Avg Attendance Rate", value: "94%", color: "text-gray-700" },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
