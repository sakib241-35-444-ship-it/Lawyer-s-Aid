// "What Changed": full register of old value vs new value for a case
const router = require('express').Router({ mergeParams: true });
const db = require('../config/db');
const auth = require('../middleware/auth');
const caseOwner = require('../middleware/caseOwner');

router.get('/', auth, caseOwner, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, field_name, old_value, new_value, changed_at FROM case_changes WHERE case_id=? ORDER BY changed_at DESC, id DESC',
      [req.case.id]);
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
