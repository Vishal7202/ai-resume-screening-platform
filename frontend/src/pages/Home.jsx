import axios from "axios";
import { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";

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

return ( <div className="min-h-screen bg-[#F8FAFC]">

 {/* Header */}
<div className="bg-white border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-6 py-10">

    <h1 className="text-4xl font-bold text-slate-900">
      AI Resume Screening Platform
    </h1>

    <p className="mt-3 text-slate-500 max-w-3xl">
      Upload resumes, compare candidates with job descriptions,
      calculate ATS scores and rank applicants automatically.
    </p>

  </div>
</div>

  <div className="max-w-7xl mx-auto px-6 py-10">

    {/* Upload Resume */}
<div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8">
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8">
      <h2 className="text-2xl font-bold mb-4">
        Job Description
      </h2>

      <textarea
        rows="7"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste Job Description here..."
       className="
w-full
border
border-slate-300
rounded-2xl
p-5
focus:outline-none
focus:ring-2
focus:ring-slate-300
"
      />
    </div>

    {/* Analyze Button */}
    <div className="mb-10">
      <button
  onClick={handleAnalyze}
  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition"
>
  {loading ? "Analyzing..." : "Analyze Candidates"}
</button>
    </div>

    {/* Dashboard Cards */}
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
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
    <div className="bg-white rounded-2xl shadow-lg p-6">
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

        <input
          type="text"
          placeholder="🔍 Search Candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-3 md:w-80"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Candidate</th>
              <th className="p-4 text-left">Score</th>
              <th className="p-4 text-left">Matched Skills</th>
              <th className="p-4 text-left">Missing Skills</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
  {results.length > 0 ? (
    filteredCandidates.map((candidate, index) => (
      <tr
        key={index}
        className="border-b hover:bg-slate-50"
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
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="5"
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
