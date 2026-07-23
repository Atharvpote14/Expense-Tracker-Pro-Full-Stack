# Expense Tracker Pro

A premium SaaS expense tracker built with React, Express.js, and Neon PostgreSQL.

## Features

- Dashboard with animated statistics
- Full CRUD expense management
- Search, filter, sort, and pagination
- Analytics with Recharts (line, pie, bar charts)
- Dark/Light theme
- CSV export
- Responsive design
- Framer Motion animations

## Quick Start

1. **Clone the repo**

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Configure database**
Edit `server/.env` and replace `YOUR_NEON_DATABASE_CONNECTION_STRING_HERE` with your Neon PostgreSQL connection string.

5. **Start the backend**
```bash
cd server
npm run dev
```

6. **Start the frontend** (in a new terminal)
```bash
cd frontend
npm run dev
```

7. Open `http://localhost:3000` in your browser.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Framer Motion, Recharts, React Icons
- **Backend:** Express.js, pg, dotenv, cors
- **Database:** Neon PostgreSQL
