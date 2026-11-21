// PUBLIC (no login): law library + "describe your problem" search
const router = require('express').Router();
const db = require('../config/db');

// Words that carry no meaning for matching
const STOP = new Set(['the','and','for','from','with','that','this','what','how','can','are','was','were','has','have','had','not','does','did','after','about','amar','ami','kore','korche','koreche','hoyeche','jeno','please','help','need','want']);

router.get('/categories', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT category, COUNT(*) AS total FROM laws GROUP BY category ORDER BY category');
    res.json(rows);
  } catch (e) { next(e); }
});

// Browse list: /api/laws?category=Family&q=divorce
router.get('/', async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const where = []; const args = [];
    if (category) { where.push('category = ?'); args.push(category); }
    if (q) {
      where.push('(title LIKE ? OR act_name LIKE ? OR summary LIKE ? OR keywords LIKE ?)');
      args.push(...Array(4).fill(`%${q}%`));
    }
    const [rows] = await db.query(
      `SELECT * FROM laws ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY category, title LIMIT 100`, args);
    res.json(rows);
  } catch (e) { next(e); }
});

// Problem search: user types the problem -> related laws + suggested lawyers
router.post('/problem-search', async (req, res, next) => {
  try {
    const text = String(req.body.problem || '').toLowerCase().trim();
    if (text.length < 3) return res.status(400).json({ message: 'Please describe your problem' });

    const words = [...new Set(text.split(/[^a-z0-9\u0980-\u09FF]+/).filter((w) => w.length > 2 && !STOP.has(w)))].slice(0, 15);
    if (!words.length) return res.json({ laws: [], lawyers: [], categories: [] });

    // score each law by how many words match
    const cols = ['title', 'summary', 'keywords', 'act_name', 'category'];
    const scoreSql = words.map(() => `(${cols.map((c) => `(${c} LIKE ?)`).join(' + ')})`).join(' + ');
    const args = words.flatMap((w) => Array(cols.length).fill(`%${w}%`));
    const [laws] = await db.query(
      `SELECT *, (${scoreSql}) AS score FROM laws HAVING score > 0 ORDER BY score DESC LIMIT 15`, args);

    // best categories -> lawyer suggestions
    const catScore = {};
    laws.forEach((l) => { catScore[l.category] = (catScore[l.category] || 0) + Number(l.score); });
    const categories = Object.keys(catScore).sort((a, b) => catScore[b] - catScore[a]).slice(0, 2);

    let lawyers = [];
    if (categories.length) {
      const cond = categories.map(() => 'practice_area LIKE ?').join(' OR ');
      [lawyers] = await db.query(
        `SELECT id,name,address,phone,email,practice_area FROM lawyers WHERE ${cond} ORDER BY name LIMIT 10`,
        categories.map((c) => `%${c}%`));
    }
    res.json({ categories, laws, lawyers });
  } catch (e) { next(e); }
});

module.exports = router;
