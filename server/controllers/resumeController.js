const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Extract text from uploaded file
const extractText = async (file) => {
    if (!file || !file.buffer) {
        console.log('extractText [v4] error: File or buffer is missing');
        return '';
    }

    console.log(`[v4] Extracting from ${file.originalname} (MIME: ${file.mimetype}, Size: ${file.size} bytes)`);
    console.log(`[v4] Buffer length check: ${file.buffer.length} bytes`);

    try {
        let text = '';
        const lowerName = file.originalname?.toLowerCase() || '';

        if (file.mimetype === 'application/pdf' || lowerName.endsWith('.pdf')) {
            console.log(`[v4] Attempting PDF parse for ${file.originalname}...`);
            const data = await pdf(file.buffer);

            // Log what we found inside the PDF object
            console.log(`[v4] PDF Object keys: ${Object.keys(data).join(', ')}`);
            if (data.info) console.log(`[v4] PDF Info: ${JSON.stringify(data.info)}`);
            console.log(`[v4] PDF numpages: ${data.numpages}`);

            text = data.text || '';
            console.log(`[v4] PDF text length: ${text.length}`);

            // If text is empty but pages exist, it might be an OCR/image issue
            if (text.length === 0 && data.numpages > 0) {
                console.log(`[v4] WARNING: PDF has ${data.numpages} pages but NO text extracted. Image-based PDF?`);
            }
        } else if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            lowerName.endsWith('.docx')
        ) {
            console.log(`[v4] Attempting DOCX parse for ${file.originalname}...`);
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            text = result.value || '';
            console.log(`[v4] DOCX text length: ${text.length}`);
        } else if (
            file.mimetype === 'text/plain' ||
            file.mimetype === 'application/octet-stream' ||
            lowerName.endsWith('.txt')
        ) {
            console.log(`[v4] Attempting TXT/Raw parse for ${file.originalname}...`);
            text = file.buffer.toString('utf8');
            console.log(`[v4] TXT text length: ${text.length}`);
        } else {
            console.log(`[v4] Fallback Extraction for unknown type: ${file.mimetype}`);
            text = file.buffer.toString('utf8');
        }

        const cleaned = text.replace(/\s+/g, ' ').trim();
        return cleaned;
    } catch (error) {
        console.error(`[v4] Error extracting text from ${file.originalname}:`, error);
        return '';
    }
};

// Cosine similarity
const calculateCosineSimilarity = (text1, text2) => {
    const tokens1 = tokenizer.tokenize(text1.toLowerCase()) || [];
    const tokens2 = tokenizer.tokenize(text2.toLowerCase()) || [];

    if (tokens1.length === 0 || tokens2.length === 0) return 0;

    const uniqueTokens = new Set([...tokens1, ...tokens2]);

    const vector1 = Array.from(uniqueTokens).map(
        token => tokens1.filter(t => t === token).length
    );

    const vector2 = Array.from(uniqueTokens).map(
        token => tokens2.filter(t => t === token).length
    );

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

// skill extraction logic...
const extractSkills = (text) => {
    const commonSkills = [
        'react', 'javascript', 'node.js', 'typescript',
        'html', 'css', 'git', 'aws', 'docker',
        'graphql', 'mongodb', 'sql', 'python', 'java',
        'postgresql', 'react native', 'aws lambda', 's3',
        'docker-compose', 'kubernetes', 'jenkins', 'ci/cd'
    ];

    const foundSkills = new Set();
    const lowerText = text.toLowerCase();

    commonSkills.forEach(skill => {
        if (lowerText.includes(skill)) {
            foundSkills.add(skill);
        }
    });

    return Array.from(foundSkills);
};

// MAIN CONTROLLER
exports.analyzeResume = async (req, res) => {
    console.log("--- ANALYSIS START (v4) ---");
    try {
        const bodyKeys = Object.keys(req.body);
        const files = req.files || [];
        console.log(`[v4] Incoming Files: ${files.length}, Body keys: ${bodyKeys}`);

        const resumeFile = files.find(f => f.fieldname === 'resume');
        const jdFile = files.find(f => f.fieldname === 'jdFile');
        const jdTextRaw = req.body.jdText || '';

        if (!resumeFile) {
            console.log("[v4] Error: Resume file missing");
            return res.status(400).json({
                error: 'Resume file is required',
                debug: { v: 'v4', files: files.map(f => f.fieldname) }
            });
        }

        console.log("[v4] Step 1: Extracting Resume Text");
        const resumeText = await extractText(resumeFile);

        let jdText = jdTextRaw;
        console.log(`[v4] Step 2: Processing JD (Raw length: ${jdTextRaw.length})`);

        if (jdFile) {
            console.log(`[v4] JD File found: ${jdFile.originalname}`);
            jdText = await extractText(jdFile);
        }

        const cleanJD = (jdText || '').trim();
        console.log(`[v4] Step 3: Validation. Resume length: ${resumeText.length}, JD length: ${cleanJD.length}`);

        if (cleanJD.length < 10) {
            return res.status(400).json({
                error: `Job description text could not be extracted (Extracted: ${cleanJD.length} chars).`,
                debug: {
                    v: 'v4',
                    resumeLen: resumeText.length,
                    jdLen: cleanJD.length,
                    files: files.map(f => `${f.fieldname}: ${f.mimetype} (${f.size}b)`)
                }
            });
        }

        if (resumeText.length < 10) {
            return res.status(400).json({
                error: `Resume text could not be extracted (Extracted: ${resumeText.length} chars).`,
                debug: {
                    v: 'v4',
                    resumeLen: resumeText.length,
                    jdLen: cleanJD.length
                }
            });
        }

        // Analysis
        const matchScore = Math.round(calculateCosineSimilarity(resumeText, cleanJD));
        const resumeSkills = extractSkills(resumeText);
        const jdSkills = extractSkills(cleanJD);

        const matchedSkills = resumeSkills.filter(skill => jdSkills.includes(skill));
        const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));

        const suggestions = missingSkills.map(skill => ({
            title: `Add ${skill}`,
            desc: `Optimize your resume for ${skill}.`
        }));

        const roadmap = missingSkills.map(skill => ({
            title: `Learn ${skill}`,
            desc: `Recommended learning path for ${skill}.`
        }));

        console.log(`[v4] Success: Match Score ${matchScore}`);
        res.json({
            score: matchScore,
            skills: { matched: matchedSkills, missing: missingSkills, weak: [] },
            suggestions: suggestions.slice(0, 5),
            roadmap: roadmap.slice(0, 5)
        });

    } catch (error) {
        console.error("[v4] CRITICAL SERVER ERROR:", error);
        res.status(500).json({ error: error.message, v: 'v4' });
    }
};
