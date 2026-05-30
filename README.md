# AI Resume Screening Platform

## Overview

AI Resume Screening Platform is a full-stack web application that automates the initial resume screening process by comparing candidate resumes with a Job Description (JD), generating ATS-style match scores, and ranking candidates based on their suitability for the role.

The platform helps recruiters and hiring teams quickly identify the most relevant candidates and reduce manual screening effort.

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

## Features Implemented

### Resume Management

- Upload single resume
- Upload multiple resumes
- PDF resume support
- Resume storage on server

### Job Description Management

- Enter Job Description manually
- Analyze JD against uploaded resumes

### Candidate Screening

- Skill extraction from resumes
- Skill extraction from JD
- ATS-style matching score generation
- Candidate ranking based on score
- Missing skills identification
- Matched skills identification

### Dashboard

- Candidate ranking table
- ATS score display
- Total resume statistics
- Top score statistics
- Matched candidate statistics
- Search candidate functionality
- Responsive UI

### Backend APIs

- Resume Upload API
- JD Analysis API
- Skill Extraction API
- Match Score API
- Candidate Ranking API

### Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- Publicly accessible application

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- Multer

### File Processing

- PDF Parse
- Mammoth

### Deployment

- Vercel
- Render

---

## Project Workflow

```text
Upload Resumes
        ↓
Enter Job Description
        ↓
Extract Skills
        ↓
Compare Resume vs JD
        ↓
Generate ATS Score
        ↓
Rank Candidates
        ↓
Display Results
```

---

## Scoring Approach

The ATS score is generated using skill matching between the Job Description and Resume.

### Formula

```text
ATS Score =
(Matched Skills / JD Skills) × 100
```

### Factors Considered

- Skills Match
- Keyword Matching
- Missing Skills Detection

### Output

- Match Score (0–100)
- Candidate Rank
- Matched Skills
- Missing Skills

---

## Architecture

```text
Frontend (React)
       |
       ↓
REST APIs (Express)
       |
       ↓
Resume Processing Layer
       |
       ↓
Skill Extraction Engine
       |
       ↓
ATS Scoring Engine
       |
       ↓
Candidate Ranking Module
```

---

## API Endpoints

### Upload Resume

```http
POST /upload
```

### Save Job Description

```http
POST /jd
```

### Extract Skills

```http
POST /extract-skills
```

### Generate Match Score

```http
POST /match-score
```

### Rank Candidates

```http
POST /rank-candidates
```

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/Vishal7202/ai-resume-screening-platform.git
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

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

## Assumptions

- ATS score is calculated using skill matching.
- Skill extraction is keyword-based.
- Candidate ranking is determined by ATS score.
- Higher score indicates better suitability for the role.

---

## Project Status

### Completed

- Resume Upload
- Multiple Resume Upload
- Job Description Input
- ATS Scoring
- Candidate Ranking
- Search Functionality
- Responsive Dashboard
- Skill Matching
- Missing Skills Analysis
- Public Deployment
- GitHub Repository

---

## Planned Improvements

Future enhancements that can further improve the platform:

- DOC Resume Support
- DOCX Resume Support
- Job Description File Upload
- Resume Preview
- CSV/Excel Export
- PostgreSQL Database Integration
- Experience Matching
- Education Matching
- Advanced AI-Based Scoring
- Authentication & User Management
- Recruiter Dashboard Analytics

---

## Author

### Vishal Kumar

Full Stack Developer

GitHub:
https://github.com/Vishal7202

---

## Project Outcome

This project successfully demonstrates an end-to-end AI-inspired resume screening workflow that automates candidate evaluation, generates ATS scores, and ranks applicants based on job suitability.
