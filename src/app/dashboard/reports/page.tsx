"use client";
import { Download, FileText, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

const reports = [
  { id: "r1", type: "Meeting Summary", title: "Session #25 — March 1, 2026", date: "2026-03-01", size: "124 KB" },
  { id: "r2", type: "Meeting Summary", title: "Session #24 — February 15, 2026", date: "2026-02-15", size: "118 KB" },
  { id: "r3", type: "Monthly Report", title: "February 2026 Financial Report", date: "2026-02-28", size: "256 KB" },
  { id: "r4", type: "Meeting Summary", title: "Session #23 — January 18, 2026", date: "2026-01-18", size: "122 KB" },
  { id: "r5", type: "Monthly Report", title: "January 2026 Financial Report", date: "2026-01-31", size: "248 KB" },
  { id: "r6", type: "Annual Report", title: "2025 Year-End Financial Report", date: "2025-12-31", size: "512 KB" },
];

const templates = [
  { icon: "📄", name: "Meeting Summary", desc: "Attendance, contributions, loans, repayments" },
  { icon: "📊", name: "Monthly Financial Report", desc: "All transactions for the selected month" },
  { icon: "👥", name: "Member Statement", desc: "Individual member savings and loan history" },
  { icon: "📈", name: "Annual Cycle Report", desc: "Full cycle summary with profit distribution" },
  { icon: "🏦", name: "Loan Portfolio Report", desc: "All active and repaid loans" },
  { icon: "⚠️", name: "Overdue Loans Report", desc: "List of all overdue loans and balances" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download financial reports</p>
        </div>
      </div>

      {/* Generate new report */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Generate New Report</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((t) => (
            <button key={t.name} className="flex items-start gap-3 p-4 rounded-xl border-2 border-sand-200 hover:border-forest-500 hover:bg-forest-50 transition-all text-left">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent reports */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <div className="space-y-2">
          {reports.map((r) => (
            <div key={r.id} className="flex items-center gap-4 p-4 bg-sand-50 rounded-xl hover:bg-sand-100 transition-colors">
              <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-forest-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="badge-green text-xs">{r.type}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{r.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(r.date)}
                  </div>
                  <span>•</span>
                  <span>{r.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export options */}
      <div className="card bg-earth-50 border-earth-200">
        <h3 className="text-sm font-semibold text-earth-800 mb-2">📤 Export Group Data</h3>
        <p className="text-sm text-earth-700 mb-4">
          Download all your group&apos;s data (members, meetings, contributions, loans) in CSV or Excel format for external analysis.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Export as CSV</Button>
          <Button variant="outline" size="sm">Export as Excel</Button>
        </div>
      </div>
    </div>
  );
}
