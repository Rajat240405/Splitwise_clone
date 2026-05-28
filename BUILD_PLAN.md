# BUILD_PLAN.md — 3-Day Implementation Plan

> **Project:** Splitwise MVP
> **Timeline:** 3 Days
> **Work Style:** Incremental, testable chunks

---

## 📅 Day 1: Foundation & Authentication

### Morning: Project Setup (2-3 hours)

#### Task 1.1: Backend Setup
- [ ] Initialize Node.js project
- [ ] Install dependencies: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv
- [ ] Create folder structure (MVC pattern)
- [ ] Setup Express server with middleware
- [ ] Connect to MongoDB Atlas
- [ ] Create error handler middleware

**Deliverable:** Backend server running on localhost:5000

#### Task 1.2: Database Models
- [ ] Create User model (name, email, password, timestamps)
- [ ] Create Group model (name, members, createdBy, timestamps)
- [ ] Create Expense model (groupId, description, amount, paidBy, splitAmong, timestamps)
- [ ] Create Settlement model (groupId, paidBy, paidTo, amount, timestamps)

**Deliverable:** All 4 Mongoose models with validation

#### Task 1.3: Frontend Setup
- [ ] Verify Vite + React + Tailwind setup
- [ ] Create folder structure
- [ ] Setup Axios instance with base URL
- [ ] Create AuthContext for global auth state
- [ ] Create basic types/interfaces

**Deliverable:** Frontend structure ready

---

### Afternoon: Authentication System (3-4 hours)

#### Task 1.4: Auth Backend
- [ ] Create authController (register, login, getMe)
- [ ] Implement password hashing with bcrypt
- [ ] Implement JWT token generation
- [ ] Create auth middleware for protected routes
- [ ] Setup auth routes

**API Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me (protected)
```

#### Task 1.5: Auth Frontend
- [ ] Create LoginPage with form
- [ ] Create SignupPage with form
- [ ] Implement AuthContext with login/logout/signup functions
- [ ] Create PrivateRoute component
- [ ] Setup React Router with public/private routes
- [ ] Handle token storage in localStorage

**Deliverable:** Complete auth flow working

---

### Evening: Layout & Navigation (1-2 hours)

#### Task 1.6: UI Shell
- [ ] Create Layout component with mobile-first design
- [ ] Create Navbar component
- [ ] Create BottomNav for mobile
- [ ] Create common components (Button, Input, Card)
- [ ] Setup basic styling/theme

**Deliverable:** App shell with navigation

---

## 📅 Day 2: Core Features (Groups + Expenses + Balances)

### Morning: Groups Feature (3-4 hours)

#### Task 2.1: Groups Backend
- [ ] Create groupController (create, getAll, getOne, addMember, removeMember)
- [ ] Implement member validation (must exist by email)
- [ ] Setup group routes with auth middleware

**API Endpoints:**
```
POST   /api/groups
GET    /api/groups
GET    /api/groups/:id
POST   /api/groups/:id/members
DELETE /api/groups/:id/members/:userId
```

#### Task 2.2: Groups Frontend
- [ ] Create GroupsPage (list all groups)
- [ ] Create CreateGroupPage (form with member emails)
- [ ] Create GroupCard component
- [ ] Create GroupDetailPage (shell for now)
- [ ] Add "Add Member" modal in GroupDetail

**Deliverable:** Users can create groups and add members

---

### Afternoon: Expenses Feature (3-4 hours)

#### Task 2.3: Expenses Backend
- [ ] Create expenseController (create, getByGroup, getRecent, delete)
- [ ] Validate users are group members
- [ ] Setup expense routes

**API Endpoints:**
```
POST   /api/expenses
GET    /api/expenses/group/:groupId
GET    /api/expenses/recent
DELETE /api/expenses/:id
```

#### Task 2.4: Expenses Frontend
- [ ] Create AddExpensePage (description, amount, payer dropdown, split checkboxes)
- [ ] Create ExpenseCard component
- [ ] Create ExpenseList component
- [ ] Integrate into GroupDetailPage
- [ ] Add delete functionality

**Deliverable:** Users can add/view/delete expenses

---

### Evening: Balance Calculation (2-3 hours)

#### Task 2.5: Balances Backend
- [ ] Create balanceController (getGroupBalances, getGlobalBalances)
- [ ] Implement pairwise balance calculation algorithm
- [ ] Consider settlements in calculation
- [ ] Setup balance routes

**API Endpoints:**
```
GET /api/balances/group/:groupId
GET /api/balances/global
```

#### Task 2.6: Balances Frontend
- [ ] Create BalanceCard component
- [ ] Create BalanceSummary component
- [ ] Show balances in GroupDetailPage
- [ ] Show "You owe" / "You are owed" indicators

**Deliverable:** Accurate balance display per group

---

## 📅 Day 3: Settlements, Dashboard & Polish

### Morning: Settlements Feature (2-3 hours)

#### Task 3.1: Settlements Backend
- [ ] Create settlementController (create, getByGroup, getHistory)
- [ ] Setup settlement routes

**API Endpoints:**
```
POST /api/settlements
GET  /api/settlements/group/:groupId
GET  /api/settlements/history
```

#### Task 3.2: Settlements Frontend
- [ ] Create SettleUpPage (select person, enter amount)
- [ ] Create SettlementHistoryPage
- [ ] Create SettlementCard component
- [ ] Add "Settle Up" button in GroupDetailPage
- [ ] Integrate settlement history

**Deliverable:** Users can record settlements

---

### Afternoon: Dashboard & Integration (2-3 hours)

#### Task 3.3: Dashboard Page
- [ ] Implement DashboardPage
- [ ] Show global balance summary (total owed/owing)
- [ ] Show recent expenses across all groups
- [ ] Show quick links to groups
- [ ] Add "Add Expense" quick action

**Deliverable:** Functional dashboard

#### Task 3.4: Integration & Bug Fixes
- [ ] Test all flows end-to-end
- [ ] Fix any balance calculation bugs
- [ ] Ensure navigation works correctly
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Add empty state messages

**Deliverable:** Stable, bug-free app

---

### Evening: UI Polish & Deployment (2-3 hours)

#### Task 3.5: UI Polish
- [ ] Refine mobile responsiveness
- [ ] Add proper spacing and typography
- [ ] Add loading spinners
- [ ] Add success/error toasts
- [ ] Ensure ₹ symbol displays correctly
- [ ] Test on mobile viewport

#### Task 3.6: Deployment
- [ ] Deploy backend to Render
  - Set environment variables
  - Test API endpoints
- [ ] Deploy frontend to Vercel
  - Set VITE_API_URL to Render URL
  - Test production build
- [ ] Final end-to-end testing on production

**Deliverable:** Live, deployed application

---

## 🧪 Testing Checklist

### Auth Flow
- [ ] Can register new user
- [ ] Can login with correct credentials
- [ ] Shows error for wrong credentials
- [ ] Stays logged in on refresh
- [ ] Can logout

### Groups Flow
- [ ] Can create group
- [ ] Can add member by email
- [ ] Shows error for non-existent email
- [ ] Can view group details
- [ ] Can see all members

### Expenses Flow
- [ ] Can add expense with description, amount
- [ ] Can select payer
- [ ] Can select who to split among
- [ ] Expense appears in list
- [ ] Can delete expense
- [ ] Balances update after add/delete

### Settlements Flow
- [ ] Can settle with another user
- [ ] Settlement appears in history
- [ ] Balances update after settlement

### Dashboard Flow
- [ ] Shows global balance summary
- [ ] Shows recent expenses
- [ ] Can navigate to groups

---

## 🚨 Risk Mitigation

| Risk | Mitigation |
|------|------------|
| MongoDB connection issues | Test connection early, have Atlas setup ready |
| CORS errors | Configure properly from start |
| Balance calculation bugs | Test with simple cases first |
| Deployment issues | Deploy early (Day 2 evening), iterate |
| Time overrun | Cut settlement history if needed |

---

## 📋 Priority Order (If Time Runs Short)

**Must Have (Core MVP):**
1. Auth (login/signup)
2. Create/view groups
3. Add/view expenses
4. View balances

**Should Have:**
5. Delete expenses
6. Add group members
7. Dashboard
8. Settle balances

**Nice to Have:**
9. Settlement history
10. Polish animations
11. Better error handling

---

## 🎯 Success Criteria

By end of Day 3:
- [x] User can sign up and login
- [x] User can create a group and add members
- [x] User can add expenses to a group
- [x] User can see who owes whom in a group
- [x] User can settle balances
- [x] Dashboard shows summary
- [ ] App is deployed and accessible
- [x] App works on mobile

---

## ✅ Implementation Complete!

**Frontend:** All pages and components implemented
- Login/Signup pages with form validation
- Dashboard with balance summary
- Groups list and detail pages
- Add expense flow
- Settle up flow
- Settlement history
- Responsive mobile-first design

**Backend:** Full API implemented
- Auth endpoints with JWT
- Groups CRUD with member management
- Expenses CRUD
- Settlements CRUD
- Balance calculation algorithm

**Next Step:** Deploy to Vercel (frontend) and Render (backend)
