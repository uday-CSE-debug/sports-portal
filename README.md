# Sports Portal

A full-stack sports facility and activity management platform for colleges and universities.

## Project Structure

- `frontend/` - Next.js client application with Tailwind CSS, dashboards for students, staff, coaches, and administrators.
- `backend/` - Node.js Express server with Sequelize ORM (MySQL), JWT authentication, scheduling, equipment tracking, and analytics.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your database credentials and secret key:
   ```bash
   cp .env.example .env
   ```
4. Initialize the MySQL database using `database.sql`.
5. Start the backend server:
   ```bash
   npm run dev
   # or
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
