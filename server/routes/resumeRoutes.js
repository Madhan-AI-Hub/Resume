const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume, checkAPI } = require('../controllers/resumeController');

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Diagnostic Route
router.get('/check-api', checkAPI);

// Main Analysis Route
router.post('/analyze', upload.any(), analyzeResume);

// Test Route
router.get('/test', (req, res) => res.json({ status: "Route Working" }));

module.exports = router;