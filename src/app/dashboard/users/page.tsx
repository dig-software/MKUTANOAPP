"use client";
import { Card, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Users, Shield, Lock, AlertCircle, Search, Edit, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const allUsers = [
    {
      id: "u1",
      name: "Grace Wanjiku",
      phone: "+254712345678",
      email: "grace@mkutano.app",
      role: "secretary",
      group: "Kangemi Savings Group",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2026-02-19",
      verified: true,
    },
    {
      id: "u2",
      name: "Mary Achieng",
      phone: "+254711000001",
      email: "mary@example.com",
      role: "member",
      group: "Kangemi Savings Group",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2026-02-18",
      verified: true,
    },
    {
      id: "u3",
      name: "Alice Njeri",
      phone: "+254711000003",
      email: "alice@example.com",
      role: "member",
      group: "Kangemi Savings Group",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2026-02-19",
      verified: true,
    },
    {
      id: "u4",
      name: "Florence Kipchoge",
      phone: "+254712345679",
      email: "florence@mkutano.app",
      role: "secretary",
      group: "Westlands Women Savers",
      status: "active",
      joinDate: "2024-02-10",
      lastLogin: "2026-02-17",
      verified: true,
    },
    {
      id: "u5",
      name: "John Kariuki",
      phone: "+254700000001",
      email: "admin@mkutano.app",
      role: "admin",
      group: "Platform Admin",
      status: "active",
      joinDate: "2023-12-01",
      lastLogin: "2026-02-19",
      verified: true,
    },
    {
      id: "u6",
      name: "Sarah Johnson",
      phone: "+254712345680",
      email: "sarah@ngo.org",
      role: "ngo",
      group: "World Vision Kenya",
      status: "active",
      joinDate: "2024-01-10",
      lastLogin: "2026-02-16",
      verified: true,
    },
    {
      id: "u7",
      name: "Beatrice Otieno",
      phone: "+254711000004",
      email: "beatrice@example.com",
      role: "member",
      group: "Kangemi Savings Group",
      status: "inactive",
      joinDate: "2024-01-15",
      lastLogin: "2026-01-25",
      verified: true,
    },
    {
      id: "u8",
      name: "David Kipkemei",
      phone: "+254712345681",
      email: "david@mkutano.app",
      role: "secretary",
      group: "South B Chama",
      status: "pending",
      joinDate: "2026-02-15",
      lastLogin: null,
      verified: false,
    },
  ];

  const stats = {
    totalUsers: allUsers.length,
    activeMembers: allUsers.filter(u => u.role === "member" && u.status === "active").length,
    secretaries: allUsers.filter(u => u.role === "secretary").length,
    admins: allUsers.filter(u => u.role === "admin").length,
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-terra-100 text-terra-700";
      case "secretary":
        return "bg-forest-100 text-forest-700";
      case "ngo":
        return "bg-earth-100 text-earth-700";
      case "member":
        return "bg-sand-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all platform users and permissions</p>
        </div>
        <button className="btn-primary">
          + Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={<Users className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
        />
        <StatCard
          title="Active Members"
          value={stats.activeMembers.toString()}
          icon={<Users className="w-5 h-5 text-earth-600" />}
          iconBg="bg-earth-100"
        />
        <StatCard
          title="Secretaries"
          value={stats.secretaries.toString()}
          icon={<Shield className="w-5 h-5 text-forest-600" />}
          iconBg="bg-forest-100"
        />
        <StatCard
          title="Admins"
          value={stats.admins.toString()}
          icon={<Lock className="w-5 h-5 text-terra-600" />}
          iconBg="bg-terra-100"
        />
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex gap-3">
          <Input
            placeholder="Search by name, phone, or email..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="px-4 py-2 border border-sand-200 rounded-lg text-sm bg-white">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Secretary</option>
            <option>Member</option>
            <option>NGO</option>
          </select>
          <select className="px-4 py-2 border border-sand-200 rounded-lg text-sm bg-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="table-header">User</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Role</th>
                <th className="table-header">Group</th>
                <th className="table-header">Status</th>
                <th className="table-header">Last Login</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-sand-50 hover:bg-sand-50">
                  <td className="table-cell">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </div>
                  </td>
                  <td className="table-cell text-sm text-gray-600">{user.email}</td>
                  <td className="table-cell">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="table-cell text-sm text-gray-600">{user.group}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <Badge status={user.status === "active" ? "confirmed" : user.status === "pending" ? "pending" : "overdue"} />
                      {user.verified && <CheckCircle className="w-4 h-4 text-forest-500" />}
                    </div>
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                  </td>
                  <td className="table-cell text-center">
                    <button className="p-1.5 hover:bg-gray-100 rounded inline-block">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    {user.role !== "admin" && (
                      <button className="p-1.5 hover:bg-terra-100 rounded inline-block">
                        <Trash2 className="w-4 h-4 text-terra-600" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Verification */}
      {allUsers.filter(u => u.status === "pending").length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-earth-600" />
            Pending Verification
          </h2>
          <div className="space-y-3">
            {allUsers.filter(u => u.status === "pending").map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-earth-50 border border-earth-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.phone} • {user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Role: {user.role} • Group: {user.group}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-semibold text-forest-600 bg-forest-100 rounded-lg hover:bg-forest-200">
                    Approve
                  </button>
                  <button className="px-4 py-2 text-sm font-semibold text-terra-600 bg-terra-100 rounded-lg hover:bg-terra-200">
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
