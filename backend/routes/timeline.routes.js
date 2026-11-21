// Case Timeline: upcoming hearings (date, court, case name) in date order
const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT id, case_code, case_no, case_title, court_name, next_hearing_date, current_status,
              DATEDIFF(next_hearing_date, CURDATE()) AS days_left
       FROM cases
       WHERE lawyer_id=? AND next_hearing_date IS NOT NULL AND next_hearing_date >= CURDATE()
         AND current_status NOT IN ('Disposed','Closed')
       ORDER BY next_hearing_date ASC`, [req.user.id]);
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
