
# Lawyer's Aid

Lawyer's Aid is a web-based platform designed to help people find legal information and connect with lawyers based on their needs.

## Technologies Used

- Frontend: React.js, CSS
- Backend: Node.js, Express.js
- Database: MySQL

## Main Features

- Browse available legal information.
- Search for laws related to specific problems.
- Find lawyers and view their contact information.
- User registration and login.
- Create and manage case information.
- View case history and timelines.
- Upload and manage case-related documents.
- Receive hearing notifications.

## Installation and Setup

### Database Setup

Import the SQL files into your MySQL database:

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed_laws.sql
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` and configure your database credentials and JWT secret.

Start the backend:

```bash
npm run dev
```

Backend runs at: http://localhost:5000

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Notes

- The law information currently contains sample summaries.
- Database credentials and other environment variables should be configured before running the project.
- Legal information should be verified with official sources.
