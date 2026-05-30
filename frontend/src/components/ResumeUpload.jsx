import { useState } from "react";
import API from "../services/api";

const ResumeUpload = ({ setUploadedResumes }) => {

  const [files, setFiles] = useState([]);

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
    <>
      <input
        type="file"
        multiple
        onChange={(e)=>setFiles([...e.target.files])}
      />

      <button onClick={handleUpload}>
        Upload
      </button>
    </>
  );
};

export default ResumeUpload;