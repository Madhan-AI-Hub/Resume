const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: './server/.env' });

async function checkKey() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    console.log("Checking API Key availability...");
    
    const URLS = [
        `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    ];

    for (const url of URLS) {
        try {
            console.log(`\nTesting: ${url.split('?')[0]}`);
            const res = await axios.get(url);
            console.log("Success! Models found:", res.data.models.map(m => m.name).slice(0, 5), "...");
        } catch (e) {
            console.error("Failed:", e.response?.data?.error || e.message);
        }
    }
}

checkKey();
