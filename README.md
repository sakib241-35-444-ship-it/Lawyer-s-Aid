# Lawyer's Aid

React + CSS (frontend) · Node.js + Express (backend) · MySQL (database)

## Setup
1. **Database**
   ```
   mysql -u root -p < backend/database/schema.sql
   mysql -u root -p < backend/database/seed_laws.sql
   ```
2. **Backend**
   ```
   cd backend
   cp .env.example .env      # fill DB password and JWT_SECRET
   npm install
   npm run dev               # http://localhost:5000
   ```
3. **Frontend**
   ```
   cd frontend
   npm install
   npm run dev               # http://localhost:5173
   ```

## Feature -> file map
| Feature | Backend | Frontend |
|---|---|---|
| Registration / Login | routes/auth.routes.js | pages/Register.jsx, Login.jsx, context/AuthContext.jsx |
| Lawyer profile | routes/profile.routes.js | pages/Profile.jsx |
| Public law info + problem search | routes/law.routes.js | pages/Home.jsx, LawSearch.jsx |
| Public lawyer list (phone/email) | routes/lawyerDirectory.routes.js | pages/FindLawyers.jsx, components/LawyerCard.jsx |
| Case information (add/list/view/update) | routes/case.routes.js | pages/Cases.jsx, CaseForm.jsx, CaseDetails.jsx |
| What Changed (old vs new data) | routes/whatChanged.routes.js (written by case.routes.js on update) | components/WhatChanged.jsx |
| Documents (notice/evidence/court order/other) | routes/document.routes.js, middleware/upload.js | components/Documents.jsx |
| Case History | routes/history.routes.js | pages/CaseHistory.jsx |
| Case Timeline | routes/timeline.routes.js | pages/Timeline.jsx |
| Hearing notifications | services/notification.service.js, routes/notification.routes.js, cron in server.js | pages/Notifications.jsx, components/Navbar.jsx (bell) |

## Notes
- Laws in `seed_laws.sql` are SAMPLE summaries. Verify against official texts / have a lawyer review before going live.
- Email reminders turn on if SMTP_* is set in `.env`.
- Before production: HTTPS, rate limiting on login, backups for `backend/uploads`.
