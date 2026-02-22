import {
  Member, Meeting, Contribution, Loan, Repayment,
  AuditLog, Notification, DashboardStats, ChartDataPoint, Group, User
} from "./types";

export const mockUser: User = {
  id: "u1",
  name: "Grace Wanjiku",
  phone: "+254712345678",
  email: "grace@maendeleo.ke",
  role: "secretary",
  groupId: "g1",
  avatarInitials: "GW",
  joinedAt: "2024-01-15",
  isActive: true,
};

// Helper to get user by phone (for demo login)
export function getUserByPhone(phone: string): User | null {
  // Secretary
  if (phone === "+254712345678") return mockUser;
  
  // Admin
  if (phone === "+254700000001") return {
    id: "u_admin",
    name: "Admin User",
    phone: "+254700000001",
    email: "admin@mkutano.app",
    role: "admin",
    avatarInitials: "AU",
    joinedAt: "2024-01-01",
    isActive: true,
  };

  // NGO/MFI
  if (phone === "+254700000002") return {
    id: "u_ngo",
    name: "Maendeleo NGO",
    phone: "+254700000002",
    email: "impact@maendeleo.ngo",
    role: "ngo",
    avatarInitials: "MN",
    joinedAt: "2024-01-01",
    isActive: true,
  };

  // Members - map from mockMembers
  const member = mockMembers.find(m => m.phone === phone);
  if (member) {
    return {
      id: member.userId,
      name: member.name,
      phone: member.phone,
      role: "member",
      groupId: member.groupId,
      memberId: member.id,
      avatarInitials: member.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      joinedAt: member.joinedAt,
      isActive: member.status === "active",
    };
  }

  return null;
}

// Get member data by phone
export function getMemberByPhone(phone: string): Member | null {
  return mockMembers.find(m => m.phone === phone) ?? null;
}

export const mockGroup: Group = {
  id: "g1",
  name: "Maendeleo wa Wanawake",
  village: "Kangemi",
  district: "Westlands",
  country: "Kenya",
  secretaryId: "u1",
  secretaryName: "Grace Wanjiku",
  secretaryPhone: "+254712345678",
  memberCount: 18,
  createdAt: "2024-01-15",
  cycleStartDate: "2025-01-01",
  cycleEndDate: "2025-12-31",
  shareValue: 100,
  currency: "KES",
  joinCode: "MAE-X9K2",
  isActive: true,
};

export const mockMembers: Member[] = [
  { id: "m1", groupId: "g1", userId: "u2", name: "Mary Achieng", phone: "+254711000001", nationalId: "12345678", sharesHeld: 5, totalSaved: 8500, totalLoaned: 5000, totalRepaid: 5750, walletBalance: 8500, joinedAt: "2024-01-15", status: "active" },
  { id: "m2", groupId: "g1", userId: "u3", name: "Fatuma Hassan", phone: "+254711000002", nationalId: "23456789", sharesHeld: 3, totalSaved: 6200, totalLoaned: 3000, totalRepaid: 3000, walletBalance: 6200, joinedAt: "2024-01-15", status: "active" },
  { id: "m3", groupId: "g1", userId: "u4", name: "Alice Njeri", phone: "+254711000003", nationalId: "34567890", sharesHeld: 7, totalSaved: 12100, totalLoaned: 8000, totalRepaid: 9200, walletBalance: 12100, joinedAt: "2024-01-15", status: "active" },
  { id: "m4", groupId: "g1", userId: "u5", name: "Beatrice Otieno", phone: "+254711000004", nationalId: "45678901", sharesHeld: 2, totalSaved: 4300, totalLoaned: 2000, totalRepaid: 2300, walletBalance: 4300, joinedAt: "2024-02-01", status: "active" },
  { id: "m5", groupId: "g1", userId: "u6", name: "Christine Mwangi", phone: "+254711000005", nationalId: "56789012", sharesHeld: 4, totalSaved: 7800, totalLoaned: 4000, totalRepaid: 4400, walletBalance: 7800, joinedAt: "2024-02-01", status: "active" },
  { id: "m6", groupId: "g1", userId: "u7", name: "Dorah Kamau", phone: "+254711000006", nationalId: "67890123", sharesHeld: 6, totalSaved: 10200, totalLoaned: 6000, totalRepaid: 6600, walletBalance: 10200, joinedAt: "2024-01-15", status: "active" },
  { id: "m7", groupId: "g1", userId: "u8", name: "Esther Wambui", phone: "+254711000007", nationalId: "78901234", sharesHeld: 2, totalSaved: 3900, totalLoaned: 0, totalRepaid: 0, walletBalance: 3900, joinedAt: "2024-03-01", status: "active" },
  { id: "m8", groupId: "g1", userId: "u9", name: "Florence Adhiambo", phone: "+254711000008", nationalId: "89012345", sharesHeld: 5, totalSaved: 9100, totalLoaned: 5000, totalRepaid: 5500, walletBalance: 9100, joinedAt: "2024-01-15", status: "active" },
  { id: "m9", groupId: "g1", userId: "u10", name: "Gladys Mutua", phone: "+254711000009", nationalId: "90123456", sharesHeld: 3, totalSaved: 5600, totalLoaned: 3000, totalRepaid: 2100, walletBalance: 5600, joinedAt: "2024-01-15", status: "active" },
  { id: "m10", groupId: "g1", userId: "u11", name: "Hannah Chebet", phone: "+254711000010", nationalId: "01234567", sharesHeld: 1, totalSaved: 2100, totalLoaned: 0, totalRepaid: 0, walletBalance: 2100, joinedAt: "2024-04-01", status: "inactive" },
];

export const mockMeetings: Meeting[] = [
  { id: "mt1", groupId: "g1", sessionNumber: 24, date: "2026-02-15", venue: "Kangemi Community Hall", facilitatorId: "u1", status: "closed", totalContributions: 18500, totalLoansIssued: 12000, totalRepayments: 9750, attendanceCount: 17, createdAt: "2026-02-15", closedAt: "2026-02-15", syncStatus: "synced" },
  { id: "mt2", groupId: "g1", sessionNumber: 25, date: "2026-03-01", venue: "Kangemi Community Hall", facilitatorId: "u1", status: "open", totalContributions: 14200, totalLoansIssued: 8000, totalRepayments: 5500, attendanceCount: 16, createdAt: "2026-03-01", syncStatus: "synced" },
  { id: "mt3", groupId: "g1", sessionNumber: 23, date: "2026-01-18", venue: "Mary's Home", facilitatorId: "u1", status: "closed", totalContributions: 17800, totalLoansIssued: 10000, totalRepayments: 8200, attendanceCount: 18, createdAt: "2026-01-18", closedAt: "2026-01-18", syncStatus: "synced" },
  { id: "mt4", groupId: "g1", sessionNumber: 22, date: "2025-12-14", venue: "Kangemi Community Hall", facilitatorId: "u1", status: "closed", totalContributions: 19200, totalLoansIssued: 15000, totalRepayments: 11000, attendanceCount: 17, createdAt: "2025-12-14", closedAt: "2025-12-14", syncStatus: "synced" },
];

export const mockContributions: Contribution[] = [
  { id: "c1", meetingId: "mt2", groupId: "g1", memberId: "m1", memberName: "Mary Achieng", shares: 5, amount: 500, type: "share", recordedAt: "2026-03-01T10:05:00", recordedBy: "u1", confirmed: true },
  { id: "c2", meetingId: "mt2", groupId: "g1", memberId: "m2", memberName: "Fatuma Hassan", shares: 3, amount: 300, type: "share", recordedAt: "2026-03-01T10:07:00", recordedBy: "u1", confirmed: true },
  { id: "c3", meetingId: "mt2", groupId: "g1", memberId: "m3", memberName: "Alice Njeri", shares: 7, amount: 700, type: "share", recordedAt: "2026-03-01T10:09:00", recordedBy: "u1", confirmed: true },
  { id: "c4", meetingId: "mt2", groupId: "g1", memberId: "m4", memberName: "Beatrice Otieno", shares: 2, amount: 200, type: "share", recordedAt: "2026-03-01T10:11:00", recordedBy: "u1", confirmed: true },
  { id: "c5", meetingId: "mt2", groupId: "g1", memberId: "m5", memberName: "Christine Mwangi", shares: 4, amount: 400, type: "share", recordedAt: "2026-03-01T10:13:00", recordedBy: "u1", confirmed: false },
];

export const mockLoans: Loan[] = [
  { id: "l1", meetingId: "mt1", groupId: "g1", memberId: "m1", memberName: "Mary Achieng", amount: 5000, interestRate: 10, purpose: "Business capital", issuedAt: "2026-02-15", dueDate: "2026-05-15", status: "active", totalRepaid: 1750, balance: 3250, issuedBy: "u1" },
  { id: "l2", meetingId: "mt1", groupId: "g1", memberId: "m3", memberName: "Alice Njeri", amount: 8000, interestRate: 10, purpose: "School fees", issuedAt: "2026-02-15", dueDate: "2026-05-15", status: "active", totalRepaid: 4600, balance: 3400, issuedBy: "u1" },
  { id: "l3", meetingId: "mt2", groupId: "g1", memberId: "m6", memberName: "Dorah Kamau", amount: 3000, interestRate: 10, purpose: "Medical emergency", issuedAt: "2026-03-01", dueDate: "2026-06-01", status: "active", totalRepaid: 0, balance: 3000, issuedBy: "u1" },
  { id: "l4", meetingId: "mt3", groupId: "g1", memberId: "m9", memberName: "Gladys Mutua", amount: 3000, interestRate: 10, purpose: "Farm inputs", issuedAt: "2026-01-18", dueDate: "2026-04-18", status: "overdue", totalRepaid: 2100, balance: 900, issuedBy: "u1" },
  { id: "l5", meetingId: "mt3", groupId: "g1", memberId: "m2", memberName: "Fatuma Hassan", amount: 3000, interestRate: 10, purpose: "Stock purchase", issuedAt: "2026-01-18", dueDate: "2026-04-18", status: "repaid", totalRepaid: 3300, balance: 0, issuedBy: "u1" },
];

export const mockRepayments: Repayment[] = [
  { id: "r1", loanId: "l1", meetingId: "mt2", groupId: "g1", memberId: "m1", memberName: "Mary Achieng", principal: 1500, interest: 250, total: 1750, recordedAt: "2026-03-01T11:00:00", recordedBy: "u1" },
  { id: "r2", loanId: "l2", meetingId: "mt2", groupId: "g1", memberId: "m3", memberName: "Alice Njeri", principal: 2000, interest: 400, total: 2400, recordedAt: "2026-03-01T11:05:00", recordedBy: "u1" },
  { id: "r3", loanId: "l5", meetingId: "mt2", groupId: "g1", memberId: "m2", memberName: "Fatuma Hassan", principal: 3000, interest: 300, total: 3300, recordedAt: "2026-03-01T11:10:00", recordedBy: "u1" },
];

export const mockAuditLogs: AuditLog[] = [
  { id: "a1", groupId: "g1", actorId: "u1", actorName: "Grace Wanjiku", action: "MEETING_CLOSED", entity: "Meeting", entityId: "mt1", details: "Session #24 closed. Contributions: KES 18,500. Loans: KES 12,000.", timestamp: "2026-02-15T14:30:00", ipAddress: "192.168.1.5" },
  { id: "a2", groupId: "g1", actorId: "u1", actorName: "Grace Wanjiku", action: "LOAN_ISSUED", entity: "Loan", entityId: "l1", details: "KES 5,000 loan issued to Mary Achieng for Business capital.", timestamp: "2026-02-15T11:20:00", ipAddress: "192.168.1.5" },
  { id: "a3", groupId: "g1", actorId: "u1", actorName: "Grace Wanjiku", action: "CONTRIBUTION_RECORDED", entity: "Contribution", entityId: "c1", details: "5 shares (KES 500) recorded for Mary Achieng.", timestamp: "2026-03-01T10:05:00", ipAddress: "192.168.1.5" },
  { id: "a4", groupId: "g1", actorId: "u1", actorName: "Grace Wanjiku", action: "MEETING_OPENED", entity: "Meeting", entityId: "mt2", details: "Session #25 opened at Kangemi Community Hall.", timestamp: "2026-03-01T09:45:00", ipAddress: "192.168.1.5" },
  { id: "a5", groupId: "g1", actorId: "u1", actorName: "Grace Wanjiku", action: "MEMBER_ADDED", entity: "Member", entityId: "m10", details: "New member Hannah Chebet added to the group.", timestamp: "2026-04-01T08:00:00", ipAddress: "192.168.1.5" },
];

export const mockNotifications: Notification[] = [
  { id: "n1", userId: "u1", title: "Overdue Loan Alert", message: "Gladys Mutua's loan of KES 3,000 is overdue by 14 days.", type: "warning", isRead: false, createdAt: "2026-02-19T08:00:00", link: "/dashboard/loans" },
  { id: "n2", userId: "u1", title: "Meeting Reminder", message: "Session #26 is scheduled for March 15, 2026.", type: "info", isRead: false, createdAt: "2026-02-18T10:00:00", link: "/dashboard/meetings" },
  { id: "n3", userId: "u1", title: "Report Ready", message: "Your February 2026 financial report is ready for download.", type: "success", isRead: true, createdAt: "2026-02-16T14:00:00", link: "/dashboard/reports" },
  { id: "n4", userId: "u1", title: "Sync Complete", message: "All offline data has been successfully synced.", type: "success", isRead: true, createdAt: "2026-02-15T15:00:00" },
];

export const mockStats: DashboardStats = {
  totalSavings: 145800,
  totalLoansOut: 28250,
  totalRepaid: 112400,
  activeMembers: 17,
  meetingsThisCycle: 8,
  overdueLoans: 1,
  netProfit: 11240,
  fundBalance: 128790,
};

export const mockChartData: ChartDataPoint[] = [
  { month: "Aug", savings: 16200, loans: 9000, repayments: 7200 },
  { month: "Sep", savings: 17800, loans: 11000, repayments: 8500 },
  { month: "Oct", savings: 15600, loans: 8500, repayments: 9200 },
  { month: "Nov", savings: 18900, loans: 13000, repayments: 10100 },
  { month: "Dec", savings: 19200, loans: 15000, repayments: 11000 },
  { month: "Jan", savings: 17800, loans: 10000, repayments: 8200 },
  { month: "Feb", savings: 18500, loans: 12000, repayments: 9750 },
  { month: "Mar", savings: 14200, loans: 8000, repayments: 5500 },
];
