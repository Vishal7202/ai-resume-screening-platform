import { useState } from "react";

const JobDescription = ({ jdText, setJdText }) => {

  return (
    <textarea
      rows="8"
      value={jdText}
      onChange={(e)=>setJdText(e.target.value)}
      placeholder="Paste Job Description"
    />
  );
};

export default JobDescription;