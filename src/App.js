import React, { useState } from "react";
import { FaMoon, FaSun, FaDownload } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "https://resume-analyzer-backend-18s0.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a resume");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_desc", jobDesc);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const content = JSON.stringify(result, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_report.json";
    a.click();
  };

  const chartData = result
    ? [
        { name: "Found", value: result.skills_found.length },
        { name: "Missing", value: result.missing_skills.length },
      ]
    : [];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resume Analyzer AI 🤖</h1>

        <button onClick={toggleDarkMode} className="text-xl">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <textarea
          className="w-full mt-3 p-3 rounded border dark:bg-gray-700"
          placeholder="Enter job description..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          Analyze Resume
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center mt-10">
          <ClipLoader color="#3b82f6" size={50} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">

          {/* ATS Score */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <h2 className="text-xl">ATS Match Score</h2>
            <p className="text-4xl font-bold text-green-500">
              {result.match_score}%
            </p>
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">Skill Distribution</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Skills */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Skills Found</h3>
              <ul>
                {result.skills_found.map((s, i) => (
                  <li key={i}>✅ {s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Missing Skills</h3>
              <ul>
                {result.missing_skills.map((s, i) => (
                  <li key={i}>❌ {s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-2">AI Suggestions</h3>
            <pre className="whitespace-pre-wrap">{result.suggestion}</pre>
          </div>

          {/* Download */}
          <button
            onClick={downloadReport}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaDownload /> Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default App;