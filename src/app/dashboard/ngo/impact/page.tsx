"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

function StatCard({ title, value, subtitle, color = "forest" }: { title: string; value: string; subtitle?: string; color?: string }) {
  const colors = {
    forest: "bg-forest-50 border-forest-200",
    earth: "bg-earth-50 border-earth-200",
    terra: "bg-terra-50 border-terra-200",
  };
  return (
    <div className={`card border ${colors[color as keyof typeof colors]}`}>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}

export default function NGOImpactPage() {
  // Mock repayment data
  const repaymentData = [
    { month: "Jan", repaymentRate: 85, disbursed: 45000, repaid: 38250 },
    { month: "Feb", repaymentRate: 88, disbursed: 52000, repaid: 45760 },
    { month: "Mar", repaymentRate: 91, disbursed: 48000, repaid: 43680 },
    { month: "Apr", repaymentRate: 89, disbursed: 55000, repaid: 48950 },
    { month: "May", repaymentRate: 92, disbursed: 60000, repaid: 55200 },
    { month: "Jun", repaymentRate: 94, disbursed: 58000, repaid: 54520 },
  ];

  const loanStatusBreakdown = [
    { status: "Fully Repaid", count: 18, percentage: 60 },
    { status: "On Schedule", count: 9, percentage: 30 },
    { status: "Slightly Overdue", count: 2, percentage: 7 },
    { status: "Significantly Overdue", count: 1, percentage: 3 },
  ];

  const groupComparison = [
    { group: "Kangemi", repayment: 85, avgDays: 28, defaultRate: 1 },
    { group: "Westlands", repayment: 95, avgDays: 22, defaultRate: 0 },
    { group: "South B", repayment: 92, avgDays: 25, defaultRate: 0 },
  ];

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-forest-600 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Impact Report</h1>
        <p className="text-gray-500 mt-1">Loan repayment trends and group performance analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Average Repayment Rate" value="92%" color="forest" subtitle="Last 6 months" />
        <StatCard title="Total Loans Issued" value="30" color="earth" subtitle="Across all groups" />
        <StatCard title="Default Rate" value="3%" color="terra" subtitle="Within acceptable range" />
      </div>

      {/* Repayment Trend */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Repayment Trend (Last 6 Months)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Month</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Disbursed</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Repaid</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Rate</th>
              </tr>
            </thead>
            <tbody>
              {repaymentData.map((row) => (
                <tr key={row.month} className="border-b border-sand-50 hover:bg-sand-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{row.month}</td>
                  <td className="px-4 py-3 text-right text-gray-600">KES {row.disbursed.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-forest-600">KES {row.repaid.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-forest-100 text-forest-800">{row.repaymentRate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4">📈 Positive trend: Repayment rate improved from 85% to 94% over 6 months</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Loan Status Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Status Breakdown</h2>
          <div className="space-y-3">
            {loanStatusBreakdown.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.status === "Fully Repaid" && <CheckCircle className="w-4 h-4 text-forest-600" />}
                    {item.status === "On Schedule" && <TrendingUp className="w-4 h-4 text-earth-600" />}
                    {item.status.includes("Overdue") && <AlertCircle className="w-4 h-4 text-terra-600" />}
                    <span className="text-sm font-semibold text-gray-900">{item.status}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.count} loans</span>
                </div>
                <div className="w-full bg-sand-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${item.status === "Fully Repaid" ? "bg-forest-500" : item.status === "On Schedule" ? "bg-earth-500" : "bg-terra-500"}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.percentage}% of portfolio</p>
              </div>
            ))}
          </div>
        </div>

        {/* Group Performance Comparison */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Group Performance</h2>
          <div className="space-y-4">
            {groupComparison.map((group) => (
              <div key={group.group} className="pb-4 border-b border-sand-100 last:border-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{group.group}</h3>
                  <span className="text-sm font-bold text-forest-700">{group.repayment}%</span>
                </div>
                <div className="w-full bg-sand-100 rounded-full h-2 overflow-hidden mb-2">
                  <div className="bg-forest-500 h-full" style={{ width: `${group.repayment}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <p>Avg Repay Days: {group.avgDays}</p>
                  <p>Default Rate: {group.defaultRate}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card border-l-4 border-forest-500 bg-forest-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Overall repayment rate of 92% indicates strong loan performance across groups</li>
          <li>✓ Westlands Women Savers shows strongest performance with 95% repayment rate</li>
          <li>⚠ Monitor 1 overdue loan in Kangemi group - follow up by end of month</li>
          <li>✓ 6-month trend is positive, with repayment rates improving month-over-month</li>
        </ul>
      </div>
    </div>
  );
}
