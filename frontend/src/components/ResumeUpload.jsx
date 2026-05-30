import { useState } from "react";
import API from "../services/api";

const ResumeUpload = ({
  files,
  setFiles,
  handleUpload,
  successMessage,
}) => {

  const [files, setFiles] = useState([]);
  const [fileType, setFileType] = useState("all");

  const handleUpload = async () => {

    const formData = new FormData();

    files.forEach(file => {
      formData.append("resumes", file);
    });

    try {

      const res = await API.post(
        "/upload",
        formData
      );

      setUploadedResumes(res.data);

      alert("Upload Success");

    } catch (err) {
      console.log(err);
    }
  };

 return (
  <div className="bg-white p-6 rounded-xl shadow-md border">
     <select
  className="w-full border rounded-lg p-3 mb-4"
  value={fileType}
  onChange={(e) =>
    setFileType(e.target.value)
  }

    >
      <option value="all">All Files</option>
      <option value="pdf">PDF</option>
      <option value="docx">DOCX</option>
      <option value="txt">TXT</option>
    </select>
      <input
  className="hidden"
  id="resume-upload"
  type="file"
  multiple
  accept=".pdf,.doc,.docx,.txt"
  onChange={(e) => {
    const newFiles = Array.from(
      e.target.files
    );

    setFiles((prev) => [
      ...prev,
      ...newFiles,
    ]);
  }}
/>
<button
  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 mb-4 hover:bg-gray-50"
  onClick={() =>
    document
      .getElementById("resume-upload")
      .click()
  }
>
  <div className="text-4xl mb-2">📄</div>

  <div className="font-semibold">
    Browse Resume Files
  </div>

  <div className="text-sm text-gray-500">
    PDF, DOCX, TXT Supported
  </div>
</button>


<div className="mb-3 font-semibold text-gray-700">
  Selected Resumes: {files.length}
</div>
{files.map((file, index) => (
  <div
  key={index}
  className="flex justify-between items-center border p-3 rounded-lg mb-2"
>
  <span>📄 {file.name}</span>

    <button 
  className="text-red-500 font-bold"
      onClick={() =>
        setFiles(
          files.filter(
            (_, i) => i !== index
          )
        )
      }
    >
      ❌
    </button>
  </div>
))}
<button
  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-3 hover:bg-blue-600"
  onClick={() =>
    document
      .getElementById("resume-upload")
      .click()
  }
>
  + Add More Resumes
</button>
     <button
  disabled={files.length === 0}
  className={`px-4 py-2 rounded-lg ml-3 text-white ${
    files.length === 0
      ? "bg-gray-400"
      : "bg-green-600 hover:bg-green-700"
  }`}
  onClick={handleUpload}
>
  Upload
</button>
     </div>
  );
};

export default ResumeUpload;