// File upload (legal notice, evidence, court order, other documents)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', 'uploads');
const ALLOWED = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt', '.mp3', '.mp4'];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(ROOT, String(req.params.caseId));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext)) return cb(new Error('File type not allowed'));
    cb(null, true);
  },
});
upload.ROOT = ROOT;
module.exports = upload;
