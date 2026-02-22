"use client";
import { useCurrentUser } from "@/lib/UserContext";
import { BarChart3, Users, TrendingUp, DollarSign, Award } from "lucide-react";
import Link from "next/link";
import { mockMfiLendingPortfolio } from "@/lib/mockData";

export default function MFIDashboardPage() {
  const { currentUser } = useCurrentUser();

  const stats = mockMfiLendingPortfolio.performanceMetrics;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          {currentUser?.name || "MFI Dashboard"}
        </h1>
        <p className="text-gray-600 mt-1">Manage lending portfolio and community groups</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Disbursed</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                KES {(stats.totalDisbursements / 1000).toFixed(0)}K
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-earth-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Repaid</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                KES {(stats.totalRepaid / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-forest-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                KES {(stats.outstandingBalance / 1000).toFixed(0)}K
              </p>
            </div>
            <Award className="w-8 h-8 text-earth-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Lending Groups</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {mockMfiLendingPortfolio.lendingGroups.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-forest-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Repayment Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {((1 - mockMfiLendingPortfolio.defaultRate) * 100).toFixed(0)}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-forest-200" />
          </div>
        </div>
      </div>

      {/* Lending Groups */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Lending Groups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sand-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Group Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Funded Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Loans Issued</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Repayment Rate</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {mockMfiLendingPortfolio.lendingGroups.map((group) => (
                <tr key={group.id} className="hover:bg-sand-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{group.name}</td>
                  <td className="px-4 py-3 text-gray-600">KES {(group.fundingAmount / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-gray-600">{group.loansIssuedCount}</td>
                  <td className="px-4 py-3">
                    <span className="text-forest-600 font-semibold">
                      {(group.avgRepaymentRate * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest-100 text-forest-700">
                      {group.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/dashboard/loans" className="card hover:shadow-md transition-shadow text-center py-8">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-gray-900 mb-1">Loan Portfolio</h3>
          <p className="text-sm text-gray-500">Manage active loans</p>
        </Link>
        <Link href="/dashboard/reports" className="card hover:shadow-md transition-shadow text-center py-8">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900 mb-1">Performance</h3>
          <p className="text-sm text-gray-500">Analytics & reports</p>
        </Link>
        <Link href="/dashboard/users" className="card hover:shadow-md transition-shadow text-center py-8">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-gray-900 mb-1">Borrowers</h3>
          <p className="text-sm text-gray-500">Community members</p>
        </Link>
      </div>
    </div>
  );
}
