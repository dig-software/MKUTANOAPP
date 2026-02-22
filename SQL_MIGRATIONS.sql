-- =====================================================
-- MKUTANO DATABASE SCHEMA - SQL Migrations
-- Run this in Supabase SQL Editor to create all tables
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- 1. AUTH & USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('secretary', 'member', 'ngo', 'admin')),
  profile_image_url TEXT,
  avatar_initials VARCHAR(2),
  
  group_id UUID,
  member_id UUID,
  ngo_id UUID,
  
  is_active BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- 2. NGOS & MFI PARTNERS
-- =====================================================

CREATE TABLE IF NOT EXISTS ngos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT UNIQUE,
  website TEXT,
  
  country TEXT,
  county TEXT,
  mission TEXT,
  logo_url TEXT,
  
  partnership_start_date DATE,
  contact_person TEXT,
  contact_email TEXT,
  
  groups_under_management INT DEFAULT 0,
  members_reached INT DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ngos_is_active ON ngos(is_active);
CREATE INDEX idx_ngos_is_verified ON ngos(is_verified);

-- Update users table with NGO foreign key
ALTER TABLE users ADD CONSTRAINT fk_users_ngo_id 
  FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE SET NULL;

-- =====================================================
-- 3. GROUPS (VSLA/Savings Groups)
-- =====================================================

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  village TEXT,
  district TEXT,
  county TEXT,
  country TEXT DEFAULT 'Kenya',
  
  secretary_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  secretary_name TEXT,
  secretary_phone TEXT,
  member_count INT DEFAULT 0,
  
  share_value DECIMAL(10,2) NOT NULL,
  currency CHAR(3) DEFAULT 'KES',
  meeting_frequency TEXT DEFAULT 'monthly',
  
  cycle_start_date DATE,
  cycle_end_date DATE,
  
  join_code VARCHAR(10) UNIQUE,
  
  ngo_id UUID REFERENCES ngos(id) ON DELETE SET NULL,
  ngo_funding_amount DECIMAL(15,2),
  ngo_join_date TIMESTAMP,
  
  is_active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_groups_secretary_id ON groups(secretary_id);
CREATE INDEX idx_groups_ngo_id ON groups(ngo_id);
CREATE INDEX idx_groups_join_code ON groups(join_code);
CREATE INDEX idx_groups_status ON groups(status);

-- Update users table with group foreign key
ALTER TABLE users ADD CONSTRAINT fk_users_group_id 
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL;

-- =====================================================
-- 4. MEMBERS
-- =====================================================

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  national_id TEXT,
  email TEXT,
  
  shares_held INT DEFAULT 0,
  share_value DECIMAL(10,2),
  total_saved DECIMAL(15,2) DEFAULT 0,
  total_loaned DECIMAL(15,2) DEFAULT 0,
  total_repaid DECIMAL(15,2) DEFAULT 0,
  wallet_balance DECIMAL(15,2) DEFAULT 0,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_members_group_id ON members(group_id);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);
CREATE UNIQUE INDEX idx_members_group_user ON members(group_id, user_id);

-- Update users table with member foreign key
ALTER TABLE users ADD CONSTRAINT fk_users_member_id 
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL;

-- =====================================================
-- 5. MEETINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  session_number INT NOT NULL,
  
  date DATE NOT NULL,
  time TIME,
  venue TEXT,
  facilitator_id UUID REFERENCES users(id),
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'confirmed', 'closed')),
  notes TEXT,
  
  total_contributions DECIMAL(15,2) DEFAULT 0,
  total_loans_issued DECIMAL(15,2) DEFAULT 0,
  total_repayments DECIMAL(15,2) DEFAULT 0,
  attendance_count INT DEFAULT 0,
  
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('synced', 'pending', 'offline')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meetings_group_id ON meetings(group_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_date ON meetings(date);

-- =====================================================
-- 6. MEETING ATTENDANCES
-- =====================================================

CREATE TABLE IF NOT EXISTS meeting_attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id),
  
  attended BOOLEAN DEFAULT TRUE,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendances_meeting_id ON meeting_attendances(meeting_id);
CREATE UNIQUE INDEX idx_attendances_meeting_member ON meeting_attendances(meeting_id, member_id);

-- =====================================================
-- 7. CONTRIBUTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id),
  member_id UUID NOT NULL REFERENCES members(id),
  member_name TEXT,
  
  shares INT DEFAULT 0,
  amount DECIMAL(15,2) NOT NULL,
  contribution_type TEXT DEFAULT 'share' CHECK (contribution_type IN ('share', 'social_fund', 'fine', 'other')),
  description TEXT,
  
  recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMP,
  
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('synced', 'pending', 'offline')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contributions_meeting_id ON contributions(meeting_id);
CREATE INDEX idx_contributions_member_id ON contributions(member_id);
CREATE INDEX idx_contributions_group_id ON contributions(group_id);
CREATE INDEX idx_contributions_recorded_at ON contributions(recorded_at);

-- =====================================================
-- 8. LOANS
-- =====================================================

CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
  group_id UUID NOT NULL REFERENCES groups(id),
  member_id UUID NOT NULL REFERENCES members(id),
  member_name TEXT,
  
  amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) DEFAULT 10,
  interest_type TEXT DEFAULT 'flat' CHECK (interest_type IN ('flat', 'reducing', 'compound')),
  loan_purpose TEXT,
  currency CHAR(3) DEFAULT 'KES',
  
  issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
  due_date DATE NOT NULL,
  disbursed_at TIMESTAMP,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'repaid', 'overdue', 'written_off', 'defaulted')),
  
  total_repaid DECIMAL(15,2) DEFAULT 0,
  balance DECIMAL(15,2),
  
  issued_by UUID REFERENCES users(id),
  notes TEXT,
  
  guarantor_id UUID REFERENCES members(id),
  
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('synced', 'pending', 'offline')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loans_group_id ON loans(group_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_due_date ON loans(due_date);
CREATE INDEX idx_loans_meeting_id ON loans(meeting_id);

-- =====================================================
-- 9. REPAYMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS repayments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
  group_id UUID NOT NULL REFERENCES groups(id),
  member_id UUID NOT NULL REFERENCES members(id),
  member_name TEXT,
  
  principal DECIMAL(15,2) NOT NULL,
  interest DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  
  recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('synced', 'pending', 'offline')),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_repayments_loan_id ON repayments(loan_id);
CREATE INDEX idx_repayments_member_id ON repayments(member_id);
CREATE INDEX idx_repayments_group_id ON repayments(group_id);
CREATE INDEX idx_repayments_recorded_at ON repayments(recorded_at);

-- =====================================================
-- 10. NGO FUNDING
-- =====================================================

CREATE TABLE IF NOT EXISTS ngo_funding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  
  funding_amount DECIMAL(15,2) NOT NULL,
  funding_date DATE,
  funding_purpose TEXT,
  
  expected_roi DECIMAL(5,2),
  funding_status TEXT DEFAULT 'promised' CHECK (funding_status IN ('promised', 'disbursed', 'returned', 'written_off')),
  
  amount_returned DECIMAL(15,2) DEFAULT 0,
  expected_return_date DATE,
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ngo_funding_ngo_id ON ngo_funding(ngo_id);
CREATE INDEX idx_ngo_funding_group_id ON ngo_funding(group_id);
CREATE INDEX idx_ngo_funding_status ON ngo_funding(funding_status);

-- =====================================================
-- 11. NGO MONITORING
-- =====================================================

CREATE TABLE IF NOT EXISTS ngo_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  
  monitoring_date DATE,
  member_count INT,
  average_savings_per_member DECIMAL(15,2),
  loan_portfolio_size DECIMAL(15,2),
  loan_repayment_rate DECIMAL(5,2),
  interest_earned DECIMAL(15,2),
  default_rate DECIMAL(5,2),
  
  health_score INT,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ngo_monitoring_ngo_id ON ngo_monitoring(ngo_id);
CREATE INDEX idx_ngo_monitoring_group_id ON ngo_monitoring(group_id);
CREATE INDEX idx_ngo_monitoring_date ON ngo_monitoring(monitoring_date);

-- =====================================================
-- 12. WALLET TRANSACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id),
  meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
  
  transaction_type TEXT NOT NULL CHECK (transaction_type IN 
    ('contribution', 'loan_disbursement', 'loan_repayment', 'dividend', 'fine', 'withdrawal', 'adjustment')),
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2),
  balance_after DECIMAL(15,2),
  
  reference_id UUID,
  description TEXT,
  
  recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_member_id ON wallet_transactions(member_id);
CREATE INDEX idx_wallet_transactions_group_id ON wallet_transactions(group_id);
CREATE INDEX idx_wallet_transactions_recorded_at ON wallet_transactions(recorded_at);

-- =====================================================
-- 13. GROUP FUND BALANCE
-- =====================================================

CREATE TABLE IF NOT EXISTS group_fund_balance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL UNIQUE REFERENCES groups(id) ON DELETE CASCADE,
  
  total_contributions DECIMAL(15,2) DEFAULT 0,
  social_fund DECIMAL(15,2) DEFAULT 0,
  fine_fund DECIMAL(15,2) DEFAULT 0,
  interest_earned DECIMAL(15,2) DEFAULT 0,
  investment_fund DECIMAL(15,2) DEFAULT 0,
  
  total_loans_issued DECIMAL(15,2) DEFAULT 0,
  total_loans_repaid DECIMAL(15,2) DEFAULT 0,
  current_loan_portfolio DECIMAL(15,2) DEFAULT 0,
  
  net_fund_balance DECIMAL(15,2) DEFAULT 0,
  
  last_calculated TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_group_fund_group_id ON group_fund_balance(group_id);

-- =====================================================
-- 14. AUDIT LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id),
  
  actor_id UUID REFERENCES users(id),
  actor_name TEXT,
  actor_role TEXT,
  
  action_type VARCHAR(255),
  entity_type VARCHAR(100),
  entity_id UUID,
  
  changes_before JSONB,
  changes_after JSONB,
  description TEXT,
  
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_group_id ON audit_logs(group_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- =====================================================
-- 15. NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'info' CHECK (notification_type IN ('info', 'warning', 'success', 'error', 'alert')),
  
  related_entity_type VARCHAR(100),
  related_entity_id UUID,
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  action_link TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- =====================================================
-- 16. REPORTS
-- =====================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id),
  ngo_id UUID REFERENCES ngos(id),
  
  report_type TEXT NOT NULL CHECK (report_type IN 
    ('meeting', 'monthly', 'quarterly', 'annual', 'member', 'impact', 'audit')),
  title TEXT,
  period_start DATE,
  period_end DATE,
  
  report_data JSONB,
  metrics JSONB,
  
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMP DEFAULT NOW(),
  
  shared_with_ngo BOOLEAN DEFAULT FALSE,
  sharing_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_group_id ON reports(group_id);
CREATE INDEX idx_reports_report_type ON reports(report_type);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);

-- =====================================================
-- 17. SYNC QUEUE (PWA Offline)
-- =====================================================

CREATE TABLE IF NOT EXISTS sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  
  action_type VARCHAR(100),
  entity_type VARCHAR(100),
  entity_id UUID,
  
  payload JSONB,
  
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'synced', 'failed')),
  error_message TEXT,
  
  attempt_count INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  last_attempt_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  synced_at TIMESTAMP
);

CREATE INDEX idx_sync_queue_user_id ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_sync_status ON sync_queue(sync_status);
CREATE INDEX idx_sync_queue_created_at ON sync_queue(created_at);

-- =====================================================
-- 18. SESSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  session_token TEXT UNIQUE,
  device_type VARCHAR(50),
  device_name TEXT,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_session_token ON sessions(session_token);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active loans by group
CREATE OR REPLACE VIEW active_loans_view AS
SELECT 
  l.id,
  l.group_id,
  l.member_id,
  m.name as member_name,
  l.amount,
  l.total_repaid,
  l.balance,
  l.due_date,
  l.status,
  CASE 
    WHEN l.due_date < NOW()::date AND l.status = 'active' THEN 'overdue'
    WHEN l.due_date >= NOW()::date AND l.status = 'active' THEN 'on_track'
    ELSE l.status
  END as current_status
FROM loans l
JOIN members m ON l.member_id = m.id;

-- Group financial summary
CREATE OR REPLACE VIEW group_summary_view AS
SELECT 
  g.id,
  g.name,
  g.member_count,
  COUNT(m.id) as active_members,
  COALESCE(SUM(m.total_saved), 0) as total_group_savings,
  COALESCE(SUM(m.total_loaned), 0) as total_loans_issued,
  COALESCE(SUM(m.total_repaid), 0) as total_repaid,
  COALESCE(gfb.net_fund_balance, 0) as fund_balance
FROM groups g
LEFT JOIN members m ON g.id = m.group_id AND m.status = 'active'
LEFT JOIN group_fund_balance gfb ON g.id = gfb.group_id
GROUP BY g.id, g.name, g.member_count, gfb.net_fund_balance;

-- Member financial summary
CREATE OR REPLACE VIEW member_summary_view AS
SELECT 
  m.id,
  m.name,
  m.group_id,
  m.shares_held,
  m.total_saved,
  m.wallet_balance,
  COUNT(DISTINCT l.id) as active_loans,
  COALESCE(SUM(l.balance), 0) as total_loan_balance,
  m.status
FROM members m
LEFT JOIN loans l ON m.id = l.member_id AND l.status IN ('active', 'overdue')
GROUP BY m.id, m.name, m.group_id, m.shares_held, m.total_saved, m.wallet_balance, m.status;

-- =====================================================
-- GRANTS (for Supabase Auth Integration)
-- =====================================================

-- Allow public read on some tables
GRANT SELECT ON ngos TO anon;
GRANT SELECT ON groups TO anon;

-- Allow authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON meetings TO authenticated;
GRANT SELECT, INSERT ON contributions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON loans TO authenticated;
GRANT SELECT, INSERT ON repayments TO authenticated;
GRANT SELECT, INSERT ON wallet_transactions TO authenticated;
GRANT SELECT, INSERT ON notifications TO authenticated;

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to update member financial totals
CREATE OR REPLACE FUNCTION update_member_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE members
  SET 
    total_saved = COALESCE((
      SELECT SUM(amount) FROM contributions 
      WHERE member_id = NEW.member_id AND contribution_type = 'share'
    ), 0),
    wallet_balance = COALESCE((
      SELECT SUM(CASE 
        WHEN transaction_type IN ('contribution', 'dividend') THEN amount
        WHEN transaction_type IN ('loan_disbursement', 'withdrawal') THEN -amount
        ELSE 0
      END) FROM wallet_transactions
      WHERE member_id = NEW.member_id
    ), 0)
  WHERE id = NEW.member_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for contributions
CREATE TRIGGER trigger_update_member_on_contribution
AFTER INSERT OR UPDATE ON contributions
FOR EACH ROW
EXECUTE FUNCTION update_member_totals();

-- Create trigger for wallet transactions
CREATE TRIGGER trigger_update_member_on_wallet
AFTER INSERT ON wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION update_member_totals();

-- Function to log audit trail
CREATE OR REPLACE FUNCTION audit_log_action(
  p_group_id UUID,
  p_actor_id UUID,
  p_actor_name TEXT,
  p_action_type VARCHAR,
  p_entity_type VARCHAR,
  p_entity_id UUID,
  p_description TEXT,
  p_ip_address INET,
  p_user_agent TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs 
  (group_id, actor_id, actor_name, action_type, entity_type, entity_id, description, ip_address, user_agent)
  VALUES
  (p_group_id, p_actor_id, p_actor_name, p_action_type, p_entity_type, p_entity_id, p_description, p_ip_address, p_user_agent);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Database schema is now ready for Mkutano!
-- Next: Set up Row Level Security (RLS) policies
