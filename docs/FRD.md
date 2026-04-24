# Functional Requirements Document
# 📄 FRD.md
# Smart Resume Skill Gap Analyzer
Version: 1.0
Status: Production Ready Build
UI Requirement: Premium SaaS Quality, Mobile-First, Client-Ready

---

# 1. Product Overview

## Product Name
Smart Resume Skill Gap Analyzer

## Objective

Build a production-ready SaaS-style web application that:

- Accepts Resume (PDF/DOCX)
- Accepts Job Description (PDF or Text Input)
- Uses NLP + Cosine Similarity to compare both
- Highlights:
  - Matched Skills
  - Missing Skills
  - Weak Skills
- Generates:
  - Resume Improvement Suggestions
  - Learning Roadmap
  - Match Score
- Allows downloadable analysis report

The application must look like a premium SaaS product and be ready for client demonstration.

---

# 2. Target Users

- Students
- Freshers
- Job seekers
- Career switchers
- IT professionals

---

# 3. End-User Application Flow (MANDATORY)

## 3.1 Landing Page

### Sections

1. Hero Section
   - Headline: "Upload Resume. Match with Job. Close Your Skill Gaps."
   - Subtext explaining actionable feedback
   - CTA Button: "Analyze Resume"

2. How It Works (3 Steps)
   - Upload Resume & Job Description
   - AI Analysis
   - Improve & Apply

3. Features Section
   - Skill Gap Detection
   - Learning Roadmap Generator
   - Resume Optimization Suggestions
   - ATS-Friendly Recommendations

4. Final CTA Section

### UI Requirements
- Gradient hero background
- Smooth button animation
- Rounded cards (16px+)
- Soft shadows
- Clean typography
- Mobile-first layout

---

## 3.2 Upload Page

Inputs:
- Resume Upload (PDF/DOCX)
- Job Description Upload (PDF) OR Paste Text Option

UI Requirements:
- Drag & Drop upload cards
- File validation (type + size)
- Upload progress indicator
- Clear validation error messages
- Responsive layout for mobile/tablet/desktop

---

## 3.3 Processing Screen

Animated progress steps:

- Extracting Resume Data
- Extracting Job Description
- Analyzing Skills
- Generating Recommendations

Must include:
- Animated loader
- Step progress indicator
- Smooth transitions

---

## 3.4 Results Dashboard (Core Screen)

This screen must look premium and data-rich.

### 3.4.1 Match Score Section
- Large animated circular score (e.g., 78%)
- Color logic:
  - 80%+ → Green
  - 50–79% → Yellow
  - <50% → Red

---

### 3.4.2 Skills Breakdown

Three distinct sections:

Matched Skills (Green Chips)
Missing Skills (Red Chips)
Weak Skills (Orange Chips)

Each chip must be styled and visually distinct.

---

### 3.4.3 Resume Improvement Suggestions

Card-based layout with:

- Icon
- Title
- Description
- Actionable recommendation

Examples:
- Add measurable achievements
- Include missing keywords
- Add project experience
- Improve formatting structure

---

### 3.4.4 Learning Roadmap

For each missing skill:

Display:
- Step 1: Learn fundamentals
- Step 2: Build small project
- Step 3: Add to resume
- Step 4: Practice interview questions

Use vertical timeline or stepper component.

---

### 3.4.5 Download Section

Buttons:
- Download Full Report (PDF)
- Download Optimized Resume Template

---

# 4. Functional Requirements

## 4.1 Resume Parsing
- Extract text from PDF and DOCX
- Identify skills, projects, experience keywords

## 4.2 Job Description Parsing
- Extract required skills
- Extract tools
- Extract keywords

## 4.3 NLP Processing
- Tokenization
- Stopword removal
- Lemmatization
- Skill dictionary matching

## 4.4 Cosine Similarity
- Convert resume and job description to vectors
- Compute similarity score

## 4.5 Skill Categorization Logic

IF skill not found → Missing  
IF skill mentioned once → Weak  
IF skill used in projects/experience → Strong  

---

# 5. Non-Functional Requirements

- Mobile-first responsive design
- Fast performance (<2 seconds load)
- Clean modular architecture
- Error handling for invalid files
- Accessible (ARIA roles)
- Secure file handling

---

# 6. UI & UX Requirements (STRICT)

This application must look like a modern SaaS product.

Must include:

- Premium typography
- Smooth animations (200–300ms)
- Soft shadows
- Rounded corners (16–24px)
- Micro-interactions
- Clean whitespace
- No cluttered UI
- No default browser styling

---

# 7. Color & Theme Palette (MANDATORY)

## Primary Gradient
- #6366F1
- #8B5CF6

## Primary Solid
- #4F46E5

## Success
- #22C55E

## Warning
- #F59E0B

## Error
- #EF4444

## Info
- #06B6D4

## Background
- Main: #0F172A
- Card: #1E293B
- Border: rgba(255,255,255,0.08)

## Typography
Font Family: Inter
Fallback: system-ui
Headings: 600–700
Body: 400–500

---

# 8. Technical Stack

Frontend:
- React (Vite)
- MUI v5
- React Router
- Axios
- Framer Motion
- React Dropzone

Backend:
- Node.js
- Express
- NLP library
- Cosine similarity package
- MongoDB (optional)

---

# 9. Development Flow (MANDATORY BUILD ORDER)

1. Setup project
2. Configure theme & global styles
3. Build landing page
4. Build upload page
5. Implement backend parsing
6. Implement skill matching logic
7. Build results dashboard
8. Implement roadmap generator
9. Add animations
10. Implement PDF report download
11. Optimize responsiveness
12. Add error boundaries
13. Final production optimization

---

# 10. Testing Requirements

## Unit Testing
- Skill extraction
- Similarity calculation
- Rule engine

## Integration Testing
- Full upload → analyze → result flow

## UI Testing
- Mobile layout
- Tablet layout
- Desktop layout

## Edge Case Testing
- Empty file
- Wrong file type
- Extremely long resume
- Minimal job description

---

# 11. Security Requirements

- File size restriction
- File type validation
- Input sanitization
- Prevent injection attacks

---

# 12. Strict Instructions to Antigravity

Antigravity MUST:

- Follow mobile-first design approach
- Use the exact color palette defined
- Deliver premium SaaS-quality UI
- Implement all functionality fully
- Avoid placeholder content
- Maintain clean, modular architecture
- Ensure production-ready structure
- Ensure app is demo-ready for client
- Do not use generic templates
- Ensure animations and transitions are smooth
- Deliver clean, professional UX

---

# End of FRD
