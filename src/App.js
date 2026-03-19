import React, { useState } from "react";
import ATSGauge from "./components/ATSGauge";
import Charts from "./components/Charts";
import Loader from "./components/Loader";
import { jsPDF } from "jspdf";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert("Upload resume");

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_desc", jobDesc);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Backend connection error");
    }

    setLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Resume Report", 10, 10);
    doc.text(`ATS Score: ${result.match_score}%`, 10, 20);
    doc.save("report.pdf");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">

      <h1 className="text-3xl font-bold mb-4">Resume Analyzer</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <textarea
        className="block w-full mt-4 p-2"
        rows={5}
        placeholder="Job Description"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Analyze
      </button>

      {loading && <Loader />}

      {result && (
        <div className="mt-6">
          <ATSGauge score={result.match_score} />
          <Charts skills={result.skills_found} />

          <button
            onClick={downloadPDF}
            className="mt-4 bg-green-500 px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;