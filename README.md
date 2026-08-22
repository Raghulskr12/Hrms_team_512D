# DAYFLOW — HUMAN RESOURCE MANAGEMENT SYSTEM (HRMS)

> **Tagline:** Every workday, perfectly aligned.

Dayflow is a full-stack, production-ready **Human Resource Management System (HRMS)** built with Next.js App Router, Express.js, TypeScript, PostgreSQL, and Prisma ORM, following the approved dark-themed wireframe and UI/UX design system.

---

## 🚀 Features & Operational Capability

### 🔐 Authentication & Security
- **Role-Based Authorization**: `ADMIN`, `HR`, `EMPLOYEE` strict permission tiers enforced independently on backend Express API endpoints.
- **Public Registration Role Lockdown**: Public registration strictly forces `role = EMPLOYEE`. Administrative (`ADMIN`/`HR`) accounts are restricted to database seed scripts or authorized administrative endpoints.
- **Password Security**: Hashed using bcrypt with 10 salt rounds.
- **JWT Authentication**: Secure token verification middleware (`requireAuth`, `requireAdmin`, `requireHR`, `requireAdminOrHR`).
- **Email Verification Flow**: Token generation and verification.

### 👤 Employee Profile Management
- **5 Tabbed Sections**: Personal Information, Job Details, Bank Remittance Details, Salary Breakdown, and Verification Documents.
- **Bank Details Protection**: Sensitive financial details restricted to the employee or authorized HR/Admin.
- **Document Management**: Local server storage in `backend/uploads/documents/` with authorized REST streaming downloads (`GET /api/documents/:id/download`).

### ⏱️ Attendance Tracking
- **Multi-View Modes**: Daily view table, Weekly breakdown, Monthly aggregation, and Interactive Monthly Calendar Grid.
- **Calendar Popover**: Colored status indicators (Green = Present, Red = Absent, Yellow = Half Day, Purple = Leave, Dark Gray = Weekend). Clicking any day displays punch details.
- **Server-Side Rules**: Unique constraint on `[employeeId, date]`, duplicate check-in / check-out prevention, and automatic server-side worked hours calculation.
- **HR Correction**: Authorized HR/Admin manual attendance record adjustment.

### 🌴 Leave Management & Approval Engine
- **Leave Types**: Paid, Sick, Casual, Unpaid, Bereavement, and Exam Leave (intern eligibility validation).
- **Date & Balance Validation**: Overlapping request check, date ordering check, and remaining balance verification.
- **Atomic Database Transactions**: Approving leave executes a `prisma.$transaction`:
  1. Request status updated to `APPROVED`.
  2. Approver ID and timestamp stored.
  3. `LeaveBalance` updated (`remainingDays` deducted, `usedDays` added).
  4. Working-day `Attendance` logs (Mon-Fri) marked as `LEAVE`.
  5. User `Notification` created.

### 💳 Payroll & Compensation
- **Salary History Support**: Salary model supports effective dates (`effectiveFrom`, `effectiveTo`) tracking compensation changes.
- **Gross & Net Calculation**: Server-side gross salary (`basic + hra + allowances`) and net salary (`gross - deductions`).
- **Role Control**: Employees view only their own salary details; HR/Admin can update salary structures across the workforce.

### 📊 HR Analytics & Operational Reports
- Attendance metrics report.
- Leave distribution report.
- Aggregate payroll financial totals report.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React icons, Native `fetch()` API wrapper.
- **Backend**: Node.js, Express.js, TypeScript, REST APIs, Multer file upload handling.
- **Database & ORM**: PostgreSQL running locally, Prisma ORM.
- **Authentication**: JWT, bcryptjs.
- **Validation**: Zod schema validation.

---

## 📁 Directory Structure

```text
dayflow/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Express route handlers
│   │   ├── middleware/      # Auth & error handling middleware
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Core business logic & transactions
│   │   ├── repositories/    # Prisma data access layer
│   │   ├── validators/      # Zod input schemas
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # JWT, bcrypt, response helpers
│   │   ├── app.ts           # Express setup & CORS
│   │   └── server.ts        # Server entrypoint
│   ├── prisma/
│   │   ├── schema.prisma    # PostgreSQL Prisma schema
│   │   └── seed.ts          # Database seed script
│   ├── tests/               # Jest & Supertest automated test suite
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # UI, layout, attendance, leave, employee components
│   │   ├── context/         # AuthContext
│   │   ├── lib/             # Native fetch API client
│   │   ├── services/        # Centralized frontend API services
│   │   ├── types/           # Shared TypeScript interfaces
│   │   └── utils/
│   ├── public/
│   ├── .env.local           # Local frontend environment
│   ├── .env.local.example
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

---

## 🔑 Demo Login Credentials (Local Development)

The database seed populates realistic datasets and accounts with development password **`Password123!`**:

| Role | Email | Employee ID | Default Password |
|---|---|---|---|
| **ADMIN** | `admin@dayflow.local` | `EMP-001` | `Password123!` |
| **HR** | `hr@dayflow.local` | `EMP-002` | `Password123!` |
| **EMPLOYEE** | `emp1@dayflow.local` | `EMP-003` | `Password123!` |
| **EMPLOYEE** | `emp2@dayflow.local` | `EMP-004` | `Password123!` |
| **EMPLOYEE (Intern)** | `emp5@dayflow.local` | `EMP-007` | `Password123!` |

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js v18+ and npm
- PostgreSQL installed and active on `localhost:5432`

### 1. Database & Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run Prisma Database Migrations
npx prisma migrate dev --name init

# Seed Database with sample accounts and data
npx prisma db seed

# Run Backend Development Server (Port 5000)
npm run dev
```

### 2. Frontend Setup

```bash
# Open a new terminal tab and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js Development Server (Port 3000)
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🧪 Running Automated Backend Tests

```bash
cd backend
npm test
```

The automated test suite verifies:
- User registration (forcing `EMPLOYEE` role) and JWT login.
- Duplicate check-in prevention and worked-hours calculation.
- Leave application validations (balance check, date order check, intern exam leave eligibility).
- Transactional leave approval (status change, balance deduction, attendance marking for working days, and notification generation).

---

## 📜 Role Permission Matrix

| Feature | EMPLOYEE | HR | ADMIN |
| text | text | text | text |
| Own Profile | View / Edit Contact Info | View / Edit | View / Edit |
| Other Profiles | ❌ No | ✅ Yes | ✅ Yes |
| Own Attendance | ✅ Yes | ✅ Yes | ✅ Yes |
| All Attendance | ❌ No | ✅ Yes | ✅ Yes |
| Punch Check In / Out | ✅ Yes | ❌ No / Not required | ❌ No / Not required |
| Apply Leave | ✅ Yes | ✅ Yes | ✅ Yes |
| Approve / Reject Leave | ❌ No | ✅ Yes | ✅ Yes |
| View Own Salary | ✅ Yes | ✅ Yes | ✅ Yes |
| Manage Salaries | ❌ No | ✅ Yes | ✅ Yes |
| View All Employees | ❌ No | ✅ Yes | ✅ Yes |
| View Reports | ❌ No | ✅ Yes | ✅ Yes |
| Notifications | Own Only | Own Only | Own Only |
