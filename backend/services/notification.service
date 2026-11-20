// Creates hearing reminders (in-app + optional email).
// A reminder is created once per (case, hearing date, type) thanks to the UNIQUE key.
const db = require('../config/db');
const nodemailer = require('nodemailer');

const mailer = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const typeFor = (days) => (days <= 0 ? 'TODAY' : days === 1 ? 'ONE_DAY' : 'THREE_DAY');
const textFor = (days) => (days <= 0 ? 'TODAY' : days === 1 ? 'TOMORROW' : `in ${days} days`);

// Pass caseId to check only one case (used right after a case is saved)
async function generateReminders(caseId = null) {
  const args = [];
  let extra = '';
  if (caseId) { extra = 'AND c.id = ?'; args.push(caseId); }

  const [rows] = await db.query(
    `SELECT c.id, c.lawyer_id, c.case_title, c.case_no, c.court_name, c.next_hearing_date,
            l.email, l.name AS lawyer_name, DATEDIFF(c.next_hearing_date, CURDATE()) AS days_left
     FROM cases c JOIN lawyers l ON l.id = c.lawyer_id
     WHERE c.next_hearing_date IS NOT NULL
       AND c.current_status NOT IN ('Disposed','Closed')
       AND DATEDIFF(c.next_hearing_date, CURDATE()) BETWEEN 0 AND 3 ${extra}`, args);

  for (const c of rows) {
    const days = Number(c.days_left);
    const message = `Hearing ${textFor(days)} (${c.next_hearing_date}): "${c.case_title}" (${c.case_no}) at ${c.court_name}`;
    const [r] = await db.query(
      `INSERT IGNORE INTO notifications (lawyer_id, case_id, hearing_date, type, message)
       VALUES (?,?,?,?,?)`,
      [c.lawyer_id, c.id, c.next_hearing_date, typeFor(days), message]);

    if (r.affectedRows && mailer) {
      mailer.sendMail({
        from: process.env.SMTP_FROM, to: c.email,
        subject: `Hearing reminder: ${c.case_title}`, text: message,
      }).catch((e) => console.error('Mail error:', e.message));
    }
  }
  return rows.length;
}

module.exports = { generateReminders };
