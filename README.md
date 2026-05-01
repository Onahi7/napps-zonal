# NAPPS North Central Zone Portal

> Official portal for private school proprietors across Benue, Kogi, Kwara, Niger, Nasarawa, Plateau & FCT.

**MOU Partners:**
- NAPPS North Central Zonal Executive Council
- Pre Campus College Schs Ltd
- Pre Campus College Computers

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [Tech Stack](#tech-stack)
5. [Installation & Setup](#installation--setup)
6. [Database Setup](#database-setup)
7. [User Roles & Access](#user-roles--access)
8. [Feature Documentation](#feature-documentation)
9. [File Structure](#file-structure)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

The NAPPS North Central Zone Portal is a comprehensive data capturing and monitoring system designed for the National Association of Proprietors of Private Schools (NAPPS) North Central Zone in Nigeria.

### Problem Statement
Unlike the National NAPPS system where individuals register online from home (resulting in low payment compliance), this zonal portal implements a **field-based approach**:
- Teams physically visit schools across all 7 states
- Payment is collected FIRST before any form is filled
- Hard copy backups are mandatory for network failure scenarios
- States become "active" on the portal only when the team reaches them

### Key Differentiators
| National System | North Central Zonal System |
|----------------|---------------------------|
| Individual fills form online | Team reaches out before payment |
| Payment after form | Payment FIRST, then form |
| Low payment compliance | High compliance (payment first) |
| No field presence | Physical team visits all states |

---

## Key Features

### 1. Payment-First Registration
- **No form access without payment** - Users must pay ₦20,500 first
- Payment generates a token valid for 7 days
- Token is used to access the registration form
- Prevents incomplete registrations

### 2. State Activation System
- States start as "inactive" on the portal
- Zonal President activates a state when the team reaches it
- Only active states show in registration
- Visual indicators for state status

### 3. Zonal President Dashboard
- View all 7 states (Benue, Kogi, Kwara, Niger, Nasarawa, Plateau, FCT)
- Real-time financial tracking at zonal level
- Revenue breakdown: Local, State, Zonal, National dues
- Monitor payment status across all states
- Activate states as team progresses

### 4. State Chairman Dashboard
- Each State Chairman has access to their state only
- Monitor all schools in their state
- Track member financial status
- View payment completion rates
- Export school data

### 5. QR Code ID Card Verification
- Each school gets a unique QR code
- QR code links to: `https://domain.com/verify?id=SCHOOL_ID`
- Scanning shows school details, proprietor, payment status
- Quick verification for authorized personnel

### 6. Offline/Hard Copy Backup
- Generate PDF backups when network fails
- Print hard copy registration forms on-site
- Manual filling when internet is unavailable
- Upload data later when network restores

### 7. Financial Tracking
- Real-time revenue at National, Zonal, State levels
- Automatic calculation of deductions:
  - National: ₦1,500 (system maintenance)
  - Zonal: ₦500 (coordination)
  - State: ₦1,000 (ICT operations)
- Net to NAPPS: ₦17,500 per school

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│  - PaymentFirstRegister (Payment → Token → Form)          │
│  - ZonalPresidentDashboard (Zone overview)                 │
│  - StateChairmanDashboard (State monitoring)               │
│  - SchoolVerification (QR code destination)                │
│  - OfflineBackup (PDF/Hard copy generation)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Backend                       │
│  - PostgreSQL Database                                    │
│  - Authentication (Admin users)                           │
│  - Row Level Security (RLS)                              │
│  - Database Functions (activation, tokens, verification)  │
│  - Views (financial_summary, zonal_financial_summary)     │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Payment Gateway (Opay)                    │
│  - Collect ₦20,500 per school                            │
│  - Callback verification                                  │
│  - Receipt generation                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (fast HMR)
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router DOM** - Routing
- **TanStack Query** - Data fetching/caching
- **jsPDF** - PDF generation
- **qrcode.react** - QR code generation

### Backend
- **Supabase** (PostgreSQL + Auth + Realtime)
- **PostgreSQL** - Database
- **Supabase Auth** - Admin authentication
- **Supabase RLS** - Security

### Payment
- **Opay** - Payment gateway (Nigeria)

---

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/Onahi7/napps-zonal.git
cd napps-zonal
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Variables
Create `.env` file in root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPAY_API_KEY=your_opay_api_key
VITE_OPAY_MERCHANT_ID=your_merchant_id
VITE_API_BASE_URL=https://your-api.com/api/v1
```

### Step 4: Database Setup
Follow the [Database Setup](#database-setup) section below.

### Step 5: Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173`

---

## Database Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key to `.env`

### Step 2: Run Base Schema
1. Go to Supabase SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Run the SQL

### Step 3: Run Update Schema
1. Copy contents of `supabase/schema-update.sql`
2. Run the SQL

This creates:
- `states` table (Benue, Kogi, Kwara, Niger, Nasarawa, Plateau, FCT)
- `admin_users` table (for Zonal President & State Chairmen)
- `registration_tokens` table (payment-first flow)
- `financial_summary` view (state-wise revenue)
- `zonal_financial_summary` view (zone-wide revenue)
- Helper functions for activation, tokens, verification

### Step 4: Create Admin Users
```sql
-- Zonal President
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('zonal@napps-northcentral.com', 'password123', 'zonal_president');

-- State Chairmen (repeat for each state)
INSERT INTO admin_users (email, password_hash, role, state) VALUES
  ('benue@napps-northcentral.com', 'password123', 'state_chairman', 'Benue'),
  ('kogi@napps-northcentral.com', 'password123', 'state_chairman', 'Kogi'),
  ('kwara@napps-northcentral.com', 'password123', 'state_chairman', 'Kwara'),
  ('niger@napps-northcentral.com', 'password123', 'state_chairman', 'Niger'),
  ('nasarawa@napps-northcentral.com', 'password123', 'state_chairman', 'Nasarawa'),
  ('plateau@napps-northcentral.com', 'password123', 'state_chairman', 'Plateau'),
  ('fct@napps-northcentral.com', 'password123', 'state_chairman', 'FCT');
```

**⚠️ IMPORTANT:** In production, hash passwords using bcrypt/argon2!

### Step 5: Activate States
When the physical team reaches a state:
```sql
SELECT activate_state('Benue', null);
-- Or manually:
UPDATE states SET is_active = true, activated_at = NOW() WHERE name = 'Benue';
```

---

## User Roles & Access

### 1. Public Users (School Proprietors)
| Feature | Access |
|---------|--------|
| View portal homepage | ✅ |
| Make payment (₦20,500) | ✅ |
| Fill registration form (after payment) | ✅ |
| Download receipt | ✅ |
| View school verification | ✅ |

**Registration Flow:**
1. Visit `/register`
2. Enter email, phone, state
3. Make payment (₦20,500)
4. Receive token via email/phone
5. Use token to access form
6. Complete registration
7. Receive School ID (NC-XXXXXXXX)

### 2. State Chairman
| Feature | Access |
|---------|--------|
| Login at `/state-chairman` | ✅ |
| View only their state's data | ✅ |
| Monitor all schools in state | ✅ |
| Track payment status | ✅ |
| View financial summary | ✅ |
| Export school data | ✅ |

### 3. Zonal President
| Feature | Access |
|---------|--------|
| Login at `/zonal-president` | ✅ |
| View all 7 states | ✅ |
| Activate states | ✅ |
| Zone-wide financial tracking | ✅ |
| Revenue breakdown (all levels) | ✅ |
| Monitor all chairmen | ✅ |

### 4. Super Admin
| Feature | Access |
|---------|--------|
| Login at `/admin` | ✅ |
| Manage all proprietors | ✅ |
| Manage all schools | ✅ |
| Configure fees | ✅ |
| Manage chapters | ✅ |
| View all payments | ✅ |
| Import/Export data | ✅ |

---

## Feature Documentation

### Payment-First Registration
**Location:** `src/pages/PaymentFirstRegister.tsx`

**Flow:**
```
User → Payment Page → Make Payment → Payment Verified 
     → Token Generated → Token Used → Form Access → Submit Form
```

**Dues Breakdown (₦20,500 total):**
- Local Dues: ₦6,000
- State Dues: ₦4,000
- Zonal Dues: ₦2,000
- National Dues: ₦5,000
- ID Card: ₦3,500

**Deductions (₦3,000 total):**
- National (system maintenance): ₦1,500
- Zonal (coordination): ₦500
- State (ICT operations): ₦1,000

**Net to NAPPS:** ₦17,500 per school

### QR Code Verification
**Location:** `src/components/SchoolQRCode.tsx`
**Verification Page:** `src/pages/SchoolVerification.tsx`

QR code contains URL: `https://domain.com/verify?id=NC-XXXXXXXX`

**Scanning shows:**
- School Name & ID
- Proprietor Name
- Location (State, LGA, Chapter)
- School Type
- Payment Status
- Registration Date

### Offline Backup System
**Location:** `src/pages/OfflineBackup.tsx`

**Use Case:** When network fails during on-site registration

**Features:**
1. Search school by ID
2. Generate PDF backup
3. Print hard copy form
4. Fill manually on-site
5. Upload data later when network restores

### State Activation
**Location:** `src/pages/ZonalPresidentDashboard.tsx`

**Process:**
1. Zonal President logs in
2. Views all states (inactive by default)
3. When team reaches a state, clicks "Activate State"
4. State becomes active on portal
5. Registration opens for that state

---

## File Structure

```
napps-zonal/
├── src/
│   ├── components/
│   │   ├── Layout.tsx                    # Main layout with nav/footer
│   │   ├── SchoolQRCode.tsx             # QR code generator
│   │   ├── ui/                           # shadcn/ui components
│   │   ├── admin/                        # Admin components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── pages/
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── ProprietorsPage.tsx
│   │   │       ├── PaymentsPage.tsx
│   │   │       └── ...
│   │   └── registration/                 # Registration steps
│   │       ├── Step1PersonalInfo.tsx
│   │       ├── Step2SchoolInfo.tsx
│   │       └── Step3PaymentInfo.tsx
│   ├── pages/
│   │   ├── Index.tsx                     # Homepage
│   │   ├── PaymentFirstRegister.tsx      # NEW: Payment-first flow
│   │   ├── ZonalPresidentDashboard.tsx   # NEW: Zonal overview
│   │   ├── StateChairmanDashboard.tsx    # NEW: State monitoring
│   │   ├── SchoolVerification.tsx        # NEW: QR verification
│   │   ├── OfflineBackup.tsx            # NEW: Offline backups
│   │   ├── Admin.tsx                     # Super admin
│   │   ├── ProprietorDashboard.tsx
│   │   ├── ProprietorLogin.tsx
│   │   ├── DuesPayment.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── supabase.ts                   # Supabase client
│   │   ├── supabase-service.ts          # Database operations
│   │   ├── id-generator.ts              # School ID generator
│   │   └── northCentralLgas.ts          # LGA data
│   ├── constants/
│   │   └── north-central-config.ts      # Config & dues structure
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── App.tsx                          # Routing
│   └── main.tsx
├── supabase/
│   ├── schema.sql                       # Base schema
│   └── schema-update.sql                # NEW: Updates for all features
├── public/
│   └── logo.png
├── DATABASE_SETUP.md                    # NEW: DB setup guide
├── README.md                            # This file
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPAY_API_KEY`
   - `VITE_OPAY_MERCHANT_ID`
5. Deploy

### Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables
6. Deploy

### Build for Production
```bash
npm run build
# Output in dist/ folder
```

---

## Troubleshooting

### Issue: "Quality Venture Home" still showing
**Solution:** Updated in commit `eebf3eb`. Check:
- `src/components/Layout.tsx` line 196
- `src/constants/north-central-config.ts` lines 3, 46

### Issue: States not showing as active
**Solution:**
```sql
SELECT * FROM states;
UPDATE states SET is_active = true WHERE name = 'StateName';
```

### Issue: Registration token not working
**Solution:**
```sql
SELECT * FROM registration_tokens WHERE token = 'TOKEN';
-- Check is_used = false and expires_at > NOW()
```

### Issue: Payment verification failing
**Solution:**
1. Check Opay callback URL in dashboard
2. Verify `VITE_OPAY_API_KEY` is correct
3. Check Supabase `payments` table for status

### Issue: QR code not verifying
**Solution:**
1. Check `/verify?id=SCHOOL_ID` route exists
2. Verify `get_school_public_info` function works
3. Check school_id format (NC-XXXXXXXX)

### Issue: Build fails
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Database functions not found
**Solution:**
Run `supabase/schema-update.sql` in Supabase SQL Editor

---

## Payment Structure Summary

```
Total Dues: ₦20,500
├── Local Dues:    ₦6,000
├── State Dues:    ₦4,000
├── Zonal Dues:    ₦2,000
├── National Dues: ₦5,000
└── ID Card:       ₦3,500

Deductions: ₦3,000
├── National: ₦1,500 (system maintenance)
├── Zonal:    ₦500  (coordination)
└── State:    ₦1,000 (ICT operations)

Net to NAPPS: ₦17,500 per school
```

---

## API Endpoints (If using custom backend)

Base URL: `https://api.nappsnasarawa.com/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/admin/login` | POST | Admin login |
| `/proprietors` | GET | List proprietors |
| `/schools` | GET | List schools |
| `/payments` | GET | List payments |
| `/states/activate` | POST | Activate a state |

---

## Security Considerations

1. **Password Hashing:** Never store plain text passwords (use bcrypt)
2. **Row Level Security:** Enable RLS on all tables
3. **HTTPS Only:** Always use HTTPS in production
4. **Environment Variables:** Never commit `.env` to git
5. **Payment Verification:** Always verify callback from Opay
6. **Token Expiry:** Registration tokens expire in 7 days
7. **Rate Limiting:** Implement on API endpoints

---

## Future Enhancements

- [ ] SMS notifications (payment confirmation, registration complete)
- [ ] Email notifications with PDF receipts
- [ ] Mobile app for on-site registration
- [ ] Biometric verification for proprietors
- [ ] Integration with National NAPPS database
- [ ] Multi-language support (English, Hausa, Yoruba, Igbo)
- [ ] Advanced analytics and reporting
- [ ] Bulk registration for school chains

---

## License

This project is proprietary software owned by NAPPS North Central Zone.

**Developed by:**
- Pre Campus College Schs Ltd
- Pre Campus College Computers

**MOU Date:** May 1, 2026

---

## Contact

- **Email:** info@napps-northcentral.com
- **Phone:** +234 801 234 5678
- **Address:** North Central Zonal Secretariat

---

## Changelog

### Version 1.0.0 (May 2026)
- Initial release
- Payment-first registration
- State activation system
- Zonal President Dashboard
- State Chairman Dashboard
- QR code verification
- Offline backup system
- Removed "Quality Venture Home" references
- Updated MOU to include Pre Campus College Schs Ltd

---

**Last Updated:** May 1, 2026
