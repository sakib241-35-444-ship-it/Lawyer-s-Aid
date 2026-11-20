// Lawyer profile (view / edit)
const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

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

router.put('/password', auth, async (req, res, next) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password)
      return res.status(400).json({ message: 'All password fields are required' });
    if (new_password.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    if (new_password !== confirm_password)
      return res.status(400).json({ message: 'New passwords do not match' });

    const [rows] = await db.query('SELECT password_hash FROM lawyers WHERE id = ?', [req.user.id]);
    if (!rows.length)
      return res.status(404).json({ message: 'Account not found' });
    if (!(await bcrypt.compare(current_password, rows[0].password_hash)))
      return res.status(400).json({ message: 'Current password is incorrect' });

    const password_hash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE lawyers SET password_hash=? WHERE id=?', [password_hash, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (e) { next(e); }
});

module.exports = router;
