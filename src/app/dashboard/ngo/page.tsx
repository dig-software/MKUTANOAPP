"use client";
import { useCurrentUser } from "@/lib/UserContext";
import { BarChart3, TrendingUp, DollarSign, Building2, Users } from "lucide-react";
import Link from "next/link";
import { mockNgoPrograms } from "@/lib/mockData";

export default function NGODashboardPage() {
  const { currentUser } = useCurrentUser();

  const program = mockNgoPrograms[0];
  const totalAllocated = program.releaseToMfis.reduce((sum, m) => sum + m.amount, 0);
  const totalRemaining = program.totalAmount - totalAllocated;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          {currentUser?.name || "NGO Dashboard"}
        </h1>
        <p className="text-gray-600 mt-1">Manage funding programs and community outreach</p>
      </div>

      {/* Program Overview */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{program.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Program running until {program.endDate}
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-forest-100 text-forest-700">
            {program.status}
          </span>
        </div>
        <p className="text-gray-600 mb-6">{program.description}</p>

        {/* Funding Progress */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">TOTAL BUDGET</p>
            <p className="text-3xl font-bold text-gray-900">KES {(program.totalAmount / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">ALLOCATED TO MFIs</p>
            <p className="text-3xl font-bold text-forest-600">KES {(totalAllocated / 1000).toFixed(0)}K</p>
            <div className="w-full bg-sand-200 rounded-full h-2 mt-3">
              <div
                className="bg-forest-600 h-2 rounded-full"
                style={{ width: `${(totalAllocated / program.totalAmount) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">REMAINING</p>
            <p className="text-3xl font-bold text-earth-600">KES {(totalRemaining / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>

      {/* Partner MFIs */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Partner MFIs</h2>
        <div className="space-y-3">
          {program.releaseToMfis.map((mfi) => (
            <div key={mfi.mfiId} className="flex items-center justify-between p-4 bg-sand-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{mfi.mfiName}</h3>
                <p className="text-sm text-gray-500">Partnership since {mfi.relationshipDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">KES {(mfi.amount / 1000).toFixed(0)}K</p>
                <span
                  className={`text-xs font-medium ${
                    mfi.status === "active"
                      ? "text-forest-600"
                      : "text-gray-600"
                  }`}
                >
                  {mfi.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Communities Reached</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {program.releaseToMfis.reduce((sum, m) => sum + 3, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-forest-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Partner MFIs</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {program.releaseToMfis.length}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-forest-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Borrowers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">~127</p>
            </div>
            <Users className="w-8 h-8 text-earth-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Repayment Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">94%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-forest-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/dashboard/ngo/groups" className="card hover:shadow-md transition-shadow text-center py-8">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-gray-900 mb-1">Groups</h3>
          <p className="text-sm text-gray-500">Managed communities</p>
        </Link>
        <Link href="/dashboard/ngo/impact" className="card hover:shadow-md transition-shadow text-center py-8">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="font-semibold text-gray-900 mb-1">Impact</h3>
          <p className="text-sm text-gray-500">Program results</p>
        </Link>
        <Link href="/dashboard/ngo/loans" className="card hover:shadow-md transition-shadow text-center py-8">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-gray-900 mb-1">Loans</h3>
          <p className="text-sm text-gray-500">Portfolio tracking</p>
        </Link>
      </div>
    </div>
  );
}
