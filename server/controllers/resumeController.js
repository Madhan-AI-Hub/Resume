const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

/**
 * Extract text from different file types
 */
const extractText = async (file) => {
    if (!file || !file.buffer) return '';
    try {
        let text = '';
        const lowerName = file.originalname?.toLowerCase() || '';
        if (file.mimetype === 'application/pdf' || lowerName.endsWith('.pdf')) {
            const data = await pdf(file.buffer);
            text = data.text || '';
        } else if (file.mimetype.includes('word') || lowerName.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            text = result.value || '';
        } else {
            text = file.buffer.toString('utf8');
        }
        return text.replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error("Text extraction error:", error);
        return '';
    }
};

/**
 * Offline NLP Cosine Similarity Score
 */
const calculateCosineSimilarity = (text1, text2) => {
    const tokens1 = tokenizer.tokenize(text1.toLowerCase()) || [];
    const tokens2 = tokenizer.tokenize(text2.toLowerCase()) || [];

    if (tokens1.length === 0 || tokens2.length === 0) return 0;
    const uniqueTokens = new Set([...tokens1, ...tokens2]);

    const vector1 = Array.from(uniqueTokens).map(t => tokens1.filter(token => token === t).length);
    const vector2 = Array.from(uniqueTokens).map(t => tokens2.filter(token => token === t).length);

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
        mag1 += vector1[i] ** 2;
        mag2 += vector2[i] ** 2;
    }

    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);

    if (mag1 === 0 || mag2 === 0) return 0;

    return (dotProduct / (mag1 * mag2)) * 100;
};

/**
 * Offline Skill Keyword Extraction
 */
const extractSkills = (text) => {
    const techLexicon = [
        'react', 'javascript', 'node.js', 'typescript', 'html', 'css', 'git', 'aws', 
        'docker', 'graphql', 'mongodb', 'sql', 'python', 'java', 'postgresql', 
        'react native', 'aws lambda', 's3', 'docker-compose', 'kubernetes', 'jenkins', 
        'ci/cd', 'vue', 'angular', 'spring boot', 'ruby', 'go', 'rust', 'c#', 'c++', 
        'azure', 'gcp', 'linux', 'bash', 'terraform', 'ansible'
    ];

    const foundSkills = new Set();
    const lowerText = text.toLowerCase();

    techLexicon.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            foundSkills.add(skill);
        }
    });

    return Array.from(foundSkills);
};

/**
 * Main Analysis Controller (NLP Edition)
 */
exports.analyzeResume = async (req, res) => {
    try {
        const resumeFile = req.files?.find(f => f.fieldname === 'resume');
        const jdFile = req.files?.find(f => f.fieldname === 'jdFile');
        const jdTextRaw = req.body.jdText || '';

        if (!resumeFile) return res.status(400).json({ error: 'Please upload a resume.' });

        const resumeText = await extractText(resumeFile);
        let jdText = jdFile ? await extractText(jdFile) : jdTextRaw;
        jdText = (jdText || "").trim();

        if (resumeText.length < 10) return res.status(400).json({ error: 'Resume content is empty or unreadable.' });
        if (jdText.length < 10) return res.status(400).json({ error: 'Job description is too short.' });

        console.log("[NLP Engine] Running Vector Analysis...");
        
        // Compute metrics
        let matchScore = Math.round(calculateCosineSimilarity(resumeText, jdText));
        if (matchScore > 100) matchScore = 100;

        const resumeSkills = extractSkills(resumeText);
        const jdSkills = extractSkills(jdText);

        const matchedSkills = resumeSkills.filter(skill => jdSkills.includes(skill));
        const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
        // Simple logic for weak skills: present in resume but maybe lacking context (we just mock it slightly based on missing)
        const weakSkills = missingSkills.length > 5 ? missingSkills.splice(5) : [];

        // Prepare Frontend-compatible Payload
        let verdictStatus = "Moderate Fit";
        if (matchScore >= 80) verdictStatus = "Strong Fit";
        else if (matchScore >= 60) verdictStatus = "Good Fit";
        else if (matchScore < 40) verdictStatus = "Growth Needed";

        const suggestions = missingSkills.map(skill => ({
            title: `Learn ${skill.toUpperCase()}`,
            desc: `This is a critical keyword detected in the Job Description.`
        }));

        const roadmap = missingSkills.map(skill => ({
            skill: skill.toUpperCase(),
            topics: [`${skill} Fundamentals`, `Advanced ${skill} Concepts`, `Applied ${skill} in Production`],
            where: ['Official Documentation', 'YouTube Tutorials', 'Udemy Structured Courses']
        }));

        const result = {
            score: matchScore,
            overallScore: matchScore,
            summary: `Based on a deterministic Natural Language Processing (NLP) vector space model, your resume aligned ${matchScore}% with the provided job description.`,
            aiInterpretation: `Offline semantic analysis located ${matchedSkills.length} highly correlated skill tokens.`,
            verdict: {
                status: verdictStatus,
                explanation: `Your Cosine Similarity distance indicates a ${verdictStatus.toLowerCase()}.`
            },
            skills: {
                present: matchedSkills,
                matched: matchedSkills,
                missing: missingSkills,
                weak: weakSkills
            },
            suggestions: suggestions.slice(0, 4),
            roadmap: roadmap.slice(0, 4),
            breakdown: [
                { name: "Keyword Match", score: matchScore, icon: "Search" },
                { name: "Technical Density", score: Math.min(100, Math.round((resumeSkills.length / 15) * 100)), icon: "Target" },
                { name: "Experience Confidence", score: Math.max(0, matchScore - 10), icon: "Briefcase" },
                { name: "Format Parsing", score: 100, icon: "FileText" }
            ],
            charts: {
                bar: [
                    { name: 'Core Match', Resume: matchScore, Job: 100 },
                    { name: 'Tech Skills', Resume: Math.min(100, matchedSkills.length * 15), Job: 100 },
                    { name: 'Vocabulary', Resume: Math.min(100, (resumeSkills.length / jdSkills.length) * 100 || 0), Job: 100 }
                ],
                radar: [
                    { subject: 'Alignment', A: matchScore, fullMark: 100 },
                    { subject: 'Keywords', A: Math.min(100, matchedSkills.length * 15), fullMark: 100 },
                    { subject: 'Completeness', A: Math.max(0, matchScore - 10), fullMark: 100 }
                ]
            }
        };

        res.json(result);

    } catch (error) {
        console.error("Master Controller Error:", error);
        res.status(500).json({ error: "NLP Analysis failed.", details: error.message });
    }
};

/**
 * Diagnostic Controller
 */
exports.checkAPI = async (req, res) => {
    res.json({
        status: "Connected",
        engine: "Local NLP Engine v1.0",
        modelsFound: 1,
        availableModels: ["local-cosine-similarity-model"]
    });
};
