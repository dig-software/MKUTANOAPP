"use client";
import { Badge } from "@/components/ui/Badge";
import { mockLoans } from "@/lib/mockData";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Filter, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function LoansPage() {
  const [filter, setFilter] = useState<"all" | "active" | "overdue" | "repaid">("all");
  const filtered = filter === "all" ? mockLoans : mockLoans.filter(l => l.status === filter);

  const stats = {
    totalOut: mockLoans.filter(l => l.status === "active" || l.status === "overdue").reduce((s, l) => s + l.balance, 0),
    totalRepaid: mockLoans.reduce((s, l) => s + l.totalRepaid, 0),
    overdue: mockLoans.filter(l => l.status === "overdue").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Loans</h1>
          <p className="text-sm text-gray-500 mt-1">Track all loans issued and repayments</p>
        </div>
        <Link href="/dashboard/loans/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Issue Loan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Outstanding</p>
              <p className="text-2xl font-bold text-earth-700 mt-1 font-display">{formatCurrency(stats.totalOut)}</p>
            </div>
            <div className="p-3 rounded-xl bg-earth-100">
              <DollarSign className="w-5 h-5 text-earth-600" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Repaid</p>
              <p className="text-2xl font-bold text-forest-700 mt-1 font-display">{formatCurrency(stats.totalRepaid)}</p>
            </div>
            <div className="p-3 rounded-xl bg-forest-100">
              <TrendingUp className="w-5 h-5 text-forest-600" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue Loans</p>
              <p className="text-2xl font-bold text-terra-700 mt-1 font-display">{stats.overdue}</p>
            </div>
            <div className="p-3 rounded-xl bg-terra-100">
              <AlertTriangle className="w-5 h-5 text-terra-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {["all", "active", "overdue", "repaid"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${filter === f ? "bg-forest-600 text-white" : "bg-sand-100 text-gray-600 hover:bg-sand-200"}`}
            >
              {f} {f !== "all" && `(${mockLoans.filter(l => l.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Loans table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-100">
              <tr>
                <th className="table-header text-left">Member</th>
                <th className="table-header text-left">Purpose</th>
                <th className="table-header text-right">Amount</th>
                <th className="table-header text-right">Interest</th>
                <th className="table-header text-right">Repaid</th>
                <th className="table-header text-right">Balance</th>
                <th className="table-header text-left">Due Date</th>
                <th className="table-header text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((loan) => (
                <tr key={loan.id} className="hover:bg-sand-50 transition-colors">
                  <td className="table-cell">
                    <p className="font-semibold text-gray-900">{loan.memberName}</p>
                    <p className="text-xs text-gray-500">Issued {formatShortDate(loan.issuedAt)}</p>
                  </td>
                  <td className="table-cell text-gray-600">{loan.purpose}</td>
                  <td className="table-cell text-right font-semibold text-gray-900">
                    {formatCurrency(loan.amount)}
                  </td>
                  <td className="table-cell text-right text-earth-600">{loan.interestRate}%</td>
                  <td className="table-cell text-right font-semibold text-forest-700">
                    {formatCurrency(loan.totalRepaid)}
                  </td>
                  <td className="table-cell text-right font-semibold text-terra-700">
                    {formatCurrency(loan.balance)}
                  </td>
                  <td className="table-cell">
                    <span className={loan.status === "overdue" ? "text-terra-600 font-semibold" : "text-gray-600"}>
                      {formatShortDate(loan.dueDate)}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <Badge status={loan.status} />
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
