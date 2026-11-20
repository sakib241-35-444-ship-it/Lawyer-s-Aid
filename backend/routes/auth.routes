// Lawyer registration + login
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { name, address, phone, email, password, bar_enrollment_no, practice_area } = req.body;
    if (![name, address, phone, email, password, bar_enrollment_no, practice_area].every(Boolean))
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });

    const [dup] = await db.query('SELECT id FROM lawyers WHERE email = ? OR bar_enrollment_no = ?', [email, bar_enrollment_no]);
    if (dup.length) return res.status(409).json({ message: 'Email or Bar Council enrollment number already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [r] = await db.query(
      `INSERT INTO lawyers (name,address,phone,email,password_hash,bar_enrollment_no,practice_area)
       VALUES (?,?,?,?,?,?,?)`,
      [name, address, phone, email, hash, bar_enrollment_no, practice_area]
    );
    res.status(201).json({ token: sign(r.insertId), lawyer: { id: r.insertId, name, email } });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM lawyers WHERE email = ?', [email]);
    if (!rows.length || !(await bcrypt.compare(password || '', rows[0].password_hash)))
      return res.status(401).json({ message: 'Wrong email or password' });
    const l = rows[0];
    res.json({ token: sign(l.id), lawyer: { id: l.id, name: l.name, email: l.email } });
  } catch (e) { next(e); }
});

module.exports = router;
