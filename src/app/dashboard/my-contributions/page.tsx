"use client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockMembers, mockContributions, mockMeetings } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCurrentUser } from "@/lib/UserContext";

export default function MyContributionsPage() {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading || !currentUser) return null;

  const member = mockMembers.find(m => m.id === currentUser.memberId) || mockMembers[0];
  const myContributions = mockContributions.filter(c => c.memberId === member.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">My Contributions</h1>
        <p className="text-gray-500 mt-1">Complete history of your contributions</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="table-header">Date</th>
                <th className="table-header">Meeting</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {myContributions.map((c) => {
                const meeting = mockMeetings.find(m => m.id === c.meetingId);
                return (
                  <tr key={c.id}>
                    <td className="table-cell">{formatDate(c.recordedAt)}</td>
                    <td className="table-cell">Session #{meeting?.sessionNumber}</td>
                    <td className="table-cell font-bold text-forest-700">{formatCurrency(c.amount)}</td>
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
    </div>
  );
}
