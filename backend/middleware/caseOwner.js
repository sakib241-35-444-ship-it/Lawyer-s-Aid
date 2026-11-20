// Makes sure the case in :caseId (or :id) belongs to the logged-in lawyer
const db = require('../config/db');

module.exports = async function caseOwner(req, res, next) {
  try {
    const id = Number(req.params.caseId || req.params.id);
    const [rows] = await db.query('SELECT * FROM cases WHERE id = ? AND lawyer_id = ?', [id, req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'Case not found' });
    req.case = rows[0];
    next();
  } catch (e) {
    next(e);
  }
};
