# Supabase Setup Guide for Mkutano

## Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up (GitHub recommended)
3. Create a new project:
   - **Name**: mkutano-prod
   - **Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users (e.g., EU/Asia)
   - **Pricing**: Free tier is fine to start

4. Wait 2-3 minutes for project setup
5. Copy your credentials:
   - **Project URL**: (looks like `https://xxxxx.supabase.co`)
   - **API Key (anon)**: (public key for frontend)
   - **API Key (service role)**: (private key for backend - KEEP SECRET!)
   - **DB Password**: (saved above)

---

## Step 2: Install Supabase Client

```bash
cd "c:\xampp\htdocs\MKUTANO APP"
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

---

## Step 3: Setup Environment Variables

Create `.env.local` in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here

# Backend only (never expose)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database direct connection (for migrations)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_ID.db.supabase.co:5432/postgres
```

---

## Step 4: Run SQL Migrations

### Option A: Via Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Paste the entire content from `SQL_MIGRATIONS.sql` (provided next)
4. Click Run

### Option B: Via psql (Advanced)
```bash
psql -h YOUR_PROJECT_ID.db.supabase.co -U postgres -d postgres < SQL_MIGRATIONS.sql
```

### Option C: Via Supabase CLI (Recommended)
```bash
npm install -g supabase
supabase link --project-ref YOUR_PROJECT_ID
supabase db push
```

---

## Step 5: Enable Row Level Security (RLS)

**CRITICAL FOR MULTI-TENANT APP**

In Supabase Dashboard → Authentication → Policies, enable RLS on all tables:

```sql
-- Secretary can only see their own group's data
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
-- ... (apply to all tables)

-- Secretary RLS Policy Example:
CREATE POLICY "Secretaries can view their own group"
ON groups FOR SELECT
USING (secretary_id = auth.uid());

-- Members can only view their group's data
CREATE POLICY "Members can view their group"
ON members FOR SELECT
USING (group_id IN (
  SELECT id FROM groups 
  WHERE secretary_id = auth.uid() 
  OR id IN (SELECT group_id FROM members WHERE user_id = auth.uid())
));
```

---

## Step 6: Test Connection

Create `lib/supabase.ts` (see next file) and test:

```bash
npm run dev
```

Check browser console - should show Supabase connected ✅

---

## Step 7: Create Storage Buckets (Optional)

For file uploads (reports, documents):

1. Supabase Dashboard → Storage → New Bucket
2. Create buckets:
   - `reports` - for PDF exports
   - `group-documents` - for meeting minutes
   - `user-avatars` - for profile pictures

Set public/private access as needed.

---

## Security Checklist

- [ ] `.env.local` added to `.gitignore`
- [ ] Never commit `SUPABASE_SERVICE_ROLE_KEY`
- [ ] RLS enabled on all tables
- [ ] Policies restrict data by group_id
- [ ] Only anon key in `NEXT_PUBLIC_*`
- [ ] Service role key never in frontend code
- [ ] Firewall rules set in Supabase dashboard

---

## Monitoring & Maintenance

### Check Database Health
- Supabase Dashboard → Database → Health
- Monitor: CPU, connections, storage

### View Logs
- Supabase Dashboard → Logs → Database Logs
- Useful for debugging queries

### Backup Strategy
- Supabase auto-backups daily (free tier)
- Manual backup: Dashboard → Backups → Request one

### Scale Up
When you outgrow free tier (~500MB):
- Delete test data
- Archive old reports
- Upgrade plan to Pro ($25/mo)

---

## Common Issues

### "Connection refused"
- Check credentials in `.env.local`
- Verify project URL matches dashboard
- Check anon key is correct

### "RLS policy blocks query"
- Check auth user is set
- Verify policy matches your auth.uid()
- Use service role key for admin operations

### "Disk quota exceeded"
- Check table sizes: `SELECT pg_size_pretty(pg_total_relation_size(tablename))`
- Archive old data to CSV
- Upgrade plan

### "Auth timeout"
- Check JWT token expiry
- Implement token refresh in `lib/supabase.ts`

---

## Next Steps

1. ✅ Create account & project
2. ✅ Save credentials to `.env.local`
3. ✅ Run SQL migrations
4. ✅ Enable RLS policies
5. → Create `lib/supabase.ts` client
6. → Create database service functions
7. → Connect React components to Supabase
8. → Test offline sync with PWA

---

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js + Supabase](https://supabase.com/docs/guides/platform/quickstarts/nextjs)
- [RLS Examples](https://supabase.com/docs/with-nextjs)

Ready to create the SQL migrations file? 🚀
