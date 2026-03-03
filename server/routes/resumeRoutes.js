const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/resumeController');

// =======================
// Multer Configuration
// =======================
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
        }
    }
});

// =======================
// GET Route (For Testing)
// =======================
router.get('/analyze', (req, res) => {
    res.json({
        status: "API Working",
        message: "Use POST method to upload resume and job description."
    });
});

// =======================
// POST Route (Main Analysis)
// =======================
router.post(
    '/analyze',
    upload.any(),
    analyzeResume
);

module.exports = router;