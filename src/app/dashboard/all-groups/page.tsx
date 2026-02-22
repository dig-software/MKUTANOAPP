"use client";
import { Card, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, TrendingUp, DollarSign, Calendar, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function AllGroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = [
    {
      id: "g1",
      name: "Kangemi Savings Group",
      secretary: "Grace Wanjiku",
      members: 10,
      joinDate: "2024-01-15",
      totalSavings: 125000,
      activeLoanCount: 5,
      loanPortfolio: 45000,
      status: "active",
      location: "Kangemi, Nairobi",
      meetingFrequency: "Monthly",
    },
    {
      id: "g2",
      name: "Westlands Women Savers",
      secretary: "Florence Kipchoge",
      members: 12,
      joinDate: "2024-02-10",
      totalSavings: 185000,
      activeLoanCount: 7,
      loanPortfolio: 64000,
      status: "active",
      location: "Westlands, Nairobi",
      meetingFrequency: "Monthly",
    },
    {
      id: "g3",
      name: "South B Chama",
      secretary: "Lucy Kimani",
      members: 8,
      joinDate: "2024-03-05",
      totalSavings: 92000,
      activeLoanCount: 3,
      loanPortfolio: 28000,
      status: "active",
      location: "South B, Nairobi",
      meetingFrequency: "Biweekly",
    },
    {
      id: "g4",
      name: "Nairobi CBD Investors",
      secretary: "Hilda Mwangi",
      members: 15,
      joinDate: "2024-01-20",
      totalSavings: 312000,
      activeLoanCount: 11,
      loanPortfolio: 125000,
      status: "active",
      location: "CBD, Nairobi",
      meetingFrequency: "Monthly",
    },
    {
      id: "g5",
      name: "Kibra Community Savers",
      secretary: "Jane Ochieng",
      members: 9,
      joinDate: "2023-12-01",
      totalSavings: 78000,
      activeLoanCount: 2,
      loanPortfolio: 18000,
      status: "pending_verification",
      location: "Kibra, Nairobi",
      meetingFrequency: "Monthly",
    },
  ];

  const stats = {
    totalGroups: groups.length,
    totalMembers: groups.reduce((sum, g) => sum + g.members, 0),
    totalSavings: groups.reduce((sum, g) => sum + g.totalSavings, 0),
    activeLoans: groups.reduce((sum, g) => sum + g.activeLoanCount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">All Groups</h1>
          <p className="text-gray-500 mt-1">Manage all partner groups and their members</p>
        </div>
        <button className="btn-primary">
          + Verify New Group
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Groups"
          value={groups.filter(g => g.status === "active").length.toString()}
          icon={<Users className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
        />
        <StatCard
          title="Total Members"
          value={stats.totalMembers.toString()}
          icon={<Users className="w-5 h-5 text-earth-600" />}
          iconBg="bg-earth-100"
        />
        <StatCard
          title="Platform Savings"
          value={formatCurrency(stats.totalSavings)}
          icon={<DollarSign className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
        />
        <StatCard
          title="Active Loans"
          value={stats.activeLoans.toString()}
          icon={<TrendingUp className="w-5 h-5 text-terra-600" />}
          iconBg="bg-terra-100"
        />
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.id} hover className="overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  <Badge status={group.status === "active" ? "confirmed" : "pending"} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Secretary</p>
                    <p className="font-semibold text-gray-900">{group.secretary}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Members</p>
                    <p className="font-semibold text-gray-900">{group.members} people</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Location</p>
                    <p className="font-semibold text-gray-900">{group.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Joined</p>
                    <p className="font-semibold text-gray-900">{formatDate(group.joinDate)}</p>
                  </div>
                </div>

                {/* Financial summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-sand-50 rounded-lg text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Total Savings</p>
                    <p className="font-bold text-forest-700">{formatCurrency(group.totalSavings)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Loans Out</p>
                    <p className="font-bold text-earth-700">{formatCurrency(group.loanPortfolio)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Active Loans</p>
                    <p className="font-bold text-terra-700">{group.activeLoanCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Meeting Frequency</p>
                    <p className="font-bold text-gray-900">{group.meetingFrequency}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <button aria-label={`View group ${group.name}`} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button aria-label={`Edit group ${group.name}`} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button aria-label={`Delete group ${group.name}`} className="p-2 hover:bg-terra-100 rounded-lg">
                  <Trash2 className="w-4 h-4 text-terra-600" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pending Verification */}
      {groups.filter(g => g.status !== "active").length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Verification</h2>
          <div className="space-y-3">
            {groups.filter(g => g.status !== "active").map((group) => (
              <div key={group.id} className="flex items-center justify-between p-3 bg-earth-50 border border-earth-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{group.name}</p>
                  <p className="text-sm text-gray-500">Secretary: {group.secretary} • {group.members} members</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm font-semibold text-forest-600 bg-forest-100 rounded-lg hover:bg-forest-200">
                    Approve
                  </button>
                  <button className="px-3 py-1.5 text-sm font-semibold text-terra-600 bg-terra-100 rounded-lg hover:bg-terra-200">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
