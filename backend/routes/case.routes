// Case information: create / list / view / update (+ What Changed log written on update)
const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const caseOwner = require('../middleware/caseOwner');
const { generateReminders } = require('../services/notification.service');

const TRACKED = ['case_no', 'case_title', 'case_type', 'current_status', 'filing_date',
  'next_hearing_date', 'client_name', 'court_name', 'description'];
const REQUIRED = ['case_no', 'case_title', 'case_type', 'current_status', 'filing_date', 'client_name', 'court_name'];

const clean = (v) => (v === '' || v === undefined ? null : v);

router.use(auth);

// List (own cases only) with optional search / status filter
router.get('/', async (req, res, next) => {
  try {
    const { q, status } = req.query;
    const where = ['lawyer_id = ?']; const args = [req.user.id];
    if (status) { where.push('current_status = ?'); args.push(status); }
    if (q) {
      where.push('(case_title LIKE ? OR case_no LIKE ? OR case_code LIKE ? OR client_name LIKE ?)');
      args.push(...Array(4).fill(`%${q}%`));
    }
    const [rows] = await db.query(
      `SELECT * FROM cases WHERE ${where.join(' AND ')} ORDER BY updated_at DESC`, args);
    res.json(rows);
  } catch (e) { next(e); }
});

// Create
router.post('/', async (req, res, next) => {
  try {
    const b = req.body;
    const missing = REQUIRED.filter((f) => !b[f]);
    if (missing.length) return res.status(400).json({ message: `Missing: ${missing.join(', ')}` });

    const [dup] = await db.query('SELECT id FROM cases WHERE lawyer_id=? AND case_no=?', [req.user.id, b.case_no]);
    if (dup.length) return res.status(409).json({ message: 'You already have a case with this case number' });

    const [r] = await db.query(
      `INSERT INTO cases (lawyer_id, case_no, case_title, case_type, current_status, filing_date,
         next_hearing_date, client_name, court_name, description) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [req.user.id, b.case_no, b.case_title, b.case_type, b.current_status, b.filing_date,
        clean(b.next_hearing_date), b.client_name, b.court_name, clean(b.description)]);

    const code = `LA-${new Date().getFullYear()}-${String(r.insertId).padStart(5, '0')}`;
    await db.query('UPDATE cases SET case_code=? WHERE id=?', [code, r.insertId]);
    await generateReminders(r.insertId).catch((e) => console.error('Reminder error:', e.message));

    const [rows] = await db.query('SELECT * FROM cases WHERE id=?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// View one
router.get('/:id', caseOwner, (req, res) => res.json(req.case));

// Update -> old value + new value of every changed field is saved in case_changes
router.put('/:id', caseOwner, async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const old = req.case;
    const b = req.body;
    const missing = REQUIRED.filter((f) => !b[f]);
    if (missing.length) return res.status(400).json({ message: `Missing: ${missing.join(', ')}` });

    if (b.case_no !== old.case_no) {
      const [dup] = await db.query('SELECT id FROM cases WHERE lawyer_id=? AND case_no=? AND id<>?', [req.user.id, b.case_no, old.id]);
      if (dup.length) return res.status(409).json({ message: 'You already have a case with this case number' });
    }
    const changes = [];
    const values = {};
    for (const f of TRACKED) {
      const nv = clean(b[f]);
      values[f] = nv;
      const o = old[f] === undefined ? null : old[f];
      if (String(o ?? '') !== String(nv ?? '')) changes.push({ f, o, n: nv });
    }
    if (!changes.length) return res.json({ message: 'No changes detected', case: old });

    await conn.beginTransaction();
    await conn.query(
      `UPDATE cases SET case_no=?, case_title=?, case_type=?, current_status=?, filing_date=?,
         next_hearing_date=?, client_name=?, court_name=?, description=? WHERE id=?`,
      [...TRACKED.map((f) => values[f]), old.id]);
    for (const c of changes) {
      await conn.query(
        'INSERT INTO case_changes (case_id, lawyer_id, field_name, old_value, new_value) VALUES (?,?,?,?,?)',
        [old.id, req.user.id, c.f, c.o, c.n]);
    }
    await conn.commit();

    await generateReminders(old.id).catch((e) => console.error('Reminder error:', e.message)); // new hearing date may fall inside the reminder window
    const [rows] = await db.query('SELECT * FROM cases WHERE id=?', [old.id]);
    res.json({ message: `${changes.length} field(s) updated`, case: rows[0] });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
});

module.exports = router;
