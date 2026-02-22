"use client";
export const dynamic = "force-dynamic";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockStats, mockChartData, mockMeetings, mockMembers, mockLoans, mockContributions } from "@/lib/mockData";
import { formatCurrency, formatShortDate, timeAgo } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, TrendingUp, Users, Calendar, AlertTriangle, PiggyBank, Wallet, FileText, UserCircle } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/lib/UserContext";

export default function DashboardPage() {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading || !currentUser) return null;

  // If member, show wallet view
  if (currentUser.role === "member") {
    const member = mockMembers.find(m => m.id === currentUser.memberId) || mockMembers[0];
    const memberLoans = mockLoans.filter(l => l.memberId === member.id);
    const recentContributions = mockContributions.filter(c => c.memberId === member.id).slice(0, 5);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">My Wallet</h1>
            <p className="text-gray-500 mt-1">Your personal savings and loan summary</p>
          </div>
          <Link href="/dashboard/my-contributions" className="btn-primary">
            View All
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Saved"
            value={formatCurrency(member.totalSaved)}
            icon={<PiggyBank className="w-5 h-5 text-forest-600" />}
            iconBg="bg-forest-100"
            subtitle="Lifetime savings"
          />
          <StatCard
            title="Wallet Balance"
            value={formatCurrency(member.walletBalance)}
            icon={<Wallet className="w-5 h-5 text-earth-600" />}
            iconBg="bg-earth-100"
          />
          <StatCard
            title="Active Loans"
            value={formatCurrency(member.totalLoaned - member.totalRepaid)}
            icon={<TrendingUp className="w-5 h-5 text-terra-600" />}
            iconBg="bg-terra-100"
            subtitle={`${memberLoans.filter(l => l.status === "active").length} loan(s)`}
          />
          <StatCard
            title="Repayment Rate"
            value="115%"
            icon={<Calendar className="w-5 h-5 text-forest-600" />}
            iconBg="bg-forest-100"
            subtitle="Ahead of schedule"
          />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/my-contributions" className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">My Contributions</p>
                <p className="text-xs text-gray-500">{mockContributions.filter(c => c.memberId === member.id).length} total</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/my-loans" className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-earth-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-earth-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">My Loans</p>
                <p className="text-xs text-gray-500">{memberLoans.length} total</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/meeting-history" className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-terra-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-terra-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Meeting History</p>
                <p className="text-xs text-gray-500">{mockMeetings.filter(m => m.status === "closed").length} meetings</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent contributions preview */}
        {recentContributions.length > 0 && (
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Contributions</h2>
            <div className="space-y-2">
              {recentContributions.map((c) => {
                const meeting = mockMeetings.find(m => m.id === c.meetingId);
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-sand-50 rounded-lg text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">Session #{meeting?.sessionNumber}</p>
                      <p className="text-xs text-gray-500">{formatShortDate(c.recordedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-forest-700">{formatCurrency(c.amount)}</p>
                      <Badge status={c.confirmed ? "confirmed" : "pending"} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin dashboard
  if (currentUser.role === "admin") {
    const allGroups = [
      { id: "g1", name: "Kangemi Savings Group", members: 10, totalSavings: 125000, activeLoanCount: 5, loanPortfolio: 45000 },
      { id: "g2", name: "Westlands Women Savers", members: 12, totalSavings: 185000, activeLoanCount: 7, loanPortfolio: 64000 },
      { id: "g3", name: "South B Chama", members: 8, totalSavings: 92000, activeLoanCount: 3, loanPortfolio: 28000 },
      { id: "g4", name: "Nairobi CBD Investors", members: 15, totalSavings: 312000, activeLoanCount: 11, loanPortfolio: 125000 },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 mt-1">Platform overview and management</p>
          </div>
          <Link href="/dashboard/system" className="btn-outline">
            System Settings
          </Link>
        </div>

        {/* Platform Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Active Groups"
            value={allGroups.length.toString()}
            icon={<Users className="w-5 h-5 text-forest-600" />}
            iconBg="bg-forest-100"
            trend={{ value: "+2 this month", positive: true }}
          />
          <StatCard
            title="Total Members"
            value={allGroups.reduce((sum, g) => sum + g.members, 0).toString()}
            icon={<Users className="w-5 h-5 text-earth-600" />}
            iconBg="bg-earth-100"
          />
          <StatCard
            title="Platform Savings"
            value={formatCurrency(allGroups.reduce((sum, g) => sum + g.totalSavings, 0))}
            icon={<PiggyBank className="w-5 h-5 text-forest-600" />}
            iconBg="bg-forest-100"
          />
          <StatCard
            title="Loan Portfolio"
            value={formatCurrency(allGroups.reduce((sum, g) => sum + g.loanPortfolio, 0))}
            icon={<DollarSign className="w-5 h-5 text-terra-600" />}
            iconBg="bg-terra-100"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/dashboard/all-groups" className="card p-4 hover:shadow-md transition-shadow text-center">
            <Users className="w-6 h-6 text-forest-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Groups</p>
            <p className="text-xs text-gray-500">{allGroups.length} total</p>
          </Link>
          <Link href="/dashboard/users" className="card p-4 hover:shadow-md transition-shadow text-center">
            <UserCircle className="w-6 h-6 text-earth-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Users</p>
            <p className="text-xs text-gray-500">All accounts</p>
          </Link>
          <Link href="/dashboard/audit" className="card p-4 hover:shadow-md transition-shadow text-center">
            <FileText className="w-6 h-6 text-terra-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Audit Log</p>
            <p className="text-xs text-gray-500">Activity history</p>
          </Link>
          <button className="card p-4 hover:shadow-md transition-shadow text-center">
            <AlertTriangle className="w-6 h-6 text-terra-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Support</p>
            <p className="text-xs text-gray-500">3 pending</p>
          </button>
        </div>

        {/* Groups Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Groups</h2>
            <Link href="/dashboard/all-groups" className="text-sm font-semibold text-forest-600 hover:text-forest-700">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-100">
                  <th className="table-header">Group Name</th>
                  <th className="table-header text-center">Members</th>
                  <th className="table-header text-right">Total Savings</th>
                  <th className="table-header text-center">Loans</th>
                  <th className="table-header text-right">Portfolio</th>
                </tr>
              </thead>
              <tbody>
                {allGroups.map((group) => (
                  <tr key={group.id} className="border-b border-sand-50 hover:bg-sand-50">
                    <td className="table-cell">
                      <Link href={`/dashboard/all-groups/${group.id}`} className="font-semibold text-gray-900 hover:text-forest-600">
                        {group.name}
                      </Link>
                    </td>
                    <td className="table-cell text-center">{group.members}</td>
                    <td className="table-cell text-right font-semibold text-forest-700">{formatCurrency(group.totalSavings)}</td>
                    <td className="table-cell text-center">{group.activeLoanCount}</td>
                    <td className="table-cell text-right font-semibold text-earth-700">{formatCurrency(group.loanPortfolio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-forest-500 rounded-full" />
                  <span className="text-sm text-gray-600">Database</span>
                </div>
                <Badge status="confirmed" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-forest-500 rounded-full" />
                  <span className="text-sm text-gray-600">API Server</span>
                </div>
                <Badge status="confirmed" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-forest-500 rounded-full" />
                  <span className="text-sm text-gray-600">Sync Service</span>
                </div>
                <Badge status="confirmed" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-forest-500 rounded-full" />
                  <span className="text-sm text-gray-600">Backups</span>
                </div>
                <Badge status="confirmed" />
              </div>
              <p className="text-xs text-gray-500 mt-3">Last sync: 2 minutes ago</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Admin Actions</h2>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Admin Smith approved group verification</p>
                <p className="text-xs text-gray-500">20 minutes ago</p>
              </div>
              <div className="border-t border-sand-100 pt-3 text-sm">
                <p className="font-semibold text-gray-900">Support ticket #1203 resolved</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <div className="border-t border-sand-100 pt-3 text-sm">
                <p className="font-semibold text-gray-900">New group registered: Kibra Savers</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
              <div className="border-t border-sand-100 pt-3 text-sm">
                <p className="font-semibold text-gray-900">Security alert: 3 failed logins (Smith, John)</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            <Link href="/dashboard/audit" className="btn-outline w-full mt-4 text-sm">
              View Full Audit Log →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // NGO/MFI dashboard
  if (currentUser.role === "ngo") {
    const fundedGroups = [
      { id: "g1", name: "Kangemi Savings Group", location: "Kangemi, Nairobi", members: 10, fundedAmount: 150000, loanCount: 5, loansRepaid: 3, repaidAmount: 45000, outstandingAmount: 22500 },
      { id: "g2", name: "Westlands Women Savers", location: "Westlands, Nairobi", members: 12, fundedAmount: 200000, loanCount: 7, loansRepaid: 5, repaidAmount: 89000, outstandingAmount: 42000 },
      { id: "g3", name: "South B Chama", location: "South B, Nairobi", members: 8, fundedAmount: 80000, loanCount: 3, loansRepaid: 2, repaidAmount: 28000, outstandingAmount: 12000 },
    ];

    const totalFunded = fundedGroups.reduce((sum, g) => sum + g.fundedAmount, 0);
    const totalRepaid = fundedGroups.reduce((sum, g) => sum + g.repaidAmount, 0);
    const totalOutstanding = fundedGroups.reduce((sum, g) => sum + g.outstandingAmount, 0);
    const overallRepaymentRate = Math.round((totalRepaid / totalFunded) * 100);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">NGO Impact Dashboard</h1>
            <p className="text-gray-500 mt-1">Monitor loan impact and repayment across funded groups</p>
          </div>
          <Link href="/dashboard/ngo/impact" className="btn-primary">
            View Impact Report
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Funded"
            value={formatCurrency(totalFunded)}
            icon={<DollarSign className="w-5 h-5 text-forest-600" />}
            iconBg="bg-forest-100"
            trend={{ value: `${fundedGroups.length} groups`, positive: true }}
          />
          <StatCard
            title="Amount Repaid"
            value={formatCurrency(totalRepaid)}
            icon={<TrendingUp className="w-5 h-5 text-forest-600" />}
            iconBg="bg-forest-100"
            trend={{ value: `${overallRepaymentRate}% repayment rate`, positive: true }}
          />
          <StatCard
            title="Outstanding Balance"
            value={formatCurrency(totalOutstanding)}
            icon={<AlertTriangle className="w-5 h-5 text-earth-600" />}
            iconBg="bg-earth-100"
            subtitle={`Across ${fundedGroups.reduce((sum, g) => sum + g.loanCount, 0)} loans`}
          />
          <StatCard
            title="Groups Monitored"
            value={fundedGroups.length.toString()}
            icon={<Users className="w-5 h-5 text-terra-600" />}
            iconBg="bg-terra-100"
            subtitle={`${fundedGroups.reduce((sum, g) => sum + g.members, 0)} members total`}
          />
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link href="/dashboard/ngo/impact" className="card p-4 hover:shadow-md transition-shadow text-center">
            <TrendingUp className="w-6 h-6 text-forest-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Impact Report</p>
            <p className="text-xs text-gray-500">Repayment analysis</p>
          </Link>
          <Link href="/dashboard/ngo/loans" className="card p-4 hover:shadow-md transition-shadow text-center">
            <DollarSign className="w-6 h-6 text-earth-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Loan Portfolio</p>
            <p className="text-xs text-gray-500">{fundedGroups.reduce((sum, g) => sum + g.loanCount, 0)} loans</p>
          </Link>
          <Link href="/dashboard/ngo/groups" className="card p-4 hover:shadow-md transition-shadow text-center">
            <Users className="w-6 h-6 text-terra-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Groups</p>
            <p className="text-xs text-gray-500">{fundedGroups.length} monitored</p>
          </Link>
        </div>

        {/* Funded Groups Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Funded Groups</h2>
            <Link href="/dashboard/ngo/groups" className="text-sm font-semibold text-forest-600 hover:text-forest-700">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-100">
                  <th className="table-header">Group Name</th>
                  <th className="table-header text-right">Funded Amount</th>
                  <th className="table-header text-right">Repaid</th>
                  <th className="table-header text-right">Outstanding</th>
                  <th className="table-header text-center">Repayment %</th>
                </tr>
              </thead>
              <tbody>
                {fundedGroups.map((group) => {
                  const repaymentRate = Math.round((group.repaidAmount / group.fundedAmount) * 100);
                  return (
                    <tr key={group.id} className="border-b border-sand-50 hover:bg-sand-50">
                      <td className="table-cell">
                        <Link href={`/dashboard/ngo/groups/${group.id}`} className="font-semibold text-gray-900 hover:text-forest-600">
                          {group.name}
                        </Link>
                        <p className="text-xs text-gray-500">{group.location}</p>
                      </td>
                      <td className="table-cell text-right font-semibold text-forest-700">{formatCurrency(group.fundedAmount)}</td>
                      <td className="table-cell text-right font-semibold text-forest-600">{formatCurrency(group.repaidAmount)}</td>
                      <td className="table-cell text-right">{formatCurrency(group.outstandingAmount)}</td>
                      <td className="table-cell text-center">
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${repaymentRate >= 80 ? "bg-forest-100 text-forest-800" : repaymentRate >= 50 ? "bg-earth-100 text-earth-800" : "bg-terra-100 text-terra-800"}`}>
                          {repaymentRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Impact Metrics Card */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Loan Health Summary</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Repayment Rate</span>
                  <span className="text-lg font-bold text-forest-700">{overallRepaymentRate}%</span>
                </div>
                <progress className="progress-bar" value={overallRepaymentRate} max={100} />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-sand-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-forest-700">{fundedGroups.reduce((sum, g) => sum + g.loansRepaid, 0)}</p>
                  <p className="text-xs text-gray-500">Loans Repaid</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-earth-700">{fundedGroups.reduce((sum, g) => sum + g.loanCount - g.loansRepaid, 0)}</p>
                  <p className="text-xs text-gray-500">Active Loans</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-terra-700">0</p>
                  <p className="text-xs text-gray-500">Overdue</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Social Impact</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-forest-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Members Reached</p>
                  <p className="text-xs text-gray-500">Active members</p>
                </div>
                <p className="text-2xl font-bold text-forest-700">{fundedGroups.reduce((sum, g) => sum + g.members, 0)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Total Capital Deployed</p>
                  <p className="text-xs text-gray-500">Including revolving loans</p>
                </div>
                <p className="text-2xl font-bold text-earth-700">{formatCurrency(totalFunded)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-terra-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Loan Success Rate</p>
                  <p className="text-xs text-gray-500">Non-default rate</p>
                </div>
                <p className="text-2xl font-bold text-forest-700">98%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Secretary dashboard
  const overdueLoans = mockLoans.filter(l => l.status === "overdue");
  const upcomingMeeting = { date: "2026-03-15", venue: "Kangemi Community Hall" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your group&apos;s financial health</p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Savings"
          value={formatCurrency(mockStats.totalSavings)}
          icon={<PiggyBank className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
          trend={{ value: "+12% this month", positive: true }}
        />
        <StatCard
          title="Active Loans"
          value={formatCurrency(mockStats.totalLoansOut)}
          icon={<DollarSign className="w-5 h-5 text-earth-600" />}
          iconBg="bg-earth-100"
          subtitle={`${mockLoans.filter(l => l.status === "active").length} loans outstanding`}
        />
        <StatCard
          title="Total Repaid"
          value={formatCurrency(mockStats.totalRepaid)}
          icon={<TrendingUp className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
          trend={{ value: "+8% this cycle", positive: true }}
        />
        <StatCard
          title="Active Members"
          value={mockStats.activeMembers}
          icon={<Users className="w-5 h-5 text-terra-600" />}
          iconBg="bg-terra-100"
          subtitle="out of 18 total"
        />
      </div>

      {/* Charts and quick actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Savings & Loans Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7d9bf" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#8f5c39" />
              <YAxis tick={{ fontSize: 12 }} stroke="#8f5c39" />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e7d9bf", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="savings" stroke="#27a368" strokeWidth={2} name="Savings" />
              <Line type="monotone" dataKey="loans" stroke="#dc822e" strokeWidth={2} name="Loans Issued" />
              <Line type="monotone" dataKey="repayments" stroke="#e35535" strokeWidth={2} name="Repayments" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="card space-y-3">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Quick Actions</h2>
          <Link href="/dashboard/meetings/new" className="btn-primary w-full justify-center">
            <Calendar className="w-4 h-4" />
            Start New Meeting
          </Link>
          <Link href="/dashboard/members" className="btn-outline w-full justify-center">
            <Users className="w-4 h-4" />
            View Members
          </Link>
          <Link href="/dashboard/reports" className="btn-ghost w-full justify-start">
            📄 Generate Report
          </Link>
          <Link href="/dashboard/loans" className="btn-ghost w-full justify-start">
            💰 Issue Loan
          </Link>

          {/* Upcoming meeting */}
          {upcomingMeeting && (
            <div className="mt-5 p-3 bg-earth-50 border border-earth-200 rounded-xl">
              <p className="text-xs font-semibold text-earth-700 mb-1">📅 Next Meeting</p>
              <p className="text-sm font-semibold text-gray-900">{formatShortDate(upcomingMeeting.date)}</p>
              <p className="text-xs text-gray-500">{upcomingMeeting.venue}</p>
            </div>
          )}
        </div>
      </div>

      {/* Alerts & recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts */}
        {overdueLoans.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-terra-600" />
              <h2 className="text-base font-semibold text-gray-900">Overdue Loans</h2>
              <Badge status="overdue" className="ml-auto" />
            </div>
            <div className="space-y-2">
              {overdueLoans.slice(0, 3).map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-3 bg-terra-50 rounded-xl border border-terra-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{loan.memberName}</p>
                    <p className="text-xs text-gray-500">Due {formatShortDate(loan.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-terra-700">{formatCurrency(loan.balance)}</p>
                    <p className="text-xs text-gray-500">balance</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/loans?filter=overdue" className="btn-outline w-full mt-4 text-sm">
              View All Overdue →
            </Link>
          </div>
        )}

        {/* Recent meetings */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Meetings</h2>
          <div className="space-y-3">
            {mockMeetings.slice(0, 4).map((m) => (
              <Link href={`/dashboard/meetings/${m.id}`} key={m.id} className="flex items-center justify-between p-3 bg-sand-50 rounded-xl hover:bg-sand-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{m.sessionNumber}</span>
                    <Badge status={m.status} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatShortDate(m.date)}</p>
                  <p className="text-xs text-gray-500">{m.venue}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-forest-700">{formatCurrency(m.totalContributions)}</p>
                  <p className="text-xs text-gray-500">contributions</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/dashboard/meetings" className="btn-outline w-full mt-4 text-sm">
            View All Meetings →
          </Link>
        </div>
      </div>

      {/* Top savers */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Top Savers This Cycle</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMembers.slice().sort((a, b) => b.totalSaved - a.totalSaved).slice(0, 4).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl">
              <div className="w-10 h-10 bg-earth-200 rounded-full flex items-center justify-center text-sm font-bold text-earth-800">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                <p className="text-xs text-gray-500">Total saved</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-forest-700">{formatCurrency(m.totalSaved)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
