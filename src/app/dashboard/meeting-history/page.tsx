"use client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockMeetings, mockContributions, mockRepayments, mockMembers } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useCurrentUser } from "@/lib/UserContext";

export default function MeetingHistoryPage() {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading || !currentUser) return null;

  const member = mockMembers.find(m => m.id === currentUser.memberId) || mockMembers[0];
  const meetings = mockMeetings.filter(m => m.status === "closed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Meeting History</h1>
        <p className="text-gray-500 mt-1">Past meetings you attended</p>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => {
          const myContribution = mockContributions.find(c => c.meetingId === meeting.id && c.memberId === member.id);
          const myRepayment = mockRepayments.find(r => r.meetingId === meeting.id && r.memberId === member.id);

          return (
            <Card key={meeting.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Session #{meeting.sessionNumber}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(meeting.date)} • {meeting.venue}</p>
                </div>
                <Badge status="closed" />
              </div>

              {myContribution || myRepayment ? (
                <div className="grid sm:grid-cols-2 gap-4 p-3 bg-sand-50 rounded-xl">
                  {myContribution && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">My Contribution</p>
                      <p className="text-lg font-bold text-forest-700">{formatCurrency(myContribution.amount)}</p>
                      <p className="text-xs text-gray-500">Contribution recorded</p>
                    </div>
                  )}
                  {myRepayment && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">My Repayment</p>
                      <p className="text-lg font-bold text-earth-700">{formatCurrency(myRepayment.total)}</p>
                      <p className="text-xs text-gray-500">Principal: {formatCurrency(myRepayment.principal)} + Interest: {formatCurrency(myRepayment.interest)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic py-2">No activity this meeting</p>
              )}

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sand-100 text-xs text-gray-500">
                <span>{meeting.attendanceCount} members present</span>
                <span>•</span>
                <span>Total saved: {formatCurrency(meeting.totalContributions)}</span>
                <span>•</span>
                <span>Loans issued: {formatCurrency(meeting.totalLoansIssued)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
