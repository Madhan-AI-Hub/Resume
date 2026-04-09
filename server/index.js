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

// Deployment: Serve frontend static files
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientBuildPath));

    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        }
    });
} else {
    app.get('/', (req, res) => {
        res.send('Smart Resume Analyzer API is running...');
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
