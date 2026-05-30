require("dotenv").config();
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const crypto = require("crypto");
const skillsList = [
  "react",
  "node.js",
  "express",
  "mongodb",
  "javascript",
  "html",
  "css",
  "sql",
  "mysql",
  "postgresql",
  "python",
  "java",
  "git",
  "github",
  "docker",
  "aws"
];

function extractSkills(text) {
  const lowerText = text.toLowerCase();

  return skillsList.filter(skill =>
    lowerText.includes(skill)
  );
}


const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const pool = require("./config/db");

const app = express();

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        candidate_name VARCHAR(255),
        resume_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_descriptions (
        id SERIAL PRIMARY KEY,
        jd_text TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS screening_results (
        id SERIAL PRIMARY KEY,
        candidate_name VARCHAR(255),
        score INTEGER,
        rank INTEGER,
        matched_skills TEXT,
        missing_skills TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("PostgreSQL tables ready");
  } catch (error) {
    console.error("DB TABLE ERROR:", error);
  }
})();


app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static("uploads")
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/test", (req, res) => {
  res.send("Test Working v2");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("DB ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

app.post("/upload", upload.array("resumes", 50), async (req, res) => {
  try {

    const candidates = [];

    for (const file of req.files) {

      let extractedText = "";

      const ext = path.extname(
        file.originalname
      ).toLowerCase();

      if (ext === ".pdf") {

        const dataBuffer = fs.readFileSync(
          file.path
        );

const parser = new pdfParse.PDFParse({
  data: dataBuffer
});

const pdfText = await parser.getText();

        extractedText = pdfText.text;

      }

      else if (ext === ".docx") {

        const result =
          await mammoth.extractRawText({
            path: file.path,
          });

        extractedText = result.value;
      }
      const normalizedText = extractedText
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim();

const fingerprint = crypto
  .createHash("sha256")
  .update(normalizedText)
  .digest("hex");

  console.log("FILE:", file.originalname);
console.log("FINGERPRINT:", fingerprint);
     candidates.push({
  name: file.originalname,
  resumeText: extractedText,
  fingerprint,
  fileUrl:
    `https://ai-resume-screening-backend-g2eh.onrender.com/uploads/${file.filename}`,
});
    }
    await pool.query(
  `
  INSERT INTO candidates
  (
    candidate_name,
    resume_name
  )
  VALUES ($1,$2)
  `,
  [
    file.originalname,
    file.originalname
  ]
);

    

    res.json({
      success: true,
      candidates,
    });

  }catch (error) {

  console.error("UPLOAD ERROR:");
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });

}
});

let jdText = "";

app.post("/jd", async (req, res) => {
  try {
    jdText = req.body.jd;

    await pool.query(
      `
      INSERT INTO job_descriptions (jd_text)
      VALUES ($1)
      `,
      [jdText]
    );

    res.json({
      success: true,
      jd: jdText,
    });

  } catch (error) {

    console.error("JD SAVE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

app.post(
  "/upload-jd",
  upload.single("jdFile"),
  async (req, res) => {

    try {

      let jdText = "";

      const ext = path.extname(
        req.file.originalname
      ).toLowerCase();

      if (ext === ".pdf") {

        const dataBuffer =
          fs.readFileSync(req.file.path);

        const parser =
          new pdfParse.PDFParse({
            data: dataBuffer,
          });

        const pdfText =
          await parser.getText();

        jdText = pdfText.text;

      }

      else if (ext === ".docx") {

        const result =
          await mammoth.extractRawText({
            path: req.file.path,
          });

        jdText = result.value;

      }

      else if (ext === ".txt") {

        jdText =
          fs.readFileSync(
            req.file.path,
            "utf8"
          );

      }

      res.json({
        success: true,
        jdText,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

});

app.post("/extract-skills", (req, res) => {
  const { text } = req.body;

  const skills = extractSkills(text);

  res.json({
    success: true,
    skills,
  });
});
app.post("/match-score", (req, res) => {
  const { resumeText, jdText } = req.body;

  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jdText);

  const matchedSkills = resumeSkills.filter(skill =>
    jdSkills.includes(skill)
  );

  const missingSkills = jdSkills.filter(skill =>
    !resumeSkills.includes(skill)
  );

  const score =
    jdSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / jdSkills.length) * 100
        );

  res.json({
    success: true,
    score,
    matchedSkills,
    missingSkills,
    resumeSkills,
    jdSkills,
  });
});

app.post("/rank-candidates", async (req, res) => {
  const { candidates, jdText } = req.body;

  const rankedCandidates = candidates.map((candidate) => {
    const resumeSkills = extractSkills(candidate.resumeText);
    const jdSkills = extractSkills(jdText);

    const matchedSkills = resumeSkills.filter((skill) =>
      jdSkills.includes(skill)
    );

    const score =
      jdSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length / jdSkills.length) * 100
          );

    const missingSkills = jdSkills.filter(
  (skill) => !resumeSkills.includes(skill)
);

return {
  name: candidate.name,
  score,
  matchedSkills,
  missingSkills,
  fileUrl: candidate.fileUrl,
};
  });

  rankedCandidates.sort((a, b) => b.score - a.score);

  rankedCandidates.forEach((candidate, index) => {
  candidate.rank = index + 1;
});
for (const candidate of rankedCandidates) {
  await pool.query(
    `
    INSERT INTO screening_results
    (
      candidate_name,
      score,
      rank,
      matched_skills,
      missing_skills
    )
    VALUES ($1,$2,$3,$4,$5)
    `,
    [
      candidate.name,
      candidate.score,
      candidate.rank,
      candidate.matchedSkills.join(", "),
      candidate.missingSkills.join(", ")
    ]
  );
}
  res.json({
    success: true,
    rankedCandidates,
  });
});



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});