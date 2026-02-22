"use client";

import Link from "next/link";
import { ArrowLeft, Users, DollarSign, TrendingUp, MapPin } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);
}

export default function NGOGroupsPage() {
  const groups = [
    {
      id: "g1",
      name: "Kangemi Savings Group",
      location: "Kangemi, Nairobi",
      members: 10,
      totalFunded: 150000,
      loansIssued: 5,
      totalRepaid: 45000,
      outstandingBalance: 22500,
      meetingFrequency: "Monthly",
      contactPerson: "Mary Kipchoge",
      phone: "+254712345678",
      lastMeeting: "2026-02-25",
    },
    {
      id: "g2",
      name: "Westlands Women Savers",
      location: "Westlands, Nairobi",
      members: 12,
      totalFunded: 200000,
      loansIssued: 7,
      totalRepaid: 89000,
      outstandingBalance: 42000,
      meetingFrequency: "Bi-weekly",
      contactPerson: "Alice Mwangi",
      phone: "+254723456789",
      lastMeeting: "2026-02-28",
    },
    {
      id: "g3",
      name: "South B Chama",
      location: "South B, Nairobi",
      members: 8,
      totalFunded: 80000,
      loansIssued: 3,
      totalRepaid: 28000,
      outstandingBalance: 12000,
      meetingFrequency: "Monthly",
      contactPerson: "Christine Kiplagat",
      phone: "+254734567890",
      lastMeeting: "2026-02-20",
    },
  ];

  const totalFundedAmount = groups.reduce((sum, g) => sum + g.totalFunded, 0);
  const totalLoansIssued = groups.reduce((sum, g) => sum + g.loansIssued, 0);
  const totalRepaidAmount = groups.reduce((sum, g) => sum + g.totalRepaid, 0);
  const overallRepaymentRate = Math.round((totalRepaidAmount / totalFundedAmount) * 100);

  const getHealthStatus = (group: (typeof groups)[0]) => {
    const repaymentRate = (group.totalRepaid / group.totalFunded) * 100;
    if (repaymentRate >= 80) return { status: "Healthy", color: "bg-forest-100 text-forest-800" };
    if (repaymentRate >= 50) return { status: "Moderate", color: "bg-earth-100 text-earth-800" };
    return { status: "At Risk", color: "bg-terra-100 text-terra-800" };
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-forest-600 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Funded Groups</h1>
        <p className="text-gray-500 mt-1">Monitor performance across all partner groups</p>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Funded</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFundedAmount)}</p>
          <p className="text-xs text-gray-500 mt-2">{groups.length} groups</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Loans Issued</p>
          <p className="text-2xl font-bold text-earth-600">{totalLoansIssued}</p>
          <p className="text-xs text-gray-500 mt-2">Total loans</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Amount Repaid</p>
          <p className="text-2xl font-bold text-forest-600">{formatCurrency(totalRepaidAmount)}</p>
          <p className="text-xs text-gray-500 mt-2">{overallRepaymentRate}% rate</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Members Reached</p>
          <p className="text-2xl font-bold text-terra-600">{groups.reduce((sum, g) => sum + g.members, 0)}</p>
          <p className="text-xs text-gray-500 mt-2">Across groups</p>
        </div>
      </div>

      {/* Groups List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {groups.map((group) => {
          const repaymentRate = (group.totalRepaid / group.totalFunded) * 100;
          const health = getHealthStatus(group);

          return (
            <Link key={group.id} href={`/dashboard/ngo/groups/${group.id}`} className="card hover:shadow-lg transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-forest-600">{group.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {group.location}
                  </p>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${health.color}`}>{health.status}</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-sand-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Members</p>
                  <p className="text-lg font-bold text-gray-900">{group.members}</p>
                </div>
                <div className="bg-sand-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Loans</p>
                  <p className="text-lg font-bold text-gray-900">{group.loansIssued}</p>
                </div>
                <div className="bg-sand-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Repay %</p>
                  <p className="text-lg font-bold text-forest-600">{Math.round(repaymentRate)}%</p>
                </div>
              </div>

              {/* Repayment Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600">Repayment Progress</span>
                  <span className="text-xs font-semibold text-gray-700">{formatCurrency(group.totalRepaid)} of {formatCurrency(group.totalFunded)}</span>
                </div>
                <div className="w-full bg-sand-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-forest-500 h-full transition-all" style={{ width: `${repaymentRate}%` } as React.CSSProperties} />
                </div>
              </div>

              {/* Group Info */}
              <div className="border-t border-sand-100 pt-3 text-xs">
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">{group.contactPerson}</span> • {group.phone}
                </p>
                <p className="text-gray-500">Meeting: {group.meetingFrequency} • Last: {group.lastMeeting}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
