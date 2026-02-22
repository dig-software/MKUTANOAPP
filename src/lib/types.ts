// =====================
//  MKUTANO — Type System
// =====================

export type UserRole = "secretary" | "member" | "ngo" | "admin";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  groupId?: string;
  memberId?: string;
  avatarInitials: string;
  joinedAt: string;
  isActive: boolean;
}

export interface Group {
  id: string;
  name: string;
  village: string;
  district: string;
  country: string;
  secretaryId: string;
  secretaryName: string;
  secretaryPhone: string;
  memberCount: number;
  createdAt: string;
  cycleStartDate: string;
  cycleEndDate: string;
  shareValue: number;
  currency: string;
  joinCode: string;
  isActive: boolean;
}

export interface Member {
  id: string;
  groupId: string;
  userId: string;
  name: string;
  phone: string;
  nationalId?: string;
  sharesHeld: number;
  totalSaved: number;
  totalLoaned: number;
  totalRepaid: number;
  walletBalance: number;
  joinedAt: string;
  status: "active" | "inactive" | "suspended";
}

export interface Meeting {
  id: string;
  groupId: string;
  sessionNumber: number;
  date: string;
  venue: string;
  facilitatorId: string;
  status: "draft" | "open" | "confirmed" | "closed";
  totalContributions: number;
  totalLoansIssued: number;
  totalRepayments: number;
  attendanceCount: number;
  notes?: string;
  createdAt: string;
  closedAt?: string;
  syncStatus: "synced" | "pending" | "offline";
}

export interface Contribution {
  id: string;
  meetingId: string;
  groupId: string;
  memberId: string;
  memberName: string;
  shares: number;
  amount: number;
  type: "share" | "social_fund" | "fine" | "other";
  recordedAt: string;
  recordedBy: string;
  confirmed: boolean;
}

export interface Loan {
  id: string;
  meetingId: string;
  groupId: string;
  memberId: string;
  memberName: string;
  amount: number;
  interestRate: number;
  purpose: string;
  issuedAt: string;
  dueDate: string;
  status: "active" | "repaid" | "overdue" | "written_off";
  totalRepaid: number;
  balance: number;
  issuedBy: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  meetingId: string;
  groupId: string;
  memberId: string;
  memberName: string;
  principal: number;
  interest: number;
  total: number;
  recordedAt: string;
  recordedBy: string;
}

export interface AuditLog {
  id: string;
  groupId: string;
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Report {
  id: string;
  groupId: string;
  type: "meeting" | "monthly" | "annual" | "member";
  title: string;
  generatedAt: string;
  generatedBy: string;
  period: string;
  data: Record<string, unknown>;
}

export interface DashboardStats {
  totalSavings: number;
  totalLoansOut: number;
  totalRepaid: number;
  activeMembers: number;
  meetingsThisCycle: number;
  overdueLoans: number;
  netProfit: number;
  fundBalance: number;
}

export interface ChartDataPoint {
  month: string;
  savings: number;
  loans: number;
  repayments: number;
}
