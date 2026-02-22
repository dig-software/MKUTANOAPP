"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Users, Phone, Calendar, AlertTriangle } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);
}

export default function GroupDetailsPage({ params }: { params: { groupId: string } }) {
  // Mock group data
  const groupsData: { [key: string]: any } = {
    g1: {
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
      email: "mary.kipchoge@email.com",
      lastMeeting: "2026-02-25",
      registrationDate: "2024-06-15",
      memberLoans: [
        {
          memberName: "Mary Kipchoge",
          loanAmount: 15000,
          repaidAmount: 12000,
          remainingBalance: 3000,
          status: "on-schedule",
          dueDate: "2026-04-15",
        },
        {
          memberName: "Fatuma Hassan",
          loanAmount: 10000,
          repaidAmount: 0,
          remainingBalance: 10000,
          status: "on-schedule",
          dueDate: "2026-05-01",
        },
        {
          memberName: "Dorah Kipchoge",
          loanAmount: 20000,
          repaidAmount: 20000,
          remainingBalance: 0,
          status: "repaid",
          dueDate: "2026-01-15",
        },
        {
          memberName: "Christine Kiplagat",
          loanAmount: 12000,
          repaidAmount: 0,
          remainingBalance: 12000,
          status: "on-schedule",
          dueDate: "2026-06-01",
        },
      ],
    },
    g2: {
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
      email: "alice.mwangi@email.com",
      lastMeeting: "2026-02-28",
      registrationDate: "2024-03-20",
      memberLoans: [
        {
          memberName: "Alice Mwangi",
          loanAmount: 25000,
          repaidAmount: 25000,
          remainingBalance: 0,
          status: "repaid",
          dueDate: "2026-02-20",
        },
        {
          memberName: "Beatrice Ouma",
          loanAmount: 18000,
          repaidAmount: 15000,
          remainingBalance: 3000,
          status: "on-schedule",
          dueDate: "2026-03-10",
        },
        {
          memberName: "Esther Kipchoge",
          loanAmount: 22000,
          repaidAmount: 18000,
          remainingBalance: 4000,
          status: "overdue",
          dueDate: "2026-04-01",
        },
      ],
    },
    g3: {
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
      email: "christine.kiplagat@email.com",
      lastMeeting: "2026-02-20",
      registrationDate: "2024-09-10",
      memberLoans: [
        {
          memberName: "Christine Kiplagat",
          loanAmount: 12000,
          repaidAmount: 0,
          remainingBalance: 12000,
          status: "on-schedule",
          dueDate: "2026-06-01",
        },
      ],
    },
  };

  const group = groupsData[params.groupId];

  if (!group) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/ngo/groups" className="inline-flex items-center text-sm font-semibold text-forest-600 hover:text-forest-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Groups
        </Link>
        <p className="text-gray-600">Group not found</p>
      </div>
    );
  }

  const repaymentRate = (group.totalRepaid / group.totalFunded) * 100;
  const overdueLoans = group.memberLoans.filter((l: any) => l.status === "overdue");

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
      <Link href="/dashboard/ngo/groups" className="inline-flex items-center text-sm font-semibold text-forest-600 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Groups
      </Link>

      {/* Group Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {group.location}
            </p>
          </div>
          <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${repaymentRate >= 80 ? "bg-forest-100 text-forest-800" : repaymentRate >= 50 ? "bg-earth-100 text-earth-800" : "bg-terra-100 text-terra-800"}`}>
            {Math.round(repaymentRate)}% Repayment Rate
          </span>
        </div>

        {/* Group Details Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-sand-100">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Contact Person</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{group.contactPerson}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {group.phone}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Meeting Frequency</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{group.meetingFrequency}</p>
            <p className="text-xs text-gray-500 mt-1">Last: {group.lastMeeting}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Members</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{group.members}</p>
            <p className="text-xs text-gray-500 mt-1">Active members</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Since</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{group.registrationDate}</p>
            <p className="text-xs text-gray-500 mt-1">Partnership date</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Funded</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(group.totalFunded)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Repaid</p>
          <p className="text-2xl font-bold text-forest-600">{formatCurrency(group.totalRepaid)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
          <p className="text-2xl font-bold text-earth-600">{formatCurrency(group.outstandingBalance)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Active Loans</p>
          <p className="text-2xl font-bold text-terra-600">{group.loansIssued}</p>
        </div>
      </div>

      {/* Alerts */}
      {overdueLoans.length > 0 && (
        <div className="card border-l-4 border-terra-500 bg-terra-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-terra-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-terra-900">Overdue Loans in This Group</h3>
              <p className="text-sm text-terra-800 mt-1">{overdueLoans.length} loan(s) are overdue. Please follow up with the group leadership.</p>
            </div>
          </div>
        </div>
      )}

      {/* Member Loans */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Member Loan Details</h2>
          <p className="text-sm text-gray-500">{group.memberLoans.length} members with loans</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Member Name</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Loan Amount</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Repaid</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Balance</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {group.memberLoans.map((loan: any, idx: number) => (
                <tr key={idx} className="border-b border-sand-50 hover:bg-sand-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{loan.memberName}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(loan.loanAmount)}</td>
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
    </div>
  );
}
