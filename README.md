# AI Resume Screening Platform

## Overview

AI Resume Screening Platform is a full-stack web application that automates the initial resume screening process by comparing candidate resumes against a Job Description (JD), generating ATS-style match scores, and ranking candidates based on their suitability for the role.

The platform helps recruiters and hiring teams quickly identify the most relevant candidates, reduce manual screening effort, and streamline the hiring workflow.

---

## Live Demo

### Frontend

https://ai-resume-screening-platform-ochre.vercel.app/

### Backend API

https://ai-resume-screening-backend-g2eh.onrender.com

---

## GitHub Repository

https://github.com/Vishal7202/ai-resume-screening-platform

---

# Features

## Resume Management

* Upload single resume
* Upload multiple resumes
* PDF resume support
* DOCX resume support
* Resume preview
* Resume download
* Resume fingerprint generation
* Resume storage

---

## Job Description Management

* Enter Job Description manually
* Upload Job Description file
* PDF JD support
* DOCX JD support
* TXT JD support
* Store JD in PostgreSQL

---

## Candidate Screening & ATS Scoring

The platform automatically:

* Extracts skills from resumes
* Extracts skills from Job Description
* Extracts education information
* Extracts experience information
* Performs keyword similarity analysis
* Calculates ATS-style match scores
* Identifies matched skills
* Identifies missing skills
* Ranks candidates from highest to lowest score

### Factors Considered

* Skills Match
* Education Alignment
* Experience Relevance
* Keyword Similarity

---

## Results Dashboard

Displays:

* Candidate Name
* Resume Preview
* Match Score
* Candidate Rank
* Matched Skills
* Missing Skills
* Qualification Status

Additional Features:

* Search Candidates
* CSV Export
* Excel Export
* Responsive Dashboard
* ATS Statistics Cards

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* Multer

## Database

* PostgreSQL

## File Processing

* pdf-parse
* mammoth

## Deployment

* Vercel
* Render
* Render PostgreSQL

---

# Project Workflow

```text
Upload Resumes
        ↓
Upload / Enter Job Description
        ↓
Resume Parsing
        ↓
Skill Extraction
        ↓
Education Extraction
        ↓
Experience Extraction
        ↓
Keyword Analysis
        ↓
ATS Score Generation
        ↓
Candidate Ranking
        ↓
Store Results in PostgreSQL
        ↓
Display Dashboard Results
```

---

# Scoring Approach

The ATS score is generated using multiple evaluation factors.

### Skills Matching

Maximum Weight: 80%

```text
(Matched Skills / JD Skills) × 80
```

### Education Matching

Maximum Weight: 20%

If resume education matches JD education requirements:

```text
+20 Points
```

### Experience Matching

Maximum Weight: 10%

If candidate experience satisfies JD requirements:

```text
+10 Points
```

### Keyword Similarity

Maximum Weight: 10%

Based on matching keywords between resume and JD.

### Final Score

```text
Final Score =
Skill Score
+ Education Score
+ Experience Score
+ Keyword Score

Maximum = 100
```

---

# Database

PostgreSQL is used for storing:

* Uploaded Candidates
* Job Descriptions
* Screening Results

### Tables

#### candidates

Stores uploaded candidate information.

#### job_descriptions

Stores submitted Job Descriptions.

#### screening_results

Stores ATS scores, ranking results, matched skills, and missing skills.

---

# Architecture

```text
React Frontend
        │
        ▼
Express REST API
        │
        ▼
Resume Upload Module
        │
        ▼
Resume Parser
        │
        ├── Skill Extraction
        ├── Education Extraction
        ├── Experience Extraction
        └── Keyword Analysis
                │
                ▼
          ATS Scoring Engine
                │
                ▼
         Candidate Ranking
                │
                ▼
          PostgreSQL Storage
                │
                ▼
         Results Dashboard
```

---

# API Endpoints

## Upload Resume

```http
POST /upload
```

## Save Job Description

```http
POST /jd
```

## Upload Job Description File

```http
POST /upload-jd
```

## Extract Skills

```http
POST /extract-skills
```

## Generate Match Score

```http
POST /match-score
```

## Rank Candidates

```http
POST /rank-candidates
```

## Database Test

```http
GET /db-test
```

---

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/Vishal7202/ai-resume-screening-platform.git
```

---

## Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL=your_postgresql_connection_string
```

---

# Assumptions

* ATS scoring is based on skill matching, education matching, experience matching, and keyword similarity.
* Higher ATS score indicates better suitability for the role.
* Candidate ranking is determined by the final ATS score.
* Resumes are evaluated against a single Job Description at a time.

---

# Future Enhancements

* AI/LLM-based semantic matching
* Authentication & Authorization
* Recruiter Dashboard Analytics
* Candidate Feedback Reports
* Advanced Resume Insights
* Interview Recommendation System

---

# Author

## Vishal Kumar

Full Stack Developer

GitHub:

https://github.com/Vishal7202

---

# Project Outcome

This project successfully demonstrates an end-to-end AI-powered resume screening workflow that automates candidate evaluation, ATS score generation, ranking, resume analysis, and result management using a modern full-stack architecture.
