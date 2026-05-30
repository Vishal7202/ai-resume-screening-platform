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

const app = express();
const uploadedFingerprints = new Set();
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
  res.send("Test Working");
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
console.log(
  "ALREADY EXISTS:",
  uploadedFingerprints.has(fingerprint)
);

  if (uploadedFingerprints.has(fingerprint)) {

  continue;

}

uploadedFingerprints.add(fingerprint);

     candidates.push({
  name: file.originalname,
  resumeText: extractedText,
  fingerprint,
  fileUrl:
    `https://ai-resume-screening-backend-g2eh.onrender.com/uploads/${file.filename}`,
});
    }

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

app.post("/jd", (req, res) => {
  jdText = req.body.jd;

  res.json({
    success: true,
    jd: jdText,
  });
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

app.post("/rank-candidates", (req, res) => {
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

  res.json({
    success: true,
    rankedCandidates,
  });
});



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});