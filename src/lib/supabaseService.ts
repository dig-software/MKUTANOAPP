/**
 * Supabase Database Service Functions
 * Handle all database operations for Mkutano
 */

import { supabase } from './supabase'
import type { Group, Member, Meeting, Contribution, Loan, Repayment } from './types'

// =====================================================
// GROUP OPERATIONS
// =====================================================

export async function createGroup(group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('groups')
    .insert([group])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getGroupById(groupId: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single()

  if (error) throw error
  return data as Group
}

export async function getGroupsBySecretary(secretaryId: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('secretary_id', secretaryId)

  if (error) throw error
  return data as Group[]
}

export async function updateGroup(groupId: string, updates: Partial<Group>) {
  const { data, error } = await supabase
    .from('groups')
    .update(updates)
    .eq('id', groupId)
    .select()
    .single()

  if (error) throw error
  return data
}

// =====================================================
// MEMBER OPERATIONS
// =====================================================

export async function addMemberToGroup(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('members')
    .insert([member])
    .select()
    .single()

  if (error) throw error

  // Update group member count
  await supabase.rpc('increment_group_member_count', {
    group_id: member.groupId,
  })

  return data as Member
}

export async function getGroupMembers(groupId: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('group_id', groupId)
    .eq('status', 'active')
    .order('name')

  if (error) throw error
  return data as Member[]
}

export async function updateMember(memberId: string, updates: Partial<Member>) {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMemberById(memberId: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single()

  if (error) throw error
  return data as Member
}

// =====================================================
// MEETING OPERATIONS
// =====================================================

export async function createMeeting(meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('meetings')
    .insert([meeting])
    .select()
    .single()

  if (error) throw error
  return data as Meeting
}

export async function getMeetingsByGroup(groupId: string) {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('group_id', groupId)
    .order('date', { ascending: false })

  if (error) throw error
  return data as Meeting[]
}

export async function updateMeeting(meetingId: string, updates: Partial<Meeting>) {
  const { data, error } = await supabase
    .from('meetings')
    .update(updates)
    .eq('id', meetingId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMeetingById(meetingId: string) {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', meetingId)
    .single()

  if (error) throw error
  return data as Meeting
}

// =====================================================
// CONTRIBUTION OPERATIONS
// =====================================================

export async function recordContribution(contribution: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('contributions')
    .insert([contribution])
    .select()
    .single()

  if (error) throw error

  // Create wallet transaction
  if (contribution.amount > 0) {
    const member = await getMemberById(contribution.memberId)
    await createWalletTransaction({
      memberId: contribution.memberId,
      groupId: contribution.groupId,
      meetingId: contribution.meetingId,
      transactionType: 'contribution',
      amount: contribution.amount,
      description: `${contribution.type} contribution`,
      recordedBy: contribution.recordedBy,
    })
  }

  return data as Contribution
}

export async function getContributionsByMeeting(meetingId: string) {
  const { data, error } = await supabase
    .from('contributions')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('recorded_at')

  if (error) throw error
  return data as Contribution[]
}

// =====================================================
// LOAN OPERATIONS
// =====================================================

export async function issueLoan(loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('loans')
    .insert([loan])
    .select()
    .single()

  if (error) throw error

  // Create wallet transaction for disbursement
  await createWalletTransaction({
    memberId: loan.memberId,
    groupId: loan.groupId,
    meetingId: loan.meetingId,
    transactionType: 'loan_disbursement',
    amount: loan.amount,
    description: `Loan issued: ${loan.purpose}`,
    recordedBy: loan.issuedBy,
  })

  return data as Loan
}

export async function getLoansByGroup(groupId: string) {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('group_id', groupId)
    .in('status', ['active', 'overdue'])
    .order('due_date')

  if (error) throw error
  return data as Loan[]
}

export async function getLoanById(loanId: string) {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('id', loanId)
    .single()

  if (error) throw error
  return data as Loan
}

export async function updateLoan(loanId: string, updates: Partial<Loan>) {
  const { data, error } = await supabase
    .from('loans')
    .update(updates)
    .eq('id', loanId)
    .select()
    .single()

  if (error) throw error
  return data
}

// =====================================================
// REPAYMENT OPERATIONS
// =====================================================

export async function recordRepayment(repayment: Omit<Repayment, 'id' | 'createdAt' | 'updatedAt'>) {
  // Start transaction
  const { data, error } = await supabase
    .from('repayments')
    .insert([repayment])
    .select()
    .single()

  if (error) throw error

  // Update loan balance
  const loan = await getLoanById(repayment.loanId)
  const newBalance = (loan.balance || 0) - repayment.total
  const newStatus = newBalance <= 0 ? 'repaid' : 'active'

  await updateLoan(repayment.loanId, {
    totalRepaid: (loan.totalRepaid || 0) + repayment.total,
    balance: newBalance,
    status: newStatus,
  })

  // Create wallet transaction
  await createWalletTransaction({
    memberId: repayment.memberId,
    groupId: repayment.groupId,
    meetingId: repayment.meetingId,
    transactionType: 'loan_repayment',
    amount: repayment.total,
    description: `Loan repayment: KES ${repayment.principal} principal + KES ${repayment.interest} interest`,
    recordedBy: repayment.recordedBy,
  })

  return data as Repayment
}

export async function getRepaymentsByLoan(loanId: string) {
  const { data, error } = await supabase
    .from('repayments')
    .select('*')
    .eq('loan_id', loanId)
    .order('recorded_at')

  if (error) throw error
  return data as Repayment[]
}

// =====================================================
// WALLET & TRANSACTIONS
// =====================================================

export async function createWalletTransaction(transaction: {
  memberId: string
  groupId: string
  meetingId?: string
  transactionType: string
  amount: number
  description: string
  recordedBy?: string
}) {
  const member = await getMemberById(transaction.memberId)
  const balanceBefore = member.walletBalance || 0

  const balanceAfter =
    transaction.transactionType === 'loan_disbursement' || transaction.transactionType === 'withdrawal'
      ? balanceBefore - transaction.amount
      : balanceBefore + transaction.amount

  const { data, error } = await supabase
    .from('wallet_transactions')
    .insert([
      {
        member_id: transaction.memberId,
        group_id: transaction.groupId,
        meeting_id: transaction.meetingId,
        transaction_type: transaction.transactionType,
        amount: transaction.amount,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description: transaction.description,
        recorded_by: transaction.recordedBy,
      },
    ])
    .select()
    .single()

  if (error) throw error

  // Update member wallet balance
  await updateMember(transaction.memberId, {
    walletBalance: balanceAfter,
  })

  return data
}

// =====================================================
// AUDIT & LOGGING
// =====================================================

export async function logAuditAction(audit: {
  groupId: string
  actorId: string
  actorName: string
  actionType: string
  entityType: string
  entityId: string
  description: string
  ipAddress?: string
  userAgent?: string
}) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([audit])
    .select()
    .single()

  if (error) {
    console.error('Audit log error:', error)
  }
  return data
}

// =====================================================
// NOTIFICATIONS
// =====================================================

export async function createNotification(notification: {
  userId: string
  title: string
  message: string
  notificationType?: string
  actionLink?: string
}) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: notification.userId,
        title: notification.title,
        message: notification.message,
        notification_type: notification.notificationType || 'info',
        action_link: notification.actionLink,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// =====================================================
// REPORTS & ANALYTICS
// =====================================================

export async function getGroupSummary(groupId: string) {
  const { data, error } = await supabase
    .from('group_summary_view')
    .select('*')
    .eq('id', groupId)
    .single()

  if (error) throw error
  return data
}

export async function getMemberSummary(memberId: string) {
  const { data, error } = await supabase
    .from('member_summary_view')
    .select('*')
    .eq('id', memberId)
    .single()

  if (error) throw error
  return data
}

// =====================================================
// SYNC OPERATIONS (PWA Offline)
// =====================================================

export async function addToSyncQueue(item: {
  userId: string
  groupId: string
  actionType: string
  entityType: string
  entityId?: string
  payload: Record<string, any>
}) {
  const { data, error } = await supabase
    .from('sync_queue')
    .insert([
      {
        user_id: item.userId,
        group_id: item.groupId,
        action_type: item.actionType,
        entity_type: item.entityType,
        entity_id: item.entityId,
        payload: item.payload,
        sync_status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPendingSyncItems(userId: string) {
  const { data, error } = await supabase
    .from('sync_queue')
    .select('*')
    .eq('user_id', userId)
    .eq('sync_status', 'pending')
    .order('created_at')

  if (error) throw error
  return data
}

export async function markSyncItemAsSynced(syncItemId: string) {
  const { data, error } = await supabase
    .from('sync_queue')
    .update({
      sync_status: 'synced',
      synced_at: new Date().toISOString(),
    })
    .eq('id', syncItemId)
    .select()
    .single()

  if (error) throw error
  return data
}
