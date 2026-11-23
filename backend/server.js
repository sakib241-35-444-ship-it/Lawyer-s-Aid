require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { generateReminders } = require('./services/notification.service');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Public
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/laws', require('./routes/law.routes'));
app.use('/api/lawyers', require('./routes/lawyerDirectory.routes'));

// Lawyer only
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/cases', require('./routes/case.routes'));
app.use('/api/cases/:caseId/changes', require('./routes/whatChanged.routes'));
app.use('/api/cases/:caseId/documents', require('./routes/document.routes'));
app.use('/api/history', require('./routes/history.routes'));
app.use('/api/timeline', require('./routes/timeline.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => {
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'This value already exists (duplicate case number, email or enrollment number)' });
  if (['ER_TRUNCATED_WRONG_VALUE', 'ER_WRONG_VALUE', 'ER_DATA_TOO_LONG', 'ER_BAD_NULL_ERROR'].includes(err.code))
    return res.status(400).json({ message: 'Invalid data. Please check dates and field lengths.' });
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

// Hearing reminders: every day 8:00 AM + once at startup
cron.schedule('0 8 * * *', () => generateReminders().catch(console.error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Lawyer's Aid API running on port ${PORT}`);
  generateReminders().catch((e) => console.error('Reminder startup error:', e.message));
});
