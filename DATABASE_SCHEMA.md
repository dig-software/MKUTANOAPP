# Mkutano - Complete Database Schema

## Overview
Mkutano is a multi-tenant, offline-first PWA for managing Village Savings & Loan Associations (VSLAs) with Multi-Finance Institution (MFI) and NGO partner support. 

**User Roles:**
- **Secretary**: Manages a single savings group
- **Member**: Belongs to one group
- **NGO/MFI Partner**: Funds & monitors multiple groups
- **Admin**: Manages entire platform

---

## 1. CORE USERS & AUTHENTICATION

### `users` table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role ENUM('secretary', 'member', 'ngo', 'admin') NOT NULL,
  profile_image_url TEXT,
  avatar_initials VARCHAR(2),
  group_id UUID REFERENCES groups(id),  -- secretary/member's group
  member_id UUID REFERENCES members(id), -- if role=member
  ngo_id UUID REFERENCES ngos(id),       -- if role=ngo
  is_active BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_group_id ON users(group_id);
CREATE INDEX idx_users_role ON users(role);
```

---

## 2. GROUPS (VSLA/Savings Groups)

### `groups` table
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  village TEXT,
  district TEXT,
  county TEXT,
  country TEXT DEFAULT 'Kenya',
  secretary_id UUID NOT NULL REFERENCES users(id),
  secretary_name TEXT,
  secretary_phone TEXT,
  member_count INT DEFAULT 0,
  
  -- Group Configuration
  share_value DECIMAL(10,2) NOT NULL,
  currency CHAR(3) DEFAULT 'KES',
  meeting_frequency ENUM('weekly', 'bi-weekly', 'monthly') DEFAULT 'monthly',
  cycle_start_date DATE,
  cycle_end_date DATE,
  
  -- Admin & Access
  join_code VARCHAR(10) UNIQUE,  -- e.g., "MAE-X9K2"
  is_active BOOLEAN DEFAULT TRUE,
  status ENUM('active', 'inactive', 'suspended', 'pending_verification') DEFAULT 'active',
  
  -- NGO Relationship
  ngo_id UUID REFERENCES ngos(id),  -- if registered with an NGO
  ngo_funding_amount DECIMAL(15,2),
  ngo_join_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_groups_secretary_id ON groups(secretary_id);
CREATE INDEX idx_groups_ngo_id ON groups(ngo_id);
CREATE INDEX idx_groups_join_code ON groups(join_code);
CREATE INDEX idx_groups_status ON groups(status);
```

---

## 3. MEMBERS

### `members` table
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Personal Info
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  national_id TEXT,
  email TEXT,
  
  -- Financial Data
  shares_held INT DEFAULT 0,
  share_value DECIMAL(10,2),  -- copy from group for audit
  total_saved DECIMAL(15,2) DEFAULT 0,
  total_loaned DECIMAL(15,2) DEFAULT 0,
  total_repaid DECIMAL(15,2) DEFAULT 0,
  wallet_balance DECIMAL(15,2) DEFAULT 0,
  
  -- Status
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  joined_at DATE DEFAULT NOW(),
  left_at DATE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_members_group_id ON members(group_id);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);
CREATE UNIQUE INDEX idx_members_group_user ON members(group_id, user_id);
```

---

## 4. MEETINGS & SESSIONS

### `meetings` table
```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  session_number INT NOT NULL,
  
  -- Meeting Details
  date DATE NOT NULL,
  time TIME,
  venue TEXT,
  facilitator_id UUID REFERENCES users(id),  -- secretary
  
  -- Status
  status ENUM('draft', 'open', 'confirmed', 'closed') DEFAULT 'draft',
  notes TEXT,
  
  -- Totals (aggregated)
  total_contributions DECIMAL(15,2) DEFAULT 0,
  total_loans_issued DECIMAL(15,2) DEFAULT 0,
  total_repayments DECIMAL(15,2) DEFAULT 0,
  attendance_count INT DEFAULT 0,
  
  -- Sync Status
  sync_status ENUM('synced', 'pending', 'offline') DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meetings_group_id ON meetings(group_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_date ON meetings(date);
```

### `meeting_attendances` table (who attended)
```sql
CREATE TABLE meeting_attendances (
  id UUID PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  
  attended BOOLEAN DEFAULT TRUE,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendances_meeting_id ON meeting_attendances(meeting_id);
CREATE UNIQUE INDEX idx_attendances_meeting_member ON meeting_attendances(meeting_id, member_id);
```

---

## 5. CONTRIBUTIONS & SHARES

### `contributions` table
```sql
CREATE TABLE contributions (
  id UUID PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id),
  member_id UUID NOT NULL REFERENCES members(id),
  member_name TEXT,
  
  -- Contribution Details
  shares INT DEFAULT 0,
  amount DECIMAL(15,2) NOT NULL,
  contribution_type ENUM('share', 'social_fund', 'fine', 'other') DEFAULT 'share',
  description TEXT,
  
  -- Recording
  recorded_by UUID REFERENCES users(id),  -- secretary
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  -- Verification
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMP,
  
  -- Sync Status
  sync_status ENUM('synced', 'pending', 'offline') DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contributions_meeting_id ON contributions(meeting_id);
CREATE INDEX idx_contributions_member_id ON contributions(member_id);
CREATE INDEX idx_contributions_group_id ON contributions(group_id);
CREATE INDEX idx_contributions_recorded_at ON contributions(recorded_at);
```

---

## 6. LOANS & FINANCING

### `loans` table
```sql
CREATE TABLE loans (
  id UUID PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES meetings(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  member_id UUID NOT NULL REFERENCES members(id),
  member_name TEXT,
  
  -- Loan Terms
  amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) DEFAULT 10,
  interest_type ENUM('flat', 'reducing', 'compound') DEFAULT 'flat',
  loan_purpose TEXT,
  currency CHAR(3) DEFAULT 'KES',
  
  -- Timeline
  issued_at TIMESTAMP NOT NULL,
  due_date DATE NOT NULL,
  disbursed_at TIMESTAMP,
  
  -- Status
  status ENUM('pending', 'active', 'repaid', 'overdue', 'written_off', 'defaulted') DEFAULT 'active',
  
  -- Amounts
  total_repaid DECIMAL(15,2) DEFAULT 0,
  balance DECIMAL(15,2),
  
  -- Issuance
  issued_by UUID REFERENCES users(id),
  notes TEXT,
  
  -- Guarantor (optional)
  guarantor_id UUID REFERENCES members(id),
  
  -- Sync Status
  sync_status ENUM('synced', 'pending', 'offline') DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loans_group_id ON loans(group_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_due_date ON loans(due_date);
CREATE INDEX idx_loans_meeting_id ON loans(meeting_id);
```

### `repayments` table
```sql
CREATE TABLE repayments (
  id UUID PRIMARY KEY,
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  meeting_id UUID NOT NULL REFERENCES meetings(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  member_id UUID NOT NULL REFERENCES members(id),
  member_name TEXT,
  
  -- Repayment Breakdown
  principal DECIMAL(15,2) NOT NULL,
  interest DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  
  -- Recording
  recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  -- Sync Status
  sync_status ENUM('synced', 'pending', 'offline') DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_repayments_loan_id ON repayments(loan_id);
CREATE INDEX idx_repayments_member_id ON repayments(member_id);
CREATE INDEX idx_repayments_group_id ON repayments(group_id);
CREATE INDEX idx_repayments_recorded_at ON repayments(recorded_at);
```

---

## 7. NGO/MFI PARTNERS

### `ngos` table
```sql
CREATE TABLE ngos (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT UNIQUE,
  website TEXT,
  
  -- Organization Details
  country TEXT,
  county TEXT,
  mission TEXT,
  logo_url TEXT,
  
  -- Partnership
  partnership_start_date DATE,
  contact_person TEXT,
  contact_email TEXT,
  
  -- Capacity
  groups_under_management INT DEFAULT 0,
  members_reached INT DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ngos_is_active ON ngos(is_active);
CREATE INDEX idx_ngos_is_verified ON ngos(is_verified);
```

### `ngo_funding` table (Track funding to groups)
```sql
CREATE TABLE ngo_funding (
  id UUID PRIMARY KEY,
  ngo_id UUID NOT NULL REFERENCES ngos(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  
  -- Funding Details
  funding_amount DECIMAL(15,2) NOT NULL,
  funding_date DATE,
  funding_purpose TEXT,
  
  -- Terms
  expected_roi DECIMAL(5,2),  -- Expected return on investment %
  funding_status ENUM('promised', 'disbursed', 'returned', 'written_off') DEFAULT 'promised',
  
  -- Tracking
  amount_returned DECIMAL(15,2) DEFAULT 0,
  expected_return_date DATE,
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ngo_funding_ngo_id ON ngo_funding(ngo_id);
CREATE INDEX idx_ngo_funding_group_id ON ngo_funding(group_id);
CREATE INDEX idx_ngo_funding_status ON ngo_funding(funding_status);
```

### `ngo_monitoring` table (MFI tracking group performance)
```sql
CREATE TABLE ngo_monitoring (
  id UUID PRIMARY KEY,
  ngo_id UUID NOT NULL REFERENCES ngos(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  
  -- Metrics
  monitoring_date DATE,
  member_count INT,
  average_savings_per_member DECIMAL(15,2),
  loan_portfolio_size DECIMAL(15,2),
  loan_repayment_rate DECIMAL(5,2),  -- percentage
  interest_earned DECIMAL(15,2),
  default_rate DECIMAL(5,2),
  
  -- Health Score
  health_score INT,  -- 0-100
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ngo_monitoring_ngo_id ON ngo_monitoring(ngo_id);
CREATE INDEX idx_ngo_monitoring_group_id ON ngo_monitoring(group_id);
CREATE INDEX idx_ngo_monitoring_date ON ngo_monitoring(monitoring_date);
```

---

## 8. FINANCIAL TRACKING

### `wallet_transactions` table
```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  meeting_id UUID REFERENCES meetings(id),
  
  -- Transaction
  transaction_type ENUM('contribution', 'loan_disbursement', 'loan_repayment', 'dividend', 'fine', 'withdrawal', 'adjustment') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2),
  balance_after DECIMAL(15,2),
  
  -- Reference
  reference_id UUID,  -- contribution_id or loan_id or repayment_id
  description TEXT,
  
  recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_member_id ON wallet_transactions(member_id);
CREATE INDEX idx_wallet_transactions_group_id ON wallet_transactions(group_id);
CREATE INDEX idx_wallet_transactions_recorded_at ON wallet_transactions(recorded_at);
```

### `group_fund_balance` table (Track overall group funds)
```sql
CREATE TABLE group_fund_balance (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL UNIQUE REFERENCES groups(id),
  
  -- Fund Tracking
  total_contributions DECIMAL(15,2) DEFAULT 0,
  social_fund DECIMAL(15,2) DEFAULT 0,
  fine_fund DECIMAL(15,2) DEFAULT 0,
  interest_earned DECIMAL(15,2) DEFAULT 0,
  investment_fund DECIMAL(15,2) DEFAULT 0,
  
  -- Loans Outstanding
  total_loans_issued DECIMAL(15,2) DEFAULT 0,
  total_loans_repaid DECIMAL(15,2) DEFAULT 0,
  current_loan_portfolio DECIMAL(15,2) DEFAULT 0,
  
  -- Net Position
  net_fund_balance DECIMAL(15,2) DEFAULT 0,
  
  last_calculated TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_group_fund_group_id ON group_fund_balance(group_id);
```

---

## 9. AUDITING & COMPLIANCE

### `audit_logs` table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id),
  
  -- Actor
  actor_id UUID REFERENCES users(id),
  actor_name TEXT,
  actor_role TEXT,
  
  -- Action
  action_type VARCHAR(255),  -- 'MEETING_OPENED', 'CONTRIBUTION_RECORDED', etc
  entity_type VARCHAR(100),  -- 'meeting', 'contribution', 'loan', etc
  entity_id UUID,
  
  changes_before JSONB,  -- Previous values
  changes_after JSONB,   -- New values
  description TEXT,
  
  -- Security
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_group_id ON audit_logs(group_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

---

## 10. NOTIFICATIONS & ALERTS

### `notifications` table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('info', 'warning', 'success', 'error', 'alert') DEFAULT 'info',
  
  -- Triggering Entity
  related_entity_type VARCHAR(100),  -- 'loan', 'meeting', 'member'
  related_entity_id UUID,
  
  -- Read Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  action_link TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

## 11. REPORTS & EXPORTS

### `reports` table
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id),
  ngo_id UUID REFERENCES ngos(id),  -- If generated by NGO
  
  -- Report Details
  report_type ENUM('meeting', 'monthly', 'quarterly', 'annual', 'member', 'impact', 'audit') NOT NULL,
  title TEXT,
  period_start DATE,
  period_end DATE,
  
  -- Content
  report_data JSONB,  -- Flexible data structure
  metrics JSONB,
  
  -- Generation
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMP DEFAULT NOW(),
  
  -- Distribution
  shared_with_ngo BOOLEAN DEFAULT FALSE,
  sharing_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_group_id ON reports(group_id);
CREATE INDEX idx_reports_report_type ON reports(report_type);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);
```

---

## 12. OFFLINE SYNC & QUEUE

### `sync_queue` table (For PWA offline-to-online sync)
```sql
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  
  -- Queued Action
  action_type VARCHAR(100),  -- 'create_contribution', 'update_loan', etc
  entity_type VARCHAR(100),  -- 'contribution', 'loan', 'repayment'
  entity_id UUID,
  
  -- Data
  payload JSONB,
  
  -- Status
  sync_status ENUM('pending', 'syncing', 'synced', 'failed') DEFAULT 'pending',
  error_message TEXT,
  
  -- Retry
  attempt_count INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  last_attempt_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  synced_at TIMESTAMP
);

CREATE INDEX idx_sync_queue_user_id ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_sync_status ON sync_queue(sync_status);
CREATE INDEX idx_sync_queue_created_at ON sync_queue(created_at);
```

---

## 13. SESSION & SECURITY

### `sessions` table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session Info
  session_token TEXT UNIQUE,
  device_type VARCHAR(50),
  device_name TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Lifecycle
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_session_token ON sessions(session_token);
```

---

## RELATIONSHIPS SUMMARY

```
┌─────────────────────────────────────────────────────────┐
│                      USERS (4 roles)                    │
├─────────────────────────────────────────────────────────┤
│ Secretary → manages 1 Group                             │
│ Member → belongs to 1 Group                             │
│ NGO/MFI → funds & monitors multiple Groups              │
│ Admin → manages entire platform                         │
└─────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
         GROUP         MEMBERS        MEETINGS
            │              │              │
            ├─────────┬────┴────┬─────────┤
            │         │         │         │
            ▼         ▼         ▼         ▼
       CONTRIBUTIONS LOANS REPAYMENTS ATTENDANCES
            │         │         │
            └─────────┼─────────┘
                      ▼
            WALLET_TRANSACTIONS
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
    AUDIT_LOGS              NOTIFICATIONS
         │
         ├─────────────────────────────

NGO RELATIONSHIPS:
   NGO ──→ Groups (via ngo_id in groups table)
   NGO ──→ Funding (ngo_funding table)
   NGO ──→ Monitoring (ngo_monitoring table)
```

---

## KEY FEATURES IN SCHEMA

✅ **Multi-tenant**: Groups isolated by group_id  
✅ **Role-based Access**: Secretary, Member, NGO, Admin  
✅ **Offline-first**: sync_queue for PWA offline data  
✅ **Real-time Sync**: sync_status field on key entities  
✅ **Audit Trail**: Complete action logging  
✅ **Financial Accuracy**: All monetary fields DECIMAL(15,2)  
✅ **NGO/MFI Integration**: Full funding & monitoring support  
✅ **Notifications**: Smart alerts for overdue loans, meetings  
✅ **Reports**: Flexible JSON-based reporting  
✅ **Security**: Session management, audit logs  

---

## INDEXES SUMMARY

- **Performance**: Created on frequently queried fields
- **Group isolation**: group_id on all data tables
- **Status tracking**: status fields indexed
- **Time-based**: date/timestamp fields for filtering
- **User relationships**: user_id, member_id, actor_id

---

This schema is **production-ready** and optimized for:
- Multiple groups with financial data
- Offline-to-online PWA sync
- NGO/MFI partner management
- Full audit compliance
- Real-time notifications
