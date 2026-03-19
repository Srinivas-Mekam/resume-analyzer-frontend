import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const uploadResume = async () => {
    if (!file) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_desc", jobDesc);

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setData(result);
    } catch (err) {
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  const score = data ? data.skills_found.length * 15 : 0;

  return (
    <div className="container">
      <h2>📄 AI Resume Analyzer</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <textarea
        placeholder="Paste Job Description"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button onClick={uploadResume}>Analyze Resume</button>

      {loading && <p>⏳ Analyzing...</p>}

      {data && (
        <div className="result">
          <h3>✅ Skills Found</h3>
          {data.skills_found.map((s, i) => (
            <span key={i} className="skill">{s}</span>
          ))}

          <h3>❌ Missing Skills</h3>
          {data.missing_skills.map((s, i) => (
            <span key={i} className="skill missing">{s}</span>
          ))}

          <h3>📊 Score: {score}/100</h3>

          <h3>🎯 Match Score: {data.match_score}%</h3>

          <h3>💡 Suggestions</h3>
          <p>{data.suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default App;