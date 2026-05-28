# Splitwise MVP 💰

A simple expense-splitting application for groups, built as a 3-day MVP project.

![React](https://img.shields.io/badge/React-18-blue)
![Express](https://img.shields.io/badge/Express-4-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## Features ✨

- **User Authentication** - Signup/login with JWT
- **Create Groups** - Organize expenses by groups (roommates, trips, etc.)
- **Add Expenses** - Track who paid and split equally
- **View Balances** - See who owes whom in each group and overall
- **Settle Up** - Record payments to settle balances
- **Dashboard** - Overview of all balances and recent activity
- **Mobile-First** - Responsive design for all devices

## Tech Stack 🛠️

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API for state

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Quick Start 🚀

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API URL

# Run development server
npm run dev
```

### Backend Setup

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Run development server
npm run dev
```

## Project Structure 📁

```
splitwise-mvp/
├── src/                    # Frontend (React)
│   ├── components/
│   │   ├── common/         # Reusable UI components
│   │   └── layout/         # Layout components
│   ├── context/            # React Context (Auth)
│   ├── pages/              # Page components
│   ├── services/           # API service
│   └── utils/              # Utility functions
│
├── server/                 # Backend (Express)
│   └── src/
│       ├── config/         # Database config
│       ├── controllers/    # Route handlers
│       ├── middleware/     # Auth, error handling
│       ├── models/         # Mongoose models
│       └── routes/         # API routes
│
├── AI_CONTEXT.md          # Project documentation
├── BUILD_PLAN.md          # Implementation plan
└── README.md
```

## API Endpoints 📡

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/groups | Get user's groups |
| POST | /api/groups | Create group |
| GET | /api/groups/:id | Get group details |
| POST | /api/groups/:id/members | Add member |
| POST | /api/expenses | Add expense |
| GET | /api/expenses/group/:id | Get group expenses |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/balances/group/:id | Get group balances |
| GET | /api/balances/global | Get overall balances |
| POST | /api/settlements | Record settlement |
| GET | /api/settlements/history | Get settlement history |

## Environment Variables 🔐

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## Deployment 🌐

### Frontend to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy

### Backend to Render
1. Push to GitHub
2. Create Web Service in Render
3. Set root directory to `server`
4. Add environment variables
5. Deploy

See [server/README.md](./server/README.md) for detailed backend deployment instructions.

## Currency 💵

This app uses **Indian Rupees (₹)** throughout the UI.

## Known Limitations ⚠️

- No real-time updates (refresh to see changes)
- No expense editing (delete and re-add)
- No debt simplification algorithm
- Equal split only (no custom amounts)
- Single currency (INR)

## License 📄

MIT
