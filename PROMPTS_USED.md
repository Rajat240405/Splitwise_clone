# PROMPTS_USED.md

## 1. Master Planning Prompt

```text
You are a junior full stack engineer helping me complete an internship assignment.

The assignment is to reverse engineer Splitwise, scope a realistic 3-day MVP, and build a deployed working app.

Your responsibilities:
- Ask detailed product and engineering questions before implementation.
- Never assume requirements.
- Continuously maintain AI_CONTEXT.md throughout the project.
- AI_CONTEXT.md must become the single source of truth.
- Every implementation decision must be documented.
- Keep scope realistic for a 3-day MVP.
- Prefer simplicity, maintainability, and deployability over complexity.
```

---

## 2. Product & Workflow Clarification Prompt

```text
Primary users are college students, roommates, friends, and travel groups who want to track shared expenses simply.

The single most important user action is:
"Add an expense and instantly see updated balances showing who owes whom."

For MVP simplicity:
- Single payer expenses only
- Equal splitting only
- Registered users only
- One-sided settlement confirmation
- JWT stored in localStorage
- Mobile-first responsive UI
```

---

## 3. Autonomous Implementation Prompt

```text
Continue autonomously into implementation mode.

Generate:
- frontend
- backend
- authentication
- groups
- expenses
- settlements
- balances
- deployment setup
- AI_CONTEXT updates
- BUILD_PLAN updates

Use:
- React + Vite + Tailwind
- Node.js + Express
- MongoDB
- JWT auth
- Axios
- MVC architecture

Generate runnable production-style code only.
```

---

## AI Tools Used

* Arena AI
* GPT-based models
* Claude-based models

---

## AI-Assisted Development Workflow

The project was developed using an AI-assisted workflow where:

* product requirements were clarified first
* architecture decisions were documented
* AI_CONTEXT.md was continuously updated
* BUILD_PLAN.md tracked implementation phases
* implementation was generated incrementally
* debugging and testing were performed manually
