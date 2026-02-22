"use client";
import { Card, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockMembers, mockLoans, mockContributions, mockMeetings } from "@/lib/mockData";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { Wallet, TrendingUp, PiggyBank, Calendar, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCurrentUser } from "@/lib/UserContext";

export default function MemberWalletPage() {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading || !currentUser) return null;

  // Get the logged-in member's data
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
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" />
          Download Statement
        </Button>
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

      {/* Active Loans */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Active Loans</h2>
        {memberLoans.filter(l => l.status === "active").length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No active loans</p>
        ) : (
          <div className="space-y-3">
            {memberLoans.filter(l => l.status === "active").map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 bg-sand-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{loan.purpose}</p>
                  <p className="text-xs text-gray-500">Issued {formatShortDate(loan.issuedAt)} • Due {formatShortDate(loan.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(loan.balance)} balance</p>
                  <p className="text-xs text-gray-500">of {formatCurrency(loan.amount + (loan.amount * loan.interestRate / 100))}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Contributions */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Contributions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="table-header">Meeting</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentContributions.map((c) => {
                const meeting = mockMeetings.find(m => m.id === c.meetingId);
                return (
                  <tr key={c.id}>
                    <td className="table-cell">Session #{meeting?.sessionNumber}</td>
                    <td className="table-cell font-semibold">{formatCurrency(c.amount)}</td>
                    <td className="table-cell capitalize">{c.type.replace("_", " ")}</td>
                    <td className="table-cell">
                      <Badge status={c.confirmed ? "confirmed" : "pending"} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Contribution breakdown */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Savings Progress This Cycle</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Target (KES 20,000)</span>
              <span className="font-semibold">{formatCurrency(20000)}</span>
            </div>
            <progress className="progress-bar progress-bar-lg" value={(member.totalSaved / 20000) * 100} max={100} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current savings</span>
              <span className="font-bold text-forest-700">{formatCurrency(member.totalSaved)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Member Since</h3>
          <p className="text-3xl font-display font-bold text-gray-900">{formatShortDate(member.joinedAt)}</p>
          <p className="text-sm text-gray-500 mt-2">
            You&apos;ve been an active member for {Math.floor((Date.now() - new Date(member.joinedAt).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
          </p>
        </Card>
      </div>
    </div>
  );
}
