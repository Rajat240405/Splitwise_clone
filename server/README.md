# Splitwise MVP - Backend

Node.js + Express + MongoDB backend for the Splitwise MVP application.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Add your current IP
   - For production (Render): Add `0.0.0.0/0` (allows all IPs)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `splitwise-mvp`

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
```

**.env file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/splitwise-mvp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me (protected)
```

### Groups
```
POST   /api/groups (protected)
GET    /api/groups (protected)
GET    /api/groups/:id (protected)
POST   /api/groups/:id/members (protected)
DELETE /api/groups/:id/members/:userId (protected)
```

### Expenses
```
POST   /api/expenses (protected)
GET    /api/expenses/group/:groupId (protected)
GET    /api/expenses/recent (protected)
DELETE /api/expenses/:id (protected)
```

### Settlements
```
POST /api/settlements (protected)
GET  /api/settlements/group/:groupId (protected)
GET  /api/settlements/history (protected)
```

### Balances
```
GET /api/balances/group/:groupId (protected)
GET /api/balances/global (protected)
```

## Deployment to Render

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" > "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Name:** splitwise-mvp-api
     - **Root Directory:** server
     - **Runtime:** Node
     - **Build Command:** npm install
     - **Start Command:** npm start

3. **Add Environment Variables**
   - MONGODB_URI (your Atlas connection string)
   - JWT_SECRET (your secret key)
   - NODE_ENV=production
   - CORS_ORIGIN (your Vercel frontend URL)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be at `https://your-app.onrender.com`

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── groupController.js
│   │   ├── expenseController.js
│   │   ├── settlementController.js
│   │   └── balanceController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── asyncHandler.js # Async error wrapper
│   │   └── errorHandler.js # Global error handler
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
│   └── server.js           # Entry point
├── .env.example
├── package.json
└── README.md
```
