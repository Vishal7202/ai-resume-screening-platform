import * as XLSX from "xlsx";
import axios from "axios";
import { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";

function Home() {
const [jd, setJd] = useState("");
const [search, setSearch] = useState("");
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [files, setFiles] = useState([]);
const [uploadedResumes, setUploadedResumes] = useState([]);
const [successMessage, setSuccessMessage] = useState("");

const filteredCandidates = results.filter((candidate) =>
  candidate.name.toLowerCase().includes(search.toLowerCase())
);
const handleUpload = async () => {
  console.log("UPLOAD BUTTON CLICKED");
  if (files.length === 0) {
  alert("Please select a resume");
  return;
}

  const formData = new FormData();

files.forEach((file) => {
  formData.append("resumes", file);
});

  try {

    const response = await axios.post(
      "https://ai-resume-screening-backend-g2eh.onrender.com/upload",
      formData
    );

    console.log(response.data);

   setUploadedResumes(
  response.data.candidates
);
console.log(
  "Uploaded Candidates:",
  response.data.candidates
);

setSuccessMessage(
  `${response.data.candidates.length} Resume Uploaded Successfully`
);
setTimeout(() => {
  setSuccessMessage("");
}, 3000);


  } catch (error) {

  console.log("UPLOAD ERROR");
  console.log(error);
  console.log(error.response?.data);

}
};

const downloadExcel = () => {

  if (results.length === 0) {
    alert("No candidate data available");
    return;
  }

  const excelData = results.map((candidate) => ({
    Rank: candidate.rank,
    Candidate: candidate.name,
    Score: candidate.score,
    Status:
      candidate.score >= 70
        ? "Qualified"
        : "Rejected",
    MatchedSkills:
      candidate.matchedSkills?.join(", "),
    MissingSkills:
      candidate.missingSkills?.join(", ")
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Candidates"
  );

  XLSX.writeFile(
    workbook,
    "candidate-rankings.xlsx"
  );
};
const downloadCSV = () => {
  if (results.length === 0) {
    alert("No candidate data available");
    return;
  }

  const headers = [
    "Rank",
    "Candidate",
    "Score",
    "Status",
  ];

  const rows = results.map((candidate) => [
    candidate.rank,
    candidate.name,
    candidate.score,
    candidate.score >= 70
      ? "Qualified"
      : "Rejected",
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "candidate-rankings.csv";

  link.click();

  window.URL.revokeObjectURL(url);
};
const handleAnalyze = async () => {
  if (!jd.trim()) {
  alert("Please enter Job Description");
  return;
}

if (uploadedResumes.length === 0) {
  alert("Please upload a resume first");
  return;
}

  try {
    setLoading(true);

    const response = await axios.post(
      "https://ai-resume-screening-backend-g2eh.onrender.com/rank-candidates",
      {
        jdText: jd,
        candidates: uploadedResumes,
      }
    );

    setResults(response.data.rankedCandidates);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const totalResumes = results.length;

const topScore =
  results.length > 0
    ? Math.max(...results.map((c) => c.score))
    : 0;

const matchedCandidates =
  results.filter((c) => c.score >= 70).length;

return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">

  {/* Header */}
  <div className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 border-b border-slate-200">

    {/* Background Glow */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"></div>

    <div className="relative max-w-7xl mx-auto px-6 py-16">

      <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/50 text-slate-700 text-sm font-medium shadow-sm mb-6">
        🚀 AI Powered ATS Resume Screening
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
        AI Resume Screening
        <span className="block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
          & Candidate Ranking
        </span>
      </h1>

      <p className="mt-6 text-slate-600 max-w-3xl text-lg leading-relaxed">
        Upload resumes, compare candidates with job descriptions,
        calculate ATS scores and rank applicants automatically using
        intelligent resume screening.
      </p>

      {/* Feature Chips */}
      <div className="flex flex-wrap gap-3 mt-8">

        <span className="
px-3
py-1.5
bg-white/70
backdrop-blur-md
rounded-full
text-xs
font-medium
text-slate-700
shadow-sm
hover:-translate-y-1
hover:shadow-lg
hover:bg-white
transition-all
duration-300
cursor-default
">
          📄 Resume Parsing
        </span>

        <span className="
px-3
py-1.5
bg-white/70
backdrop-blur-md
rounded-full
text-xs
font-medium
text-slate-700
shadow-sm
hover:-translate-y-1
hover:shadow-lg
hover:bg-white
transition-all
duration-300
cursor-default
">
          🎯 ATS Scoring
        </span>

        <span className="
px-3
py-1.5
bg-white/70
backdrop-blur-md
rounded-full
text-xs
font-medium
text-slate-700
shadow-sm
hover:-translate-y-1
hover:shadow-lg
hover:bg-white
transition-all
duration-300
cursor-default
">
          🏆 Candidate Ranking
        </span>

        <span className="
px-3
py-1.5
bg-white/70
backdrop-blur-md
rounded-full
text-xs
font-medium
text-slate-700
shadow-sm
hover:-translate-y-1
hover:shadow-lg
hover:bg-white
transition-all
duration-300
cursor-default
">
          ⚡ PostgreSQL Powered
        </span>

      </div>

    </div>
  </div>

  <div className="max-w-7xl mx-auto px-6 py-10">

{/* Upload Resume */}
<div
  className="
  bg-white/70
  backdrop-blur-xl
  rounded-[32px]
  border
  border-white/50
  shadow-xl
  p-8
  mb-8
  hover:shadow-2xl
  transition-all
  duration-300
"
>

  <div className="flex items-center gap-4 mb-6">

    <div
      className="
      w-12
      h-12
      rounded-2xl
      bg-gradient-to-br
      from-sky-500
      to-blue-500
      flex
      items-center
      justify-center
      text-white
      text-xl
      shadow-lg
      "
    >
      📄
    </div>

    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Upload Resumes
      </h2>

      <p className="text-slate-500 mt-1">
        Upload one or multiple resumes for ATS analysis
      </p>
    </div>

  </div>

  <ResumeUpload
    files={files}
    setFiles={setFiles}
    handleUpload={handleUpload}
    successMessage={successMessage}
  />

</div>


{/* Job Description */}

<div
  className="
  bg-white/70
  backdrop-blur-xl
  rounded-[32px]
  border
  border-white/50
  shadow-xl
  p-8
  mb-8
  hover:shadow-2xl
  hover:-translate-y-1
  transition-all
  duration-300
"
>

  <div className="flex items-center gap-4 mb-6">

    <div
      className="
      w-12
      h-12
      rounded-2xl
      bg-gradient-to-br
      from-indigo-500
      to-sky-500
      flex
      items-center
      justify-center
      text-white
      text-xl
      shadow-lg
      "
    >
      📋
    </div>

    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Job Description
      </h2>

      <p className="text-slate-500 mt-1">
        Enter or upload the job requirements for candidate screening
      </p>
    </div>

  </div>

  <JobDescription
    jdText={jd}
    setJdText={setJd}
  />

</div>

    {/* Analyze Button */}
<div className="flex flex-col items-center mb-12">

  <button
    onClick={handleAnalyze}
    className="
    bg-gradient-to-r
    from-sky-500
    to-blue-500
    hover:scale-105
    hover:shadow-2xl
    hover:-translate-y-1
    hover:shadow-sky-200
    text-white
    px-10
    py-4
    rounded-2xl
    font-bold
    text-lg
    transition-all
    duration-300
    shadow-lg
    "
  >
    {loading
      ? "🔄 Analyzing..."
      : "🎯 Analyze Candidates"}
  </button>

  <p className="mt-4 text-slate-500 text-sm">
    AI Powered ATS Scoring • Resume Ranking • Skill Matching
  </p>

</div>

    {/* Dashboard Cards */}
<div className="grid md:grid-cols-3 gap-6 mb-12">

  {/* Total Resumes */}
  <div
    className="
    bg-white/70
    backdrop-blur-xl
    rounded-[28px]
    border
    border-white/50
    shadow-xl
    p-6
    hover:-translate-y-2
    hover:shadow-2xl
    transition-all
    duration-300
    "
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-slate-500 font-medium">
          Total Resumes
        </p>

        <h3 className="text-4xl font-bold text-slate-900 mt-3">
          {totalResumes}
        </h3>

      </div>

      <div
        className="
        w-16
        h-16
        rounded-2xl
        bg-sky-100
        flex
        items-center
        justify-center
        text-3xl
        "
      >
        📄
      </div>

    </div>

  </div>

  {/* Top Score */}
  <div
    className="
    bg-white/70
    backdrop-blur-xl
    rounded-[28px]
    border
    border-white/50
    shadow-xl
    p-6
    hover:-translate-y-2
    hover:shadow-2xl
    transition-all
    duration-300
    "
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-slate-500 font-medium">
          Top Score
        </p>

        <h3 className="text-4xl font-bold text-emerald-600 mt-3">
          {topScore}%
        </h3>

      </div>

      <div
        className="
        w-16
        h-16
        rounded-2xl
        bg-emerald-100
        flex
        items-center
        justify-center
        text-3xl
        "
      >
        🏆
      </div>

    </div>

  </div>

  {/* Matched Candidates */}
  <div
    className="
    bg-white/70
    backdrop-blur-xl
    rounded-[28px]
    border
    border-white/50
    shadow-xl
    p-6
    hover:-translate-y-2
    hover:shadow-2xl
    transition-all
    duration-300
    "
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-slate-500 font-medium">
          Matched Candidates
        </p>

        <h3 className="text-4xl font-bold text-sky-600 mt-3">
          {matchedCandidates}
        </h3>

      </div>

      <div
        className="
        w-12
        h-12
        rounded-2xl
        bg-sky-100
        flex
        items-center
        justify-center
        text-2xl
        "
      >
        🎯
      </div>

    </div>

  </div>

</div>
    {/* Candidate Rankings */}
    <div
  className="
  bg-white/70
  backdrop-blur-xl
  rounded-[32px]
  border
  border-white/50
  shadow-xl
  p-8
  hover:shadow-2xl
  transition-all
  duration-300
"
>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
       <h2 className="text-3xl font-bold text-slate-900">
  🏆 Candidate Rankings
</h2>
        <button
  onClick={downloadCSV}
  className="
  bg-slate-800
hover:bg-slate-900
hover:scale-105
transition-all
duration-300
shadow-lg
  text-white
  px-5
  py-3
  rounded-xl
  font-medium
  "
>
  Download CSV
</button>
<button
  onClick={downloadExcel}
  className="
  bg-sky-600
hover:bg-sky-700
hover:scale-105
transition-all
duration-300
shadow-lg
  text-white
  px-5
  py-3
  rounded-xl
  font-medium
  "
>
  Download Excel
</button>

        <input
          type="text"
          placeholder="🔍 Search Candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
border
border-slate-200
bg-white
shadow-md
rounded-2xl
px-5
py-3
md:w-80
focus:ring-4
focus:ring-sky-200
outline-none
transition-all
"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-sky-50 text-slate-700 border-b">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Candidate</th>
              <th className="p-4 text-left">Score</th>
              <th className="p-4 text-left">Matched Skills</th>
              <th className="p-4 text-left">Missing Skills</th>
              <th className="p-4 text-left">Status</th>
             <th className="p-4 text-left">
  Resume Preview
</th>
            </tr>
          </thead>

          <tbody>
  {results.length > 0 ? (
    filteredCandidates.map((candidate, index) => (
      <tr
        key={index}
        className="
border-b
hover:bg-sky-50
transition-all
duration-200
"
      >
        <td className="p-4 font-bold">
  #{candidate.rank}
</td>

        <td className="p-4 font-medium">
  {candidate.name
    .replace(".pdf", "")
    .replace(".docx", "")
    .replace(".doc", "")
  }
</td>

        <td className="p-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              candidate.score >= 80
                ? "bg-green-100 text-green-700"
                : candidate.score >= 50
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {candidate.score}%
          </span>
        </td>

        <td className="p-4">
          {candidate.matchedSkills?.join(", ")}
        </td>

        <td className="p-4 text-red-500">
          {candidate.missingSkills?.join(", ") || "None"}
        </td>
        <td className="p-4">
  <span
    className={`px-3 py-1 rounded-full text-sm font-semibold ${
      candidate.score >= 70
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {candidate.score >= 70
      ? "Qualified"
      : "Rejected"}
  </span>
</td>

<td className="p-4 flex gap-2">

  <a
    href={candidate.fileUrl}
    target="_blank"
    rel="noreferrer"
    className="
  bg-gradient-to-r from-sky-500 to-blue-500 hover:scale-105 transition-all duration-300
    text-white
    px-3
    py-2
    rounded-lg
    text-sm
    "
  >
    View Resume
  </a>

  <a
    href={candidate.fileUrl}
    download
    className="
   bg-gradient-to-r from-indigo-500 to-blue-500 hover:scale-105 transition-all duration-300
    text-white
    px-3
    py-2
    rounded-lg
    text-sm
    "
  >
    Download
  </a>

</td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="7"
        className="text-center p-8 text-gray-500"
      >
        <div className="py-12">

  <div className="text-5xl mb-3">
    📊
  </div>

  <p className="font-semibold text-lg text-slate-700">
    No Candidate Data
  </p>

  <p className="text-slate-500 mt-2">
    Upload resumes and click Analyze Candidates
  </p>

</div>
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>

  </div>
</div>


);
}

export default Home;
