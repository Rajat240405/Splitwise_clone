# AI_CONTEXT.md — Splitwise MVP

> **Last Updated:** Session Start
> **Status:** Planning Phase
> **Single Source of Truth for all product and engineering decisions**

---

## 📋 Project Overview

**Project:** Splitwise Clone MVP
**Timeline:** 3 Days
**Goal:** A simple expense-splitting app for groups to track shared expenses and balances

---

## 👥 User Personas

| Persona | Description | Primary Need |
|---------|-------------|--------------|
| College Students | Splitting food, supplies, subscriptions | Quick expense entry |
| Roommates | Rent, utilities, groceries | Monthly balance tracking |
| Friend Groups | Dinners, outings, gifts | Fair splitting |
| Travel Groups | Trip expenses, shared bookings | Group-based tracking |

---

## 🎯 Core User Action

> **"Add an expense and instantly see updated balances showing who owes whom."**

This is the north star for all UX decisions.

---

## ✅ MVP Scope (In Scope)

| Feature | Details |
|---------|---------|
| User Signup/Login | Name, email, password. JWT auth. |
| Create Groups | Name + add members by email |
| Add Members | Must be registered users, added by email |
| Add Expenses | Single payer, equal split among selected participants |
| Delete Expenses | Allowed (no edit for MVP) |
| View Balances | Per-group AND global summary on dashboard |
| Settle Balances | One-sided (immediate, no confirmation) |
| Dashboard | Recent expenses + global balance summary |
| Settlement History | Record of all settlements |
| Responsive UI | Mobile-first design |

---

## 🚫 Out of Scope (MVP)

- Real payments integration
- Push/email notifications
- OCR receipt scanning
- Google/social auth
- Email verification system
- Multi-currency support
- Expense categories/tags
- Charts/analytics
- Expense editing
- Debt simplification algorithm
- Real-time updates (WebSocket)
- Two-sided settlement confirmation

---

## 🔧 Technical Decisions

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js (MVC) |
| Database | MongoDB Atlas |
| Auth | JWT (stored in localStorage) |
| HTTP Client | Axios |
| State Management | React Context (auth only) |
| Deployment | Vercel (FE) + Render (BE) |

### Architecture Style
- REST APIs only
- Modular Express with MVC structure
- Clean folder structure
- Beginner-friendly but production-structured

### Currency
- **Indian Rupee (₹)** throughout the UI

---

## 📊 Data Model (MongoDB Schemas)

### User
```javascript
{
  _id: ObjectId,
  name: String,           // Full name
  email: String,          // Unique, lowercase
  password: String,       // Hashed with bcrypt
  createdAt: Date
}
```

### Group
```javascript
{
  _id: ObjectId,
  name: String,
  members: [ObjectId],    // References to User
  createdBy: ObjectId,    // Reference to User
  createdAt: Date
}
```

### Expense
```javascript
{
  _id: ObjectId,
  groupId: ObjectId,      // Reference to Group
  description: String,
  amount: Number,         // Total amount in rupees
  paidBy: ObjectId,       // User who paid
  splitAmong: [ObjectId], // Users sharing the expense (includes payer)
  createdBy: ObjectId,    // Who created the record
  createdAt: Date
}
```

### Settlement
```javascript
{
  _id: ObjectId,
  groupId: ObjectId,      // Reference to Group
  paidBy: ObjectId,       // User who paid (settler)
  paidTo: ObjectId,       // User who received
  amount: Number,
  createdAt: Date
}
```

---

## 🔄 Balance Calculation Logic

### Per-Group Balance Algorithm
```
For each expense in group:
  splitAmount = expense.amount / expense.splitAmong.length
  
  For each user in splitAmong:
    if user !== paidBy:
      user owes paidBy += splitAmount

For each settlement in group:
  paidBy's debt to paidTo -= settlement.amount

Net balance = sum of what others owe you - sum of what you owe others
```

### Global Balance (Dashboard)
- Aggregate pairwise balances across ALL groups
- Show "You owe ₹X overall" or "You are owed ₹X overall"

### Pairwise Display
- Simple pairwise balances (NO debt simplification)
- Example: "You owe Alice ₹500", "Bob owes you ₹200"

---

## 🛣️ API Routes

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create new user |
| POST | `/login` | Login, return JWT |
| GET | `/me` | Get current user (protected) |

### Group Routes (`/api/groups`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create group |
| GET | `/` | Get user's groups |
| GET | `/:id` | Get group details |
| POST | `/:id/members` | Add member by email |
| DELETE | `/:id/members/:userId` | Remove member |

### Expense Routes (`/api/expenses`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create expense |
| GET | `/group/:groupId` | Get group expenses |
| GET | `/recent` | Get user's recent expenses |
| DELETE | `/:id` | Delete expense |

### Settlement Routes (`/api/settlements`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Record settlement |
| GET | `/group/:groupId` | Get group settlements |
| GET | `/history` | Get user's settlement history |

### Balance Routes (`/api/balances`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/group/:groupId` | Get group balances |
| GET | `/global` | Get global balance summary |

---

## 📱 UI Screens & Routes

| Route | Screen | Description |
|-------|--------|-------------|
| `/login` | Login | Email + password form |
| `/signup` | Signup | Name + email + password form |
| `/` | Dashboard | Recent expenses + global balances |
| `/groups` | Group List | All user's groups |
| `/groups/new` | Create Group | Name + add members |
| `/groups/:id` | Group Detail | Expenses + balances + members |
| `/groups/:id/expense/new` | Add Expense | Description, amount, payer, split |
| `/groups/:id/settle` | Settle Up | Select who to settle with |
| `/settlements` | Settlement History | All settlement records |

---

## 📁 Folder Structure

### Frontend (`/src`)
```
src/
├── components/
│   ├── common/          # Button, Input, Modal, Card
│   ├── layout/          # Navbar, Layout, BottomNav
│   ├── auth/            # LoginForm, SignupForm
│   ├── groups/          # GroupCard, GroupList, MemberList
│   ├── expenses/        # ExpenseCard, ExpenseForm, ExpenseList
│   ├── balances/        # BalanceCard, BalanceSummary
│   └── settlements/     # SettleForm, SettlementHistory
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── GroupsPage.tsx
│   ├── GroupDetailPage.tsx
│   ├── CreateGroupPage.tsx
│   ├── AddExpensePage.tsx
│   ├── SettleUpPage.tsx
│   └── SettlementHistoryPage.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── api.ts           # Axios instance + API calls
├── utils/
│   └── formatCurrency.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

### Backend (separate repo/folder)
```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── groupController.js
│   │   ├── expenseController.js
│   │   ├── settlementController.js
│   │   └── balanceController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Group.js
│   │   ├── Expense.js
│   │   └── Settlement.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── settlementRoutes.js
│   │   └── balanceRoutes.js
│   └── server.js
├── .env
└── package.json
```

---

## 🚀 Deployment Plan

### Frontend (Vercel)
- Connect GitHub repo
- Set environment variable: `VITE_API_URL`
- Auto-deploy on push

### Backend (Render)
- Connect GitHub repo
- Set environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CORS_ORIGIN` (Vercel URL)
- Web service with auto-deploy

### MongoDB Atlas
- Free tier cluster
- Whitelist Render IPs (or 0.0.0.0/0 for MVP)
- Connection string in Render env vars

---

## ⚖️ Tradeoffs & Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Split type | Equal only | MVP simplicity |
| Debt simplification | Not implemented | Faster delivery, easier debugging |
| Real-time updates | Not implemented | Complexity vs. value |
| Settlement confirmation | One-sided | Simpler UX for MVP |
| Expense editing | Not allowed | Reduces complexity |
| JWT storage | localStorage | Simple, acceptable for MVP |
| Currency | ₹ only | Target audience in India |
| Member addition | By email only | Must be registered |

---

## 🐛 Known Limitations

1. **Security:** JWT in localStorage is vulnerable to XSS
2. **No email verification:** Users can register with any email
3. **No password reset:** Out of scope
4. **Stale data:** Must refresh to see others' changes
5. **No optimistic updates:** UI waits for API response
6. **Single currency:** No conversion support
7. **No expense receipts/images:** Text only

---

## 📝 Implementation Progress

| Phase | Status | Notes |
|-------|--------|-------|
| Planning | ✅ Complete | AI_CONTEXT.md created |
| Build Plan | ✅ Complete | BUILD_PLAN.md created |
| Backend Setup | ✅ Complete | Express server, MongoDB models, middleware |
| Auth System | ✅ Complete | JWT auth, register/login/me endpoints |
| Groups Feature | ✅ Complete | CRUD operations, member management |
| Expenses Feature | ✅ Complete | Create, list, delete expenses |
| Balances Feature | ✅ Complete | Pairwise balance calculation |
| Settlements Feature | ✅ Complete | Record and view settlements |
| Dashboard | ✅ Complete | Global balances, recent activity |
| Frontend Pages | ✅ Complete | All pages implemented |
| UI Components | ✅ Complete | Reusable component library |
| Deployment Docs | ✅ Complete | README with instructions |

---

## 🔗 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

---

*This document will be updated after every major implementation decision.*
