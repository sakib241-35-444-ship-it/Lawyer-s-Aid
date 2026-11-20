// Case History: every case this lawyer has handled so far (+ summary counts)
const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  try {
    const [cases] = await db.query(
      `SELECT id, case_code, case_no, case_title, case_type, current_status, filing_date,
              client_name, court_name, updated_at
       FROM cases WHERE lawyer_id=? ORDER BY filing_date DESC`, [req.user.id]);
    const [summary] = await db.query(
      'SELECT current_status AS status, COUNT(*) AS total FROM cases WHERE lawyer_id=? GROUP BY current_status',
      [req.user.id]);
    res.json({ total: cases.length, summary, cases });
  } catch (e) { next(e); }
});

module.exports = router;
