const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });

async function listModels() {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) {
        console.error("No API key found in .env");
        return;
    }
    const genAI = new GoogleGenerativeAI(key);
    try {
        console.log("Listing models for key:", key.substring(0, 4) + "..." + key.substring(key.length - 4));
        // Use a generic model to check connection first
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Connection check with gemini-pro...");
        const result = await model.generateContent("hello");
        console.log("Success with gemini-pro!");
    } catch (e) {
        console.error("Error during listing/checking:", e.message);
        if (e.status) console.log("Status:", e.status);
    }
}

listModels();
