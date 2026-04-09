const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const resumeRoutes = require('./routes/resumeRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/resume', resumeRoutes);

// Deployment: Serve frontend static files
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get(/^(?!\/api).+/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Smart Resume Analyzer API is running in development mode...');
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
