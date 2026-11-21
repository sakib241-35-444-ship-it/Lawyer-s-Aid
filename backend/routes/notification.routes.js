// In-app notifications for hearing dates
const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE lawyer_id=? ORDER BY created_at DESC LIMIT 100', [req.user.id]);
    const [[{ unread }]] = await db.query(
      'SELECT COUNT(*) AS unread FROM notifications WHERE lawyer_id=? AND is_read=0', [req.user.id]);
    res.json({ unread, notifications: rows });
  } catch (e) { next(e); }
});

router.put('/read-all', async (req, res, next) => {
  try {
    await db.query('UPDATE notifications SET is_read=1 WHERE lawyer_id=?', [req.user.id]);
    res.json({ message: 'ok' });
  } catch (e) { next(e); }
});

router.put('/:id/read', async (req, res, next) => {
  try {
    await db.query('UPDATE notifications SET is_read=1 WHERE id=? AND lawyer_id=?', [req.params.id, req.user.id]);
    res.json({ message: 'ok' });
  } catch (e) { next(e); }
});

module.exports = router;
