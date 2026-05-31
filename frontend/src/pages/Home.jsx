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
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

 {/* Header */}
<div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
  <div className="max-w-7xl mx-auto px-6 py-10">

   <h1 className="text-6xl font-extrabold text-white">
      AI Resume Screening Platform
    </h1>

    <p className="mt-5 text-slate-300 max-w-3xl text-lg">
      Upload resumes, compare candidates with job descriptions,
      calculate ATS scores and rank applicants automatically.
    </p>

  </div>
</div>

  <div className="max-w-7xl mx-auto px-6 py-10">

    {/* Upload Resume */}
<div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 mb-8 transition-all duration-300">
  <h2 className="text-4xl font-bold mb-6">
    Upload Resumes
  </h2>

  <ResumeUpload
    files={files}
    setFiles={setFiles}
    handleUpload={handleUpload}
    successMessage={successMessage}
  />
</div>

   {/* Job Description */}

<div className="mb-8">
  <JobDescription
    jdText={jd}
    setJdText={setJd}
  />
</div>

    {/* Analyze Button */}
    <div className="mb-10">
      <button
  onClick={handleAnalyze}
  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-2xl text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
>
  {loading ? "Analyzing..." : "Analyze Candidates"}
</button>
    </div>

    {/* Dashboard Cards */}
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
        <p className="text-gray-500">Total Resumes</p>
        <h3 className="text-4xl font-bold mt-2">{totalResumes}</h3>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-500">Top Score</p>
        <h3 className="text-4xl font-bold text-green-600 mt-2">
          {topScore}%
        </h3>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-500">Matched Candidates</p>
        <h3 className="text-4xl font-bold text-blue-600 mt-2">
          {matchedCandidates}
        </h3>
      </div>
    </div>

    {/* Candidate Rankings */}
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold">
          Candidate Rankings
        </h2>
        <button
  onClick={downloadCSV}
  className="
  bg-green-600
  hover:bg-green-700
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
  bg-emerald-600
  hover:bg-emerald-700
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
          className="border border-slate-300 rounded-2xl px-5 py-3 md:w-80 focus:ring-4 focus:ring-blue-200 outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
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
        className="border-b hover:bg-blue-50 transition-all duration-200"
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
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
   bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all duration-300
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
   bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 transition-all duration-300
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
        No candidates analyzed yet
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
