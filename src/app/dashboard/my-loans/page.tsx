"use client";
import { Card, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockMembers, mockLoans, mockRepayments } from "@/lib/mockData";
import { formatCurrency, formatDate, formatShortDate } from "@/lib/utils";
import { TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useCurrentUser } from "@/lib/UserContext";

export default function MyLoansPage() {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading || !currentUser) return null;

  const member = mockMembers.find(m => m.id === currentUser.memberId) || mockMembers[0];
  const myLoans = mockLoans.filter(l => l.memberId === member.id);
  const activeLoans = myLoans.filter(l => l.status === "active");
  const myRepayments = mockRepayments.filter(r => r.memberId === member.id);

  const totalBorrowed = myLoans.reduce((sum, l) => sum + l.amount, 0);
  const totalRepaid = myRepayments.reduce((sum, r) => sum + r.total, 0);
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">My Loans</h1>
        <p className="text-gray-500 mt-1">Track your borrowing and repayment history</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Borrowed"
          value={formatCurrency(totalBorrowed)}
          icon={<TrendingUp className="w-5 h-5 text-earth-600" />}
          iconBg="bg-earth-100"
        />
        <StatCard
          title="Total Repaid"
          value={formatCurrency(totalRepaid)}
          icon={<CheckCircle className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(totalOutstanding)}
          icon={<Clock className="w-5 h-5 text-terra-600" />}
          iconBg="bg-terra-100"
        />
      </div>

      {/* Active Loans */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Loans</h2>
        {activeLoans.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No active loans</p>
        ) : (
          <div className="space-y-4">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="border border-sand-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{loan.purpose}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Issued {formatShortDate(loan.issuedAt)} • Due {formatShortDate(loan.dueDate)}
                    </p>
                  </div>
                  <Badge status={loan.status} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Principal</p>
                    <p className="font-semibold">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Interest ({loan.interestRate}%)</p>
                    <p className="font-semibold">{formatCurrency((loan.amount * loan.interestRate) / 100)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Balance Due</p>
                    <p className="font-bold text-terra-700">{formatCurrency(loan.balance)}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Repayment Progress</span>
                    <span className="font-semibold">{Math.round((loan.totalRepaid / (loan.amount + (loan.amount * loan.interestRate / 100))) * 100)}%</span>
                  </div>
                  <progress
                    className="progress-bar"
                    value={(loan.totalRepaid / (loan.amount + (loan.amount * loan.interestRate / 100))) * 100}
                    max={100}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Loan History */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Loans</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="table-header">Purpose</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Issued</th>
                <th className="table-header">Due Date</th>
                <th className="table-header">Repaid</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {myLoans.map((loan) => (
                <tr key={loan.id}>
                  <td className="table-cell">{loan.purpose}</td>
                  <td className="table-cell font-semibold">{formatCurrency(loan.amount)}</td>
                  <td className="table-cell">{formatShortDate(loan.issuedAt)}</td>
                  <td className="table-cell">{formatShortDate(loan.dueDate)}</td>
                  <td className="table-cell text-forest-700">{formatCurrency(loan.totalRepaid)}</td>
                  <td className="table-cell">
                    <Badge status={loan.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Repayment History */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Repayment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="table-header">Date</th>
                <th className="table-header">Loan Purpose</th>
                <th className="table-header">Principal</th>
                <th className="table-header">Interest</th>
                <th className="table-header">Total</th>
              </tr>
            </thead>
            <tbody>
              {myRepayments.map((r) => {
                const loan = myLoans.find(l => l.id === r.loanId);
                return (
                  <tr key={r.id}>
                    <td className="table-cell">{formatDate(r.recordedAt)}</td>
                    <td className="table-cell">{loan?.purpose ?? "—"}</td>
                    <td className="table-cell">{formatCurrency(r.principal)}</td>
                    <td className="table-cell">{formatCurrency(r.interest)}</td>
                    <td className="table-cell font-bold text-forest-700">{formatCurrency(r.total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
