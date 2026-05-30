import { useState } from "react";
import axios from "axios";

const JobDescription = ({
  jdText,
  setJdText,
}) => {

  const [fileName, setFileName] =
    useState("");

  const handleFileUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  setFileName(file.name);

  const formData = new FormData();

  formData.append(
    "jdFile",
    file
  );

  try {

    const response =
      await axios.post(
        "https://ai-resume-screening-backend-g2eh.onrender.com/upload-jd",
        formData
      );

    setJdText(
      response.data.jdText
    );

  } catch (error) {

    console.log(error);

    alert(
      "JD Upload Failed"
    );

  }

};

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Job Description
          </h2>

          <p className="text-slate-500 mt-1">
            Paste or upload a job description
            to compare candidates.
          </p>
        </div>

        <div className="mt-3 md:mt-0">
          <span
            className="
            bg-slate-100
            text-slate-700
            px-4
            py-2
            rounded-xl
            text-sm
            font-medium
            "
          >
            {jdText.length} Characters
          </span>
        </div>

      </div>

      {/* Upload Area */}
      <label
        className="
        flex
        items-center
        justify-center
        w-full
        border-2
        border-dashed
        border-slate-300
        rounded-2xl
        p-8
        bg-slate-50
        hover:bg-slate-100
        transition
        cursor-pointer
        mb-5
        "
      >

        <input
          type="file"
         accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="text-center">

          <div className="text-5xl mb-3">
            📄
          </div>

          <h3 className="font-semibold text-slate-800">
            Upload Job Description
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Select PDF, DOCX or TXT File
          </p>

        </div>

      </label>

      {/* File Loaded */}
      {fileName && (
        <div
          className="
          mb-5
          p-4
          rounded-2xl
          bg-green-50
          border
          border-green-200
          text-green-700
          "
        >
          ✅ {fileName} Loaded Successfully
        </div>
      )}

      {/* Textarea */}
      <textarea
        rows="10"
        value={jdText}
        onChange={(e) =>
          setJdText(e.target.value)
        }
        placeholder="Paste Job Description here..."
        className="
        w-full
        border
        border-slate-300
        rounded-2xl
        p-5
        resize-none
        focus:outline-none
        focus:ring-2
        focus:ring-slate-300
        "
      />

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">

        <div className="text-sm text-slate-500">
          ATS will compare candidate skills
          against this job description.
        </div>

        <button
          onClick={() => {
            setJdText("");
            setFileName("");
          }}
          className="
          bg-red-500
          hover:bg-red-600
          text-white
          px-5
          py-2
          rounded-xl
          transition
          "
        >
          Clear JD
        </button>

      </div>

    </div>
  );
};

export default JobDescription;