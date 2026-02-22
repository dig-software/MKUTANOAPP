"use client";

import Link from "next/link";
import { ArrowLeft, Filter, Download, DollarSign, AlertTriangle } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);
}

export default function NGOLoansPage() {
  // Mock loan portfolio
  const loans = [
    {
      id: "L001",
      memberName: "Mary Kipchoge",
      group: "Kangemi Savings Group",
      amount: 15000,
      disbursedDate: "2025-10-15",
      dueDate: "2026-04-15",
      repaidAmount: 12000,
      status: "on-schedule",
      interestRate: 10,
      remainingBalance: 3000,
    },
    {
      id: "L002",
      memberName: "Fatuma Hassan",
      group: "Kangemi Savings Group",
      amount: 10000,
      disbursedDate: "2025-11-01",
      dueDate: "2026-05-01",
      repaidAmount: 0,
      status: "on-schedule",
      interestRate: 10,
      remainingBalance: 10000,
    },
    {
      id: "L003",
      memberName: "Alice Mwangi",
      group: "Westlands Women Savers",
      amount: 25000,
      disbursedDate: "2025-08-20",
      dueDate: "2026-02-20",
      repaidAmount: 25000,
      status: "repaid",
      interestRate: 12,
      remainingBalance: 0,
    },
    {
      id: "L004",
      memberName: "Beatrice Ouma",
      group: "Westlands Women Savers",
      amount: 18000,
      disbursedDate: "2025-09-10",
      dueDate: "2026-03-10",
      repaidAmount: 15000,
      status: "on-schedule",
      interestRate: 12,
      remainingBalance: 3000,
    },
    {
      id: "L005",
      memberName: "Christine Kiplagat",
      group: "South B Chama",
      amount: 12000,
      disbursedDate: "2025-12-01",
      dueDate: "2026-06-01",
      repaidAmount: 0,
      status: "on-schedule",
      interestRate: 10,
      remainingBalance: 12000,
    },
    {
      id: "L006",
      memberName: "Dorah Kipchoge",
      group: "Kangemi Savings Group",
      amount: 20000,
      disbursedDate: "2025-07-15",
      dueDate: "2026-01-15",
      repaidAmount: 20000,
      status: "repaid",
      interestRate: 10,
      remainingBalance: 0,
    },
    {
      id: "L007",
      memberName: "Esther Kipchoge",
      group: "Westlands Women Savers",
      amount: 22000,
      disbursedDate: "2025-10-01",
      dueDate: "2026-04-01",
      repaidAmount: 18000,
      status: "overdue",
      interestRate: 12,
      remainingBalance: 4000,
    },
  ];

  const totalDisbursed = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalRepaid = loans.reduce((sum, l) => sum + l.repaidAmount, 0);
  const totalOutstanding = loans.reduce((sum, l) => sum + l.remainingBalance, 0);
  const activeLoans = loans.filter((l) => l.status !== "repaid").length;
  const repaidLoans = loans.filter((l) => l.status === "repaid").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "repaid":
        return "bg-forest-100 text-forest-800";
      case "on-schedule":
        return "bg-earth-100 text-earth-800";
      case "overdue":
        return "bg-terra-100 text-terra-800";
      default:
        return "bg-sand-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-forest-600 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Loan Portfolio</h1>
          <p className="text-gray-500 mt-1">All loans across funded groups</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-sand-100 text-gray-700 rounded-lg font-semibold hover:bg-sand-200">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Disbursed</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDisbursed)}</p>
          <p className="text-xs text-gray-500 mt-2">{loans.length} loans</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Amount Repaid</p>
          <p className="text-2xl font-bold text-forest-600">{formatCurrency(totalRepaid)}</p>
          <p className="text-xs text-gray-500 mt-2">{repaidLoans} loans cleared</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
          <p className="text-2xl font-bold text-earth-600">{formatCurrency(totalOutstanding)}</p>
          <p className="text-xs text-gray-500 mt-2">{activeLoans} active loans</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Repayment Rate</p>
          <p className="text-2xl font-bold text-forest-600">{Math.round((totalRepaid / totalDisbursed) * 100)}%</p>
          <p className="text-xs text-gray-500 mt-2">Overall performance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 px-3 py-2 bg-sand-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-sand-200">
          <Filter className="w-4 h-4" />
          All Status
        </button>
        <button className="inline-flex items-center gap-2 px-3 py-2 bg-sand-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-sand-200">
          All Groups
        </button>
        <button className="inline-flex items-center gap-2 px-3 py-2 bg-sand-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-sand-200">
          Date Range
        </button>
      </div>

      {/* Loan Portfolio Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Member</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Group</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Amount</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Repaid</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Balance</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b border-sand-50 hover:bg-sand-50">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/ngo/loans/${loan.id}`} className="font-semibold text-gray-900 hover:text-forest-600">
                      {loan.memberName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{loan.group}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(loan.amount)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-forest-600">{formatCurrency(loan.repaidAmount)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(loan.remainingBalance)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${getStatusColor(loan.status)}`}>
                      {loan.status === "repaid" && "Repaid"}
                      {loan.status === "on-schedule" && "On Schedule"}
                      {loan.status === "overdue" && "Overdue"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{loan.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      {loans.some((l) => l.status === "overdue") && (
        <div className="card border-l-4 border-terra-500 bg-terra-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-terra-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-terra-900">Overdue Loans Alert</h3>
              <p className="text-sm text-terra-800 mt-1">
                {loans.filter((l) => l.status === "overdue").length} loan(s) are overdue. Esther Kipchoge's KES 4,000 outstanding balance is overdue. Please follow up.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
