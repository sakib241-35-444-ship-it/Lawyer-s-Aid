// PUBLIC (no login): lawyer list with contact details
const router = require('express').Router();
const db = require('../config/db');

router.get('/', async (req, res, next) => {
  try {
    const { practice_area, q } = req.query;
    const where = []; const args = [];
    if (practice_area) { where.push('practice_area LIKE ?'); args.push(`%${practice_area}%`); }
    if (q) { where.push('(name LIKE ? OR address LIKE ?)'); args.push(`%${q}%`, `%${q}%`); }
    const [rows] = await db.query(
      `SELECT id,name,address,phone,email,practice_area FROM lawyers
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY name LIMIT 100`, args);
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
