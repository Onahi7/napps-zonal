# NAPPS North Central Zone - Database Setup Guide

## Overview
This guide explains how to set up the database for the NAPPS North Central Zone portal with all the new features:
- State activation system
- Payment-first registration flow
- Zonal President and State Chairman dashboards
- Financial tracking at all levels
- QR code verification

## Prerequisites
- Supabase project set up
- Access to Supabase SQL editor

## Step 1: Run the Base Schema
Run the contents of `supabase/schema.sql` in your Supabase SQL editor first.

## Step 2: Run the Update Schema
Run the contents of `supabase/schema-update.sql` to add:
- States table with activation status
- Admin users table for Zonal President and State Chairmen
- Registration tokens for payment-first flow
- Financial summary views
- Helper functions

## Step 3: Create Admin Users
After running the schema, insert admin users for testing:

```sql
-- Insert Zonal President (replace with actual email/password)
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('zonal@napps-northcentral.com', 'your_password_here', 'zonal_president');

-- Insert State Chairmen (one for each state)
INSERT INTO admin_users (email, password_hash, role, state) VALUES
  ('benue@napps-northcentral.com', 'password123', 'state_chairman', 'Benue'),
  ('kogi@napps-northcentral.com', 'password123', 'state_chairman', 'Kogi'),
  ('kwara@napps-northcentral.com', 'password123', 'state_chairman', 'Kwara'),
  ('niger@napps-northcentral.com', 'password123', 'state_chairman', 'Niger'),
  ('nasarawa@napps-northcentral.com', 'password123', 'state_chairman', 'Nasarawa'),
  ('plateau@napps-northcentral.com', 'password123', 'state_chairman', 'Plateau'),
  ('fct@napps-northcentral.com', 'password123', 'state_chairman', 'FCT');
```

**Note:** In production, use proper password hashing (bcrypt/argon2).

## Step 4: Activate States
When the physical team reaches a state, activate it:

```sql
-- Activate a state (e.g., when team reaches Benue)
SELECT activate_state('Benue', null);

-- Or manually:
UPDATE states SET is_active = true, activated_at = NOW() WHERE name = 'Benue';
```

## Step 5: Configure Environment Variables
Update your `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPAY_API_KEY=your_opay_api_key
VITE_OPAY_MERCHANT_ID=your_merchant_id
VITE_API_BASE_URL=https://your-api-url.com/api/v1
```

## Database Schema Overview

### New Tables
1. **states** - Tracks state activation status
2. **admin_users** - Zonal President and State Chairman accounts
3. **registration_tokens** - Links payments to registration forms

### Updated Tables
1. **payments** - Added fields for registration completion tracking
2. **schools** - Added fields for ID card status and QR code
3. **proprietors** - Added role and verification fields

### Views
1. **financial_summary** - State-wise financial data
2. **zonal_financial_summary** - Zone-wide financial overview

### Functions
1. **activate_state()** - Activate a state
2. **generate_registration_token()** - Create token after payment
3. **get_school_public_info()** - Get school data for QR verification

## Payment-First Flow

1. User visits `/register`
2. User enters email, phone, state and makes payment
3. Payment is recorded with status 'pending'
4. After payment confirmation, a registration token is generated
5. User uses token to access the registration form
6. Form submission links to the payment record

## QR Code Verification

Each school gets a QR code that links to:
```
https://your-domain.com/verify?id=SCHOOL_ID
```

The verification page shows:
- School name and ID
- Proprietor name
- Location (State, LGA, Chapter)
- Payment status
- Registration date

## Offline Backup

The `/offline-backup` page allows generating:
1. PDF backups of school data
2. Hard copy forms for manual filling
3. Print-ready verification pages

## Troubleshooting

### Issue: States not showing as active
- Check the `states` table: `SELECT * FROM states;`
- Activate state: `UPDATE states SET is_active = true WHERE name = 'StateName';`

### Issue: Registration token not working
- Check token expiry: `SELECT * FROM registration_tokens WHERE token = 'TOKEN';`
- Tokens expire in 7 days

### Issue: Financial summary not updating
- The views update automatically
- Check payments status is 'completed'
- Run: `SELECT * FROM financial_summary;`

## Security Notes

1. In production, implement proper authentication for admin users
2. Use Supabase Auth or JWT tokens
3. Hash passwords properly (don't store plain text)
4. Set up Row Level Security (RLS) policies
5. Restrict admin user creation to super admins only

## MOU Update

The system now reflects the updated MOU between:
- NAPPS North Central Zonal Executive Council
- Pre Campus College Schs Ltd
- Pre Campus College Computers

Removed "Quality Venture Home" from all references.
