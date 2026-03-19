import React, { useState } from "react";

const API_URL = "https://resume-analyzer-backend-18s0.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);

  // Handle file upload
  const handleFileChange = (e) => { 
    setFile(e.target.files[0]);
  };

  // Handle job description input
  const handleJobDescChange = (e) => {
    setJobDesc(e.target.value);
  };

  // Call backend API
  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file); // MUST match backend
    formData.append("job_desc", jobDesc);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while analyzing resume");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Resume Analyzer AI 🤖</h2>

      {/* File Upload */}
      <input type="file" onChange={handleFileChange} />

      <br /><br />

      {/* Job Description */}
      <textarea
        placeholder="Enter job description (optional)"
        value={jobDesc}
        onChange={handleJobDescChange}
        rows={6}
        cols={60}
      />

      <br /><br />

      {/* Submit Button */}
      <button onClick={handleSubmit}>
        Analyze Resume
      </button>

      <br /><br />

      {/* Results */}
      {result && (
        <div>
          <h3>Results:</h3>

          <p>
            <strong>Match Score:</strong> {result.match_score}%
          </p>

          <h4>Skills Found:</h4>
          <ul>
            {result.skills_found.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h4>Missing Skills:</h4>
          <ul>
            {result.missing_skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h4>AI Suggestions:</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {result.suggestion}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;