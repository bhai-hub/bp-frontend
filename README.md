# Brownie Points Frontend Application (bp-frontend)

Enterprise Employee Recognition & Rewards Platform Frontend built with Next.js, TypeScript, and Bootstrap 5.

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Framework:** Bootstrap 5.3 & Bootstrap Icons
- **HTTP Client:** Axios with JWT interceptors
- **Styling:** Vanilla CSS design system (Strictly NO Tailwind CSS)

---

## Design System & Architecture

The user interface is engineered as an enterprise-grade SaaS platform:
- **Sharp Geometry:** Pure sharp corners (`border-radius: 0`) across cards, buttons, inputs, tables, and modal dialogs.
- **Enterprise Color Palette:** Clean slate gray surfaces (`#f8fafc`, `#f1f5f9`), crisp white cards (`#ffffff`), and corporate blue accents (`#1d4ed8`).
- **Strict Compliance:** Zero gradients, zero glassmorphism, zero crypto/Web3 terminology, and accessible typography.

---

## Setup & Installation

### 1. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on: `http://localhost:3000`

---

## Portals & Features

1. **Public Landing Page (`/`)**:
   - Navbar with dynamic login status
   - Hero Section: Enterprise recognition overview
   - How It Works: 3-step operational workflow
   - Recognition Engine: Unified currency & multi-tenant isolation
   - Employee Experience: Spendable, Loyalty, and Lifetime balances
   - Company Benefits: Retention, audit readiness, budget controls
   - CTA & Enterprise Footer

2. **Enterprise Sign In (`/login`)**:
   - Quick-Fill Demo Personas (Super Admin, HR Manager, Employee)
   - Role-Based client redirect logic
   - Session persistence in local storage

3. **Super Admin Portal (`/admin`)**:
   - Dashboard: 7 KPI metric cards & organization roster
   - Organizations Directory (`/admin/organizations`): Status toggling & registration
   - Organization Detail (`/admin/organizations/[id]`): BP Account, configurable policy editor, simulated BP purchase, ledger transactions
   - HR Managers (`/admin/hr-managers`): Staff provisioning

4. **HR Operations Portal (`/hr`)**:
   - Dashboard: Workforce counts, BP available pool, recent activity
   - Employees Directory (`/hr/employees`): Employee roster, onboarding, active status switch, and controlled BP credit modal
   - BP Activity Ledger (`/hr/bp-activity`): Complete company ledger
   - Organization Profile (`/hr/organization`): Parameters & policy rules

5. **Employee Portal (`/employee`)**:
   - Dashboard: Spendable, Loyalty, and Lifetime balances & recent awards
   - My BP Wallet (`/employee/my-bp`): Balance rules & tenure unlocking
   - Activity History (`/employee/activity`): Personal points ledger
   - Profile (`/employee/profile`): Contact information editor
