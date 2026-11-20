// Lawyer profile (view / edit)
const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

const FIELDS = 'id,name,address,phone,email,bar_enrollment_no,practice_area,created_at';

router.get('/', auth, async (req, res, next) => {
  try {
    const [rows] = await db.query(`SELECT ${FIELDS} FROM lawyers WHERE id = ?`, [req.user.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/', auth, async (req, res, next) => {
  try {
    const { name, address, phone, practice_area } = req.body;
    if (![name, address, phone, practice_area].every(Boolean))
      return res.status(400).json({ message: 'All fields are required' });
    await db.query('UPDATE lawyers SET name=?, address=?, phone=?, practice_area=? WHERE id=?',
      [name, address, phone, practice_area, req.user.id]);
    const [rows] = await db.query(`SELECT ${FIELDS} FROM lawyers WHERE id = ?`, [req.user.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
