// src/components/UploadForm.jsx
import { useState } from "react";
import axios from "axios";

export default function UploadForm({ onResult }) {
  const [file, setFile] = useState(null);
  const [examType, setExamType] = useState("assignment");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a DOCX file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("exam_type", examType);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/process",
        formData
      );
      onResult(res.data);
      console.log(res.data)
    } catch (err) {
      alert("Error processing file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Question Bank</h2>

      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <select value={examType} onChange={(e) => setExamType(e.target.value)}>
        <option value="assignment">Assignment</option>
        <option value="mid">Mid Exam</option>
      </select>

      <br /><br />

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Generate Paper"}
      </button>
    </form>
  );
}
