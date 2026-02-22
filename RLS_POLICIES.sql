-- =====================================================
-- MKUTANO RLS POLICIES (Supabase)
-- =====================================================
-- IMPORTANT:
-- These policies assume Supabase Auth is used and
-- public.users.id = auth.uid(). If you are not using
-- Supabase Auth yet, enable it before running this file.
-- =====================================================

-- Helper functions for policy reuse
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_user_group_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT group_id FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_user_ngo_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT ngo_id FROM public.users WHERE id = auth.uid();
$$;

-- =====================================================
-- USERS
-- =====================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_self"
  ON public.users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_insert_self"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_self"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- =====================================================
-- NGOS (public read, admin/ngo update)
-- =====================================================
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ngos_public_read"
  ON public.ngos FOR SELECT
  USING (true);

CREATE POLICY "ngos_admin_insert"
  ON public.ngos FOR INSERT
  WITH CHECK (public.current_user_role() = 'admin');

CREATE POLICY "ngos_admin_update"
  ON public.ngos FOR UPDATE
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =====================================================
-- GROUPS
-- =====================================================
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Members and secretaries can view their group
CREATE POLICY "groups_member_read"
  ON public.groups FOR SELECT
  USING (
    id = public.current_user_group_id()
    OR secretary_id = auth.uid()
    OR public.current_user_role() = 'admin'
  );

-- NGO can view groups under their NGO
CREATE POLICY "groups_ngo_read"
  ON public.groups FOR SELECT
  USING (
    public.current_user_role() = 'ngo'
    AND ngo_id = public.current_user_ngo_id()
  );

-- Allow secretary to create their own group
CREATE POLICY "groups_secretary_insert"
  ON public.groups FOR INSERT
  WITH CHECK (secretary_id = auth.uid());

-- Secretary/admin can update group
CREATE POLICY "groups_secretary_update"
  ON public.groups FOR UPDATE
  USING (secretary_id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (secretary_id = auth.uid() OR public.current_user_role() = 'admin');

-- OPTIONAL: If you need public join-code lookup for signup,
-- uncomment the policy below and consider masking group data via a view.
-- CREATE POLICY "groups_public_join_lookup"
--   ON public.groups FOR SELECT
--   USING (true);

-- =====================================================
-- MEMBERS
-- =====================================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_group_read"
  ON public.members FOR SELECT
  USING (
    group_id = public.current_user_group_id()
    OR user_id = auth.uid()
    OR public.current_user_role() = 'admin'
  );

CREATE POLICY "members_secretary_insert"
  ON public.members FOR INSERT
  WITH CHECK (
    group_id = public.current_user_group_id()
    AND (public.current_user_role() = 'secretary' OR user_id = auth.uid())
  );

CREATE POLICY "members_secretary_update"
  ON public.members FOR UPDATE
  USING (
    group_id = public.current_user_group_id()
    AND (public.current_user_role() = 'secretary' OR user_id = auth.uid() OR public.current_user_role() = 'admin')
  )
  WITH CHECK (
    group_id = public.current_user_group_id()
    AND (public.current_user_role() = 'secretary' OR user_id = auth.uid() OR public.current_user_role() = 'admin')
  );

-- =====================================================
-- MEETINGS
-- =====================================================
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meetings_group_read"
  ON public.meetings FOR SELECT
  USING (
    group_id = public.current_user_group_id()
    OR public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'ngo'
      AND EXISTS (
        SELECT 1 FROM public.groups g
        WHERE g.id = meetings.group_id
          AND g.ngo_id = public.current_user_ngo_id()
      )
    )
  );

CREATE POLICY "meetings_secretary_write"
  ON public.meetings FOR INSERT
  WITH CHECK (group_id = public.current_user_group_id());

CREATE POLICY "meetings_secretary_update"
  ON public.meetings FOR UPDATE
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin')
  WITH CHECK (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

-- =====================================================
-- CONTRIBUTIONS
-- =====================================================
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contributions_group_read"
  ON public.contributions FOR SELECT
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

CREATE POLICY "contributions_group_insert"
  ON public.contributions FOR INSERT
  WITH CHECK (group_id = public.current_user_group_id());

CREATE POLICY "contributions_group_update"
  ON public.contributions FOR UPDATE
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin')
  WITH CHECK (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

-- =====================================================
-- LOANS
-- =====================================================
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loans_group_read"
  ON public.loans FOR SELECT
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

CREATE POLICY "loans_group_insert"
  ON public.loans FOR INSERT
  WITH CHECK (group_id = public.current_user_group_id());

CREATE POLICY "loans_group_update"
  ON public.loans FOR UPDATE
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin')
  WITH CHECK (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

-- =====================================================
-- REPAYMENTS
-- =====================================================
ALTER TABLE public.repayments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "repayments_group_read"
  ON public.repayments FOR SELECT
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

CREATE POLICY "repayments_group_insert"
  ON public.repayments FOR INSERT
  WITH CHECK (group_id = public.current_user_group_id());

-- =====================================================
-- WALLET TRANSACTIONS
-- =====================================================
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallet_group_read"
  ON public.wallet_transactions FOR SELECT
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

CREATE POLICY "wallet_group_insert"
  ON public.wallet_transactions FOR INSERT
  WITH CHECK (group_id = public.current_user_group_id());

-- =====================================================
-- GROUP FUND BALANCE
-- =====================================================
ALTER TABLE public.group_fund_balance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_fund_group_read"
  ON public.group_fund_balance FOR SELECT
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

CREATE POLICY "group_fund_group_update"
  ON public.group_fund_balance FOR UPDATE
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin')
  WITH CHECK (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

-- =====================================================
-- AUDIT LOGS
-- =====================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_group_read"
  ON public.audit_logs FOR SELECT
  USING (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

CREATE POLICY "audit_group_insert"
  ON public.audit_logs FOR INSERT
  WITH CHECK (group_id = public.current_user_group_id());

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_user_read"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "notifications_user_insert"
  ON public.notifications FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "notifications_user_update"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');

-- =====================================================
-- REPORTS
-- =====================================================
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_group_read"
  ON public.reports FOR SELECT
  USING (
    group_id = public.current_user_group_id()
    OR public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'ngo'
      AND ngo_id = public.current_user_ngo_id()
    )
  );

CREATE POLICY "reports_group_insert"
  ON public.reports FOR INSERT
  WITH CHECK (group_id = public.current_user_group_id() OR public.current_user_role() = 'admin');

-- =====================================================
-- SYNC QUEUE
-- =====================================================
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sync_queue_user_read"
  ON public.sync_queue FOR SELECT
  USING (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "sync_queue_user_insert"
  ON public.sync_queue FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "sync_queue_user_update"
  ON public.sync_queue FOR UPDATE
  USING (user_id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');

-- =====================================================
-- SESSIONS
-- =====================================================
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_user_read"
  ON public.sessions FOR SELECT
  USING (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "sessions_user_insert"
  ON public.sessions FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "sessions_user_update"
  ON public.sessions FOR UPDATE
  USING (user_id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');
