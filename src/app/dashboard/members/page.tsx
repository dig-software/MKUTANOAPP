"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/UserContext";
import { Badge } from "@/components/ui/Badge";
import { getInitials, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Plus,
  Search,
  Download,
  Users,
  Trash2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  getMembersByGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  getGroupById,
} from "@/lib/accountManager";
import { mockMembers } from "@/lib/mockData";
import { Group, Member } from "@/lib/types";

export default function MembersPage() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nationalId: "",
  });

  useEffect(() => {
    // Load real data if logged in with actual group
    if (currentUser?.groupId) {
      const groupData = getGroupById(currentUser.groupId);
      if (groupData) {
        setGroup(groupData);
        const membersList = getMembersByGroup(currentUser.groupId);
        if (membersList.length > 0) {
          setMembers(membersList);
        }
      }
    }
  }, [currentUser]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.phone) {
      setError("Name and phone number are required");
      return;
    }

    if (!group) {
      setError("Group not found");
      return;
    }

    setLoading(true);

    try {
      const result = addMemberToGroup(group.id, {
        name: formData.name,
        phone: formData.phone,
        nationalId: formData.nationalId || undefined,
      });

      setMembers([...members, result.member]);
      setSuccess(`✓ ${formData.name} has been added to the group!`);
      setFormData({ name: "", phone: "", nationalId: "" });
      setShowAddForm(false);

      const updatedGroup = getGroupById(group.id);
      if (updatedGroup) {
        setGroup(updatedGroup);
      }
    } catch (err: any) {
      setError(err.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!group || !confirm(`Remove ${memberName} from the group?`)) {
      return;
    }

    setLoading(true);
    try {
      const success = removeMemberFromGroup(group.id, memberId);
      if (success) {
        setMembers(members.filter((m) => m.id !== memberId));
        setSuccess(`${memberName} has been removed from the group`);

        const updatedGroup = getGroupById(group.id);
        if (updatedGroup) {
          setGroup(updatedGroup);
        }
      }
    } catch (err) {
      setError("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const copyJoinCode = () => {
    if (group) {
      navigator.clipboard.writeText(group.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
  );

  const activeMembers = members.filter((m) => m.status === "active").length;
  const totalShares = members.reduce((s, m) => s + m.sharesHeld, 0);
  const totalSaved = members.reduce((s, m) => s + m.totalSaved, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Members
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {members.length} total members in your group
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline">
            <Download className="w-4 h-4" />
            Export
          </button>
          {currentUser?.role === "secretary" && (
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          )}
        </div>
      </div>

      {/* Group Join Code (Secretary View) */}
      {currentUser?.role === "secretary" && group && (
        <Card className="bg-emerald-50 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Group Join Code</h3>
              <p className="text-sm text-gray-600 mt-1">
                Share this code with members so they can join
              </p>
              <p className="text-2xl font-bold text-emerald-600 mt-2 font-mono tracking-widest">
                {group.joinCode}
              </p>
            </div>
            <button
              onClick={copyJoinCode}
              className="p-3 rounded-lg hover:bg-emerald-100 transition-colors"
              title="Copy join code"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5 text-emerald-600" />
              )}
            </button>
          </div>
        </Card>
      )}

      {/* Error & Success Messages */}
      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Add Member Form */}
      {showAddForm && currentUser?.role === "secretary" && (
        <Card className="border-emerald-200 bg-emerald-50">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Member</h3>
          <form onSubmit={handleAddMember} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Jane Mwangi"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+254 7XX XXX XXX"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Input
              label="National ID (Optional)"
              placeholder="e.g. 12345678"
              value={formData.nationalId}
              onChange={(e) =>
                setFormData({ ...formData, nationalId: e.target.value })
              }
            />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Add Member
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <div className="card">
        <Input
          placeholder="Search by name or phone..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Members grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((m) => (
          <Link
            key={m.id}
            href={`/dashboard/members/${m.id}`}
            className="card-hover flex flex-col relative group"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 bg-earth-200 rounded-full flex items-center justify-center text-base font-bold text-earth-800 shrink-0">
                {getInitials(m.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {m.name}
                  </h3>
                  <Badge status={m.status} />
                </div>
                <p className="text-xs text-gray-500">{m.phone}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {m.sharesHeld} shares held
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sand-100 text-center">
              <div>
                <p className="text-xs text-gray-500">Total Saved</p>
                <p className="text-sm font-bold text-forest-700">
                  {formatCurrency(m.totalSaved)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(m.walletBalance)}
                </p>
              </div>
            </div>

            {m.totalLoaned > 0 && (
              <div className="mt-3 p-2 bg-earth-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Outstanding Loan</p>
                <p className="text-xs font-bold text-earth-700">
                  {formatCurrency(m.totalLoaned - m.totalRepaid)}
                </p>
              </div>
            )}

            {currentUser?.role === "secretary" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveMember(m.id, m.name);
                }}
                className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Remove member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </Link>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No members found</p>
        </Card>
      )}

      {/* Summary */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Active Members", value: activeMembers },
          { label: "Total Shares", value: totalShares },
          { label: "Total Savings", value: formatCurrency(totalSaved) },
          {
            label: "Avg per Member",
            value: formatCurrency(
              members.length > 0 ? Math.round(totalSaved / members.length) : 0
            ),
          },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl font-display font-bold text-gray-900">
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
