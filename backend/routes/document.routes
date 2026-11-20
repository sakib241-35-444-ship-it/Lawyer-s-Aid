// Documents of a case: legal notice, evidence, court order, other
const router = require('express').Router({ mergeParams: true });
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const auth = require('../middleware/auth');
const caseOwner = require('../middleware/caseOwner');
const upload = require('../middleware/upload');

// multer reads names as latin1; convert back so Bangla file names are kept
const fixName = (n) => Buffer.from(n, 'latin1').toString('utf8');
const CATEGORIES = ['Legal Notice', 'Evidence', 'Court Order', 'Other'];

router.use(auth, caseOwner);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT id, doc_category, original_name, mime_type, size_bytes, uploaded_at
       FROM documents WHERE case_id=? ORDER BY uploaded_at DESC`, [req.case.id]);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ message: err.message });
      if (!req.file) return res.status(400).json({ message: 'Choose a file' });
      const cat = CATEGORIES.includes(req.body.doc_category) ? req.body.doc_category : 'Other';
      await db.query(
        `INSERT INTO documents (case_id, lawyer_id, doc_category, original_name, stored_name, mime_type, size_bytes)
         VALUES (?,?,?,?,?,?,?)`,
        [req.case.id, req.user.id, cat, fixName(req.file.originalname), req.file.filename, req.file.mimetype, req.file.size]);
      res.status(201).json({ message: 'Uploaded' });
    } catch (e) { next(e); }
  });
});

// View / download (?download=1 forces download)
router.get('/:docId/file', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM documents WHERE id=? AND case_id=?', [req.params.docId, req.case.id]);
    if (!rows.length) return res.status(404).json({ message: 'Document not found' });
    const d = rows[0];
    const full = path.join(upload.ROOT, String(req.case.id), d.stored_name);
    if (!fs.existsSync(full)) return res.status(404).json({ message: 'File missing on server' });
    res.setHeader('Content-Type', d.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition',
      `${req.query.download ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(d.original_name)}`);
    fs.createReadStream(full).pipe(res);
  } catch (e) { next(e); }
});

router.delete('/:docId', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM documents WHERE id=? AND case_id=?', [req.params.docId, req.case.id]);
    if (!rows.length) return res.status(404).json({ message: 'Document not found' });
    fs.unlink(path.join(upload.ROOT, String(req.case.id), rows[0].stored_name), () => {});
    await db.query('DELETE FROM documents WHERE id=?', [rows[0].id]);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
