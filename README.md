# Splitwise MVP

A full-stack Splitwise-inspired expense sharing application built as part of an internship assignment.

## Live Demo

Frontend URL:

```text id="n7qy1m"
(Add your Vercel URL here)
```

## GitHub Repository

```text id="r2kf9w"
(Add your GitHub repo link here)
```

---

# Features

* User Authentication (JWT)
* Create Groups
* Add Members by Email
* Add Shared Expenses
* Equal Expense Splitting
* Per-Group Balance Tracking
* Global Balance Summary
* Settlement Recording
* Settlement History
* Mobile Responsive UI

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication

---

# Project Structure

```text id="t4pw8s"
splitwise-clone/
├── src/
├── server/
├── AI_CONTEXT.md
├── BUILD_PLAN.md
├── PROMPTS_USED.md
└── README.md
```

---

# Environment Variables

## Frontend

```env id="e3yx6m"
VITE_API_URL=http://localhost:5000/api
```

## Backend

```env id="k9dc2r"
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
```

---

# Local Setup Instructions

## Frontend

```bash id="w1vm4t"
npm install
npm run dev
```

## Backend

```bash id="q6hx8n"
cd server
npm install
npm run dev
```

---

# AI-Assisted Development Workflow

This project was developed using an AI-assisted engineering workflow.

The process included:

* product requirement analysis
* architecture planning
* AI_CONTEXT.md maintenance
* BUILD_PLAN.md planning
* incremental implementation
* manual testing and debugging

AI tools were used as engineering collaborators while maintaining human-guided architectural and product decisions.

---

# Documentation Included

* AI_CONTEXT.md
* BUILD_PLAN.md
* PROMPTS_USED.md

---

# Future Improvements

* Real-time updates
* Expense editing
* Debt simplification
* Dark mode
* Push notifications
* Multi-currency support

---

# Screenshots

(Add screenshots here)

* Login Page
* Dashboard
* Group Details
* Add Expense
* Balances
* Settlement History
