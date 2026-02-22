"use client";
import { Badge } from "@/components/ui/Badge";
import { mockContributions } from "@/lib/mockData";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { DollarSign, TrendingUp, Hash } from "lucide-react";

export default function ContributionsPage() {
  const stats = {
    total: mockContributions.reduce((s, c) => s + c.amount, 0),
    shares: mockContributions.reduce((s, c) => s + c.shares, 0),
    confirmed: mockContributions.filter(c => c.confirmed).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Contributions</h1>
        <p className="text-sm text-gray-500 mt-1">All member contributions recorded</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-forest-700 mt-1 font-display">{formatCurrency(stats.total)}</p>
            </div>
            <div className="p-3 rounded-xl bg-forest-100">
              <DollarSign className="w-5 h-5 text-forest-600" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Shares</p>
              <p className="text-2xl font-bold text-earth-700 mt-1 font-display">{stats.shares}</p>
            </div>
            <div className="p-3 rounded-xl bg-earth-100">
              <Hash className="w-5 h-5 text-earth-600" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Confirmed Entries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 font-display">{stats.confirmed}/{mockContributions.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-sand-200">
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Contributions table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-100">
              <tr>
                <th className="table-header text-left">Member</th>
                <th className="table-header text-left">Type</th>
                <th className="table-header text-right">Shares</th>
                <th className="table-header text-right">Amount</th>
                <th className="table-header text-left">Recorded At</th>
                <th className="table-header text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockContributions.map((c) => (
                <tr key={c.id} className="hover:bg-sand-50 transition-colors">
                  <td className="table-cell">
                    <p className="font-semibold text-gray-900">{c.memberName}</p>
                  </td>
                  <td className="table-cell">
                    <span className="badge-gray capitalize">{c.type.replace("_", " ")}</span>
                  </td>
                  <td className="table-cell text-right font-semibold text-gray-900">{c.shares}</td>
                  <td className="table-cell text-right font-semibold text-forest-700">
                    {formatCurrency(c.amount)}
                  </td>
                  <td className="table-cell text-gray-600 text-xs">{formatDateTime(c.recordedAt)}</td>
                  <td className="table-cell text-center">
                    <Badge status={c.confirmed ? "confirmed" : "pending"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
