const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/resume', resumeRoutes);

// Health Check
app.get('/health', (req, res) => res.send('Backend is healthy'));

// Root Route
app.get('/', (req, res) => {
    res.send('Smart Resume Analyzer API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
