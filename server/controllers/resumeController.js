const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const skillSynonyms = {
    'react': ['reactjs', 'react.js', 'react native'],
    'node': ['nodejs', 'node.js'],
    'js': ['javascript', 'js'],
    'ts': ['typescript', 'ts'],
    'aws': ['amazon web services', 'aws'],
    'postgre': ['postgresql', 'postgres'],
    'mongo': ['mongodb', 'mongo'],
    'css': ['tailwind', 'bootstrap', 'css3', 'scss', 'sass'],
    'k8s': ['kubernetes', 'k8s'],
    'sql': ['mysql', 'sql server', 'sqlite', 'oracle']
};

const skillCategories = {
    'frontend': ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript', 'tailwind', 'next.js', 'redux'],
    'backend': ['node.js', 'python', 'java', 'spring boot', 'go', 'rust', 'express', 'flask', 'django', 'fastapi'],
    'database': ['mongodb', 'sql', 'postgresql', 'mysql', 'redis', 'sql server'],
    'devops': ['aws', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'azure', 'gcp', 'linux'],
};

const getSkillCategory = (skill) => {
    const s = skill.toLowerCase();
    for (const [cat, skills] of Object.entries(skillCategories)) {
        if (skills.includes(s)) return cat;
    }
    return 'general';
};

const normalizeSkill = (skill) => {
    const s = skill.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [key, synonyms] of Object.entries(skillSynonyms)) {
        if (synonyms.some(syn => syn.replace(/[^a-z0-9]/g, '') === s) || key === s) {
            return key;
        }
    }
    return s;
};

const isRelevantDocument = (text, type = 'resume') => {
    if (!text || text.trim().length < 50) return false;
    
    const resumeMarkers = ['experience', 'education', 'skills', 'projects', 'summary', 'certification', 'employment', 'university', 'college', 'curriculum', 'vitae', 'contact'];
    const jdMarkers = ['responsibilities', 'requirements', 'qualifications', 'preferred', 'required', 'description', 'opportunity', 'stack', 'role', 'looking for', 'plus', 'benefit'];
    
    const markers = type === 'resume' ? resumeMarkers : jdMarkers;
    const lowerText = text.toLowerCase();
    const count = markers.reduce((acc, marker) => acc + (lowerText.includes(marker.toLowerCase()) ? 1 : 0), 0);
    
    // If it's long enough and has at least one marker, or just very long, consider it relevant
    return count >= 1 || text.length > 500;
};


const extractText = async (file) => {
    if (!file || !file.buffer) return '';
    try {
        let text = '';
        const lowerName = file.originalname?.toLowerCase() || '';
        const isPDF = file.mimetype === 'application/pdf' || lowerName.endsWith('.pdf') || (file.buffer && file.buffer.toString('utf8', 0, 5) === '%PDF-');
        const isDocx = file.mimetype.includes('word') || lowerName.endsWith('.docx') || (file.buffer && file.buffer.toString('hex', 0, 4) === '504b0304');

        if (isPDF) {
            const data = await pdf(file.buffer);
            text = data.text || '';
        } else if (isDocx) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            text = result.value || '';
        } else {
            text = file.buffer.toString('utf8');
        }
        
        if (!text.trim()) throw new Error('File content could not be extracted.');
        return text.replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error("Extraction error:", error);
        throw error;
    }
};

const calculateCosineSimilarity = (text1, text2) => {
    const tokens1 = tokenizer.tokenize(text1.toLowerCase()) || [];
    const tokens2 = tokenizer.tokenize(text2.toLowerCase()) || [];
    const stemmed1 = tokens1.map(t => stemmer.stem(t));
    const stemmed2 = tokens2.map(t => stemmer.stem(t));
    if (stemmed1.length === 0 || stemmed2.length === 0) return 0;
    const uniqueTokens = new Set([...stemmed1, ...stemmed2]);
    const vector1 = Array.from(uniqueTokens).map(t => stemmed1.filter(token => token === t).length);
    const vector2 = Array.from(uniqueTokens).map(t => stemmed2.filter(token => token === t).length);
    let dotProduct = 0, mag1 = 0, mag2 = 0;
    for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
        mag1 += vector1[i] ** 2;
        mag2 += vector2[i] ** 2;
    }
    mag1 = Math.sqrt(mag1); mag2 = Math.sqrt(mag2);
    if (mag1 === 0 || mag2 === 0) return 0;
    return (dotProduct / (mag1 * mag2)) * 100;
};

const extractSkills = (text) => {
    const techLexicon = [
        'react', 'javascript', 'node.js', 'typescript', 'html', 'css', 'git', 'aws', 
        'docker', 'graphql', 'mongodb', 'sql', 'python', 'java', 'postgresql', 
        'react native', 'aws lambda', 's3', 'docker-compose', 'kubernetes', 'jenkins', 
        'ci/cd', 'vue', 'angular', 'spring boot', 'ruby', 'go', 'rust', 'c#', 'c++', 
        'azure', 'gcp', 'linux', 'bash', 'terraform', 'ansible', 'tailwind', 'redux', 'next.js',
        'express', 'flask', 'django', 'fastapi', 'rest api', 'mysql', 'redis'
    ];
    const foundSkills = new Set();
    techLexicon.forEach(skill => {
        // Escape special characters for regex
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`\\b${escapedSkill}\\b`, 'i').test(text)) {
            foundSkills.add(skill);
        }
    });
    return Array.from(foundSkills);
};


// --- HEURISTIC QUALITY SCORING ---
const calculateResumeQualityHeuristic = (text) => {
    const sectionDictionary = {
        'experience': ['experience', 'employment', 'history', 'professional', 'background'],
        'education': ['education', 'academic', 'college', 'university', 'studies'],
        'skills': ['skills', 'technical', 'tools', 'languages', 'competencies'],
        'projects': ['projects', 'selected', 'works', 'portfolio']
    };

    const foundSections = Object.entries(sectionDictionary)
        .filter(([_, synonyms]) => synonyms.some(syn => new RegExp(`${syn}`, 'i').test(text)))
        .map(([key]) => key);
    
    // Heuristic: If it has dates and proper length, it has structure.
    const hasDates = /\b(19|20)\d{2}\b/.test(text); 
    const isReasonableLength = text.length > 200;
    
    let structureScore = Math.round((foundSections.length / Object.keys(sectionDictionary).length) * 100);
    if (hasDates && isReasonableLength) structureScore = Math.max(structureScore, 50); // Baseline structure for a real resume

    const hasNumbers = /(\d+%|\b(users|revenue|budget|managed|reduced|optimized)\b.*\d+)/i.test(text) || hasDates;
    const actionVerbs = ['led', 'managed', 'developed', 'built', 'implemented', 'created', 'optimized', 'scaled'];
    const hasActionVerbs = actionVerbs.some(v => new RegExp(`\\b${v}\\b`, 'i').test(text));
    
    const contentStrength = (hasNumbers ? 50 : 0) + (hasActionVerbs ? 50 : 0);
    const tokens = tokenizer.tokenize(text) || [];
    const readability = tokens.length > 250 ? 'Good' : tokens.length > 100 ? 'Average' : 'Poor';
    
    return {
        atsScore: Math.round((structureScore * 0.4) + (contentStrength * 0.6)),
        formatting: { score: structureScore, sections: foundSections.map(s => s.charAt(0).toUpperCase() + s.slice(1)) },
        readability,
        contentStrength: { score: contentStrength, quantified: hasNumbers, actionVerbs: hasActionVerbs }
    };
};

exports.analyzeResume = async (req, res) => {
    try {
        const resumeFile = req.files?.find(f => f.fieldname === 'resume');
        const jdFile = req.files?.find(f => f.fieldname === 'jdFile');
        const jdTextRaw = req.body.jdText || '';

        if (!resumeFile) return res.status(400).json({ error: 'Please upload a resume.' });
        let resumeText = await extractText(resumeFile);
        let jdText = jdFile ? await extractText(jdFile) : jdTextRaw;

        if (!isRelevantDocument(resumeText, 'resume')) return res.status(400).json({ error: "Invalid resume content." });
        if (!isRelevantDocument(jdText, 'jd')) return res.status(400).json({ error: "Invalid JD content." });

        let matchScore = Math.round(calculateCosineSimilarity(resumeText, jdText));
        const resumeSkills = extractSkills(resumeText);
        const jdSkills = extractSkills(jdText);
        const normalizedResumeSkills = resumeSkills.map(s => normalizeSkill(s));

        const matchedSkills = jdSkills.filter(s => normalizedResumeSkills.includes(normalizeSkill(s)));
        const missingSkills = jdSkills.filter(s => !normalizedResumeSkills.includes(normalizeSkill(s)));
        const weakSkills = matchedSkills.filter(s => resumeText.toLowerCase().split(s.toLowerCase()).length - 1 < 2);

        const resumeQuality = calculateResumeQualityHeuristic(resumeText);

        const chunkSkills = (arr, n) => {
            if (arr.length === 0) return [];
            const result = [];
            const size = Math.ceil(arr.length / n);
            for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
            return result;
        };

        // --- FULL COVERAGE ROADMAP ---
        const missingChunks = chunkSkills(missingSkills, 3);
        const p1 = missingChunks[0] || [];
        const p2 = missingChunks[1] || [];
        const p3 = missingChunks[2] || [];
        const p4 = weakSkills.length > 0 ? weakSkills : Object.values(skillSynonyms).flat().slice(0, 3);

        const buildPhase = (skills, phaseName, statusLabel) => skills.map(skill => {
            const cat = getSkillCategory(skill);
            const context = {
                frontend: { topics: ['Component Architecture', 'Modern Patterns'], tasks: ['Build interactive UI'], where: ['Frontend Masters'] },
                backend: { topics: ['API Scalability', 'System Design'], tasks: ['Build Microservice'], where: ['Developer Blogs'] },
                devops: { topics: ['CI/CD Orchestration', 'Cloud Infrastructure'], tasks: ['Automate Deployment'], where: ['Cloud Academy'] },
                general: { topics: ['Fundamentals', 'Implementation Guide'], tasks: ['Build real-world project'], where: ['YouTube'] }
            };
            const data = context[cat] || context.general;
            return {
                skill: skill.toUpperCase(),
                phase: phaseName,
                status: statusLabel,
                topics: data.topics,
                tasks: data.tasks,
                where: data.where,
                milestones: [`Master ${skill} basics`, `Complete ${skill} portfolio assignment`],
                expertTip: `Prioritize ${skill} unit-testing for production readiness.`,
                time: "2 weeks"
            };
        });

        const roadmap = [
            ...buildPhase(p1, "Phase 1: Foundation Gaps", "Missing"),
            ...buildPhase(p2, "Phase 2: Core Growth", "Missing"),
            ...buildPhase(p3, "Phase 3: Secondary Skills", "Missing"),
            ...buildPhase(p4, "Phase 4: Optimization", "Refinement")
        ].filter(item => item.skill);

        const result = {
            score: matchScore,
            overallScore: matchScore,
            summary: `Profile alignment is ${matchScore}% using semantic vector analysis.`,
            aiInterpretation: `Detected ${matchedSkills.length} matches and identified ${missingSkills.length} growth areas across ${Math.ceil(missingSkills.length / 3) + 1} logical phases.`,
            verdict: { 
                status: matchScore >= 75 ? "Strong Fit" : matchScore >= 50 ? "Good Fit" : matchScore >= 30 ? "Moderate Fit" : "High Mismatch", 
                explanation: `Your profile alignment is ${matchScore}%. ${matchedSkills.length} key competencies detected.`
            },
            skills: { present: matchedSkills, matched: matchedSkills, missing: missingSkills, weak: weakSkills },
            resumeQuality,
            roadmap,
            breakdown: [
                { name: "Keyword Match", score: matchScore, icon: "Search" },
                { name: "Technical Density", score: Math.min(100, Math.round((resumeSkills.length / 10) * 100)), icon: "Target" },
                { name: "Format Parsing", score: resumeQuality.formatting.score, icon: "FileText" },
                { name: "ATS Compatibility", score: resumeQuality.atsScore, icon: "Zap" }
            ],
            charts: {
                bar: [
                    { name: 'Role Match', Resume: matchScore, Job: 100 },
                    { name: 'Tech Skills', Resume: Math.min(100, matchedSkills.length * 20), Job: 100 },
                    { name: 'ATS Ready', Resume: resumeQuality.atsScore, Job: 100 }
                ],
                radar: [
                    { subject: 'Alignment', A: matchScore, fullMark: 100 },
                    { subject: 'Readability', A: resumeQuality.readability === 'Good' ? 100 : 50, fullMark: 100 },
                    { subject: 'Completeness', A: resumeQuality.formatting.score, fullMark: 100 }
                ]
            }
        };

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: "Analysis error", details: err.message });
    }
};

exports.checkAPI = async (req, res) => res.json({ status: "NLP v3.1 Active" });
