import React, { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  ChevronRight,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Clock,
  Target,
  Users,
  Building2,
  CalendarCheck,
  Code,
  Check,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useOutletContext } from "react-router-dom";
import { parseMCQExcelStrict } from "../../utils/parseExcel";
import CodingLab from "./Codinglab";

export default function AssessmentStudio() {
  // Mock Dark Mode State
  const { dark: isDarkMode } = useOutletContext() || {};
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [excelFile, setExcelFile] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    duration: null,
    passGrade: "",
    department: "",
    year: "2023-2027",
    section: [],
    startDate: "",
    endDate: "",
  });

  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploaded, parsing, success, error
  const [fileName, setFileName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // coding lab

  const [includeCoding, setIncludeCoding] = useState(false);
  const [codingQuestions, setCodingQuestions] = useState([]);

  const [currentCodingQuestion, setCurrentCodingQuestion] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    marks: "",
    difficulty: "Easy",
    testCases: [{ input: "", output: "", hidden: false }],
  });

  const [codingExcelFile, setCodingExcelFile] = useState(null);
  const [codingUploadStatus, setCodingUploadStatus] = useState("idle");
  const [codingPerStudent, setCodingPerStudent] = useState("1");

  // Input Handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error if user starts fixing fields
    if (errorMessage) setErrorMessage("");
  };

  // Simulated File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file); // ✅ store file
      setFileName(file.name);
      setUploadStatus("uploaded");
      setErrorMessage("");
    }
  };
  //helper
  const extractYearCode = (batch) => {
    // "2023-2027" -> "23"
    return batch.slice(2, 4);
  };

  // Logic: Ensure all fields are filled and dates are logical
  const handleParse = async () => {
    const { title, passGrade, department, startDate, endDate } = formData;

    if (!title || !passGrade || !department || !startDate || !endDate) {
      setErrorMessage("All details are required.");
      setUploadStatus("error");
      return;
    }

    if (!excelFile) {
      setErrorMessage("Please upload an Excel file.");
      setUploadStatus("error");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setErrorMessage("End date must be after start date.");
      setUploadStatus("error");
      return;
    }

    try {
      setUploadStatus("parsing");

      const questions = await parseMCQExcelStrict(excelFile);

      console.log("✅ PARSED QUESTIONS:", questions);

      setParsedQuestions(questions);
      setUploadStatus("success");
    } catch (err) {
      console.error(err.message);
      setErrorMessage(err.message);
      setUploadStatus("error");
    }
  };

  const handleCreateExam = async () => {
    if (!canCreateExam) {
      setErrorMessage("Please fix question data before creating exam.");
      return;
    }
    if (includeCoding) {
      if (!codingPerStudent) {
        setErrorMessage("Please set Coding Questions Per Student.");
        return;
      }

      if (Number(codingPerStudent) > codingQuestions.length) {
        setErrorMessage(
          "Coding per student cannot exceed total coding questions.",
        );
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const allQuestions = [
        // MCQ mapping (keep safe)
        ...parsedQuestions.map((q) => ({
          type: "mcq",
          text: q.text,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
        })),

        // CODING mapping (IMPORTANT FIX)
        ...codingQuestions.map((q) => ({
          type: "coding",
          text: q.title, // 👈 map title → text
          description: q.description,
          inputFormat: q.inputFormat,
          outputFormat: q.outputFormat,
          marks: Number(q.marks),
          difficulty: q.difficulty,

          // 👇 FIX TEST CASE FIELD NAMES
          testCases: q.testCases.map((tc) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput, // 👈 rename
            isHidden: tc.isHidden, // 👈 rename
          })),
        })),
      ];

      const payload = {
        title: formData.title,
        durationMinutes: Number(formData.duration),
        passPercentage: Number(formData.passGrade),
        department: formData.department,
        year: extractYearCode(formData.year),
        section: formData.section.length === 0 ? ["ALL"] : formData.section,

        startAt: formData.startDate?.toISOString(),
        endAt: formData.endDate?.toISOString(),
        codingPerStudent: includeCoding ? Number(codingPerStudent) : 0,
        questions: allQuestions,
      };

      const res = await fetch("http://localhost:5000/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Exam creation failed");
      }

      const data = await res.json();

      console.log("✅ Exam created:", data);

      // ✅ ONLY show success if backend confirms
      setShowSuccessModal(true);
    } catch (err) {
      console.error("❌ Exam creation failed:", err.message);

      setErrorMessage("Exam creation failed. Please try again.");
      setUploadStatus("error");
    }
  };

  const resetAll = () => {
    setShowSuccessModal(false);
    setUploadStatus("idle");
    setCodingUploadStatus("idle");
    setFileName("");
    setExcelFile(null); // ✅ reset file
    setCodingExcelFile(null);
    setParsedQuestions([]);
    setCodingQuestions([]);
    setErrorMessage("");
    setIncludeCoding(false);
    setCodingPerStudent("1");

    setFormData({
      title: "",
      duration: "40 Mins",
      passGrade: "",
      department: "",
      year: "2023-2027",
      section: [], // array
      startDate: "",
      endDate: "",
    });
  };
  const toggleSection = (sec) => {
    setFormData((prev) => {
      let updated = [...prev.section];

      if (updated.includes("ALL")) {
        updated = []; // remove ALL if selecting specific
      }

      if (updated.includes(sec)) {
        updated = updated.filter((s) => s !== sec);
      } else {
        updated.push(sec);
      }

      return { ...prev, section: updated };
    });
  };

  // validation
  const isMCQValid = uploadStatus === "success";

  const isCodingValid =
    !includeCoding ||
    (codingQuestions.length > 0 &&
      codingPerStudent &&
      Number(codingPerStudent) >= 1 &&
      Number(codingPerStudent) <= codingQuestions.length);

  const canCreateExam = isMCQValid && isCodingValid;
  const sections = ["A", "B", "C"];

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <div
        className={`${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        } p-8 rounded-2xl border shadow-xl max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500`}
      >
        {/* ---------- Header ---------- */}
        <div className="flex items-center justify-between mb-10">
          {/* LEFT SIDE */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <Plus size={24} />
            </div>
            <div>
              <h2
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}
              >
                Assessment Studio
              </h2>
              <p className="text-slate-500 text-sm">
                Configure academic examination parameters and question data
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIncludeCoding(!includeCoding)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                includeCoding
                  ? "bg-blue-600/10 border-blue-500 text-blue-500"
                  : isDarkMode
                    ? "border-slate-800 text-slate-500"
                    : "border-slate-200 text-slate-400"
              }`}
            >
              <Code size={18} />
              <span className="text-sm font-bold">Include Coding?</span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  includeCoding
                    ? "bg-blue-500 border-blue-500"
                    : "border-slate-400"
                }`}
              >
                {includeCoding && <Check size={12} className="text-white" />}
              </div>
            </button>
          </div>
        </div>

        {/* ---------- Main Form Grid ---------- */}
        <div className="space-y-8">
          {/* Section 1: Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
                Title of Examination
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. Advanced Thermodynamics Final"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
<div>
  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
    Duration (Minutes)
  </label>

  <input
    type="number"
    list="duration-options"
    value={formData.duration}
    onChange={(e) => handleInputChange("duration", e.target.value)}
    placeholder="45 mins"
    className={`w-full px-4 py-3 rounded-xl border outline-none no-spinner ${
      isDarkMode
        ? "bg-slate-800 border-slate-700 text-white"
        : "bg-slate-50 border-slate-200 text-slate-800"
    }`}
  />

  <datalist id="duration-options">
    <option value="45" />
    <option value="60" />
    <option value="90" />
    <option value="120" />
  </datalist>
</div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
                  Pass %
                </label>
                <input
                  type="number"
                  value={formData.passGrade}
                  onChange={(e) =>
                    handleInputChange("passGrade", e.target.value)
                  }
                  placeholder="40"
                  className={`no-spinner w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Targeting */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
              >
                <option value="">Select Dept</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>IT</option>
                <option>MECH</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
              >
                <option>2023-2027</option>
                <option>2024-2028</option>
                <option>2025-2029</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
                Sections
              </label>

              <div className="flex flex-wrap gap-2">
                {sections.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => toggleSection(sec)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all border ${
                      formData.section.includes(sec)
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : isDarkMode
                          ? "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {sec}
                  </button>
                ))}

                {/* Optional ALL button */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      section: prev.section.includes("ALL") ? [] : ["ALL"],
                    }))
                  }
                  className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all border ${
                    formData.section.includes("ALL")
                      ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20"
                      : isDarkMode
                        ? "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  All Sections
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Schedule (Calendars) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full">
            <div className="md:col-span-3">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400 flex items-center gap-2">
                <Calendar size={14} /> Start Date & Time
              </label>
              <DatePicker
                selected={
                  formData.startDate ? new Date(formData.startDate) : null
                }
                onChange={(date) => handleInputChange("startDate", date)}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd hh:mm aa"
                placeholderText="Select start date & time"
                wrapperClassName="w-full"
                className={`w-full min-w-0 px-4 py-3 rounded-xl border outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
            <div  className="md:col-span-3">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400 flex items-center gap-2">
                <Calendar size={14} /> End Date & Time
              </label>
              <DatePicker
                selected={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(date) => handleInputChange("endDate", date)}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd hh:mm aa"
                minDate={formData.startDate}
                placeholderText="Select end date & time"
                wrapperClassName="w-full"
                className={`w-full min-w-0 px-4 py-3 rounded-xl border outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>

          {/* ---------- Enhanced Upload Section ---------- */}
          <div className="space-y-4 pt-4">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
              Question Data Assets
            </label>

            <div
              className={`relative p-10 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4 group overflow-hidden ${
                uploadStatus === "success"
                  ? "border-green-500 bg-green-50/10"
                  : uploadStatus === "error"
                    ? "border-red-500 bg-red-50/10"
                    : isDarkMode
                      ? "bg-slate-800/50 border-slate-700 hover:border-blue-500"
                      : "bg-slate-50 border-slate-200 hover:border-blue-400"
              }`}
            >
              {/* Animated Background Icon */}
              <div
                className={`absolute -right-8 -bottom-8 opacity-5 transition-transform duration-700 ${uploadStatus !== "idle" ? "scale-150 rotate-12" : ""}`}
              >
                <FileSpreadsheet size={200} />
              </div>

              {/* Icon Container */}
              <div
                className={`p-5 rounded-2xl shadow-sm transition-all duration-500 ${
                  uploadStatus === "success"
                    ? "bg-green-500 text-white scale-110"
                    : uploadStatus === "error"
                      ? "bg-red-500 text-white animate-shake"
                      : isDarkMode
                        ? "bg-slate-800 text-blue-400"
                        : "bg-white text-blue-600"
                }`}
              >
                {uploadStatus === "idle" && <Upload size={40} />}
                {uploadStatus === "uploaded" && (
                  <FileSpreadsheet size={40} className="animate-bounce" />
                )}
                {uploadStatus === "parsing" && (
                  <Loader2 size={40} className="animate-spin text-blue-500" />
                )}
                {uploadStatus === "success" && <CheckCircle2 size={40} />}
                {uploadStatus === "error" && <AlertCircle size={40} />}
              </div>

              <div className="z-10">
                <h4
                  className={`font-bold text-lg ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                >
                  {uploadStatus === "idle" &&
                    "Upload CSV or Excel Question Data"}
                  {uploadStatus === "uploaded" && "File Received!"}
                  {uploadStatus === "parsing" && "Analyzing Data..."}
                  {uploadStatus === "success" && "Parsing Complete"}
                  {uploadStatus === "error" && "Parsing Interrupted"}
                </h4>

                <p
                  className={`text-sm mt-1 font-medium ${uploadStatus === "error" ? "text-red-500" : "text-slate-500"}`}
                >
                  {uploadStatus === "error" ? (
                    errorMessage
                  ) : (
                    <>
                      {uploadStatus === "idle" &&
                        "Drag and drop your exam spreadsheet here"}
                      {uploadStatus === "uploaded" &&
                        `Ready to process: ${fileName}`}
                      {uploadStatus === "parsing" &&
                        "Mapping columns and validating row formats..."}
                      {uploadStatus === "success" &&
                        "All questions validated successfully."}
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons based on state */}
              <div className="flex gap-3 z-10 pt-2">
                {uploadStatus === "idle" && (
                  <label
                    className={`cursor-pointer px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                      isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    Select File
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv, .xlsx, .xls"
                      onChange={handleFileChange}
                    />
                  </label>
                )}

                {(uploadStatus === "uploaded" || uploadStatus === "error") && (
                  <>
                    <button
                      onClick={handleParse}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Upload size={16} /> Parse Document
                    </button>
                    <button
                      onClick={() => {
                        setUploadStatus("idle");
                        setErrorMessage("");
                      }}
                      className="px-4 py-3 text-slate-500 hover:text-red-500 text-sm font-semibold"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {includeCoding && (
          <CodingLab
            isDarkMode={isDarkMode}
            setCodingQuestions={setCodingQuestions}
            setCurrentCodingQuestion={setCurrentCodingQuestion}
            setCodingExcelFile={setCodingExcelFile}
            setCodingUploadStatus={setCodingUploadStatus}
            codingQuestions={codingQuestions}
            currentCodingQuestion={currentCodingQuestion}
            codingExcelFile={codingExcelFile}
            codingUploadStatus={codingUploadStatus}
            codingPerStudent={codingPerStudent}
            setCodingPerStudent={setCodingPerStudent}
          />
        )}

        {/* ---------- Footer Buttons ---------- */}
        <div
          className={`mt-12 pt-8 border-t flex flex-col md:flex-row gap-4 items-center justify-between ${
            isDarkMode ? "border-slate-800" : "border-slate-100"
          }`}
        >
          <button
            onClick={resetAll}
            className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:text-slate-400 transition-colors"
          >
            Discard Draft
          </button>

          <div className="flex gap-4">
            {/* Create Exam logic updated to trigger Modal */}
            {canCreateExam ? (
              <button
                onClick={handleCreateExam}
                className="px-10 py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-500/20 flex items-center gap-2 hover:translate-y-[-2px] hover:bg-green-700 transition-all animate-in zoom-in-95"
              >
                Create Exam Instance
                <Plus size={20} />
              </button>
            ) : (
              <button
                disabled
                className="px-10 py-4 bg-slate-200 text-slate-400 rounded-2xl font-black cursor-not-allowed flex items-center gap-2"
              >
                Continue to Questions
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- SUCCESS MODAL ---------- */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Blocks clicks to background
        >
          {/* Backdrop layer */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto" />

          <div
            className={`${
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100"
            } relative w-full max-w-xl rounded-[32px] border shadow-[0_32px_128px_-12px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 pointer-events-auto`}
          >
            {/* Modal Decorative Header */}
            <div className="bg-green-500 p-8 text-center text-white">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-500 fill-mode-both">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black">Examination Live!</h3>
              <p className="opacity-90">
                Your assessment has been created successfully.
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <MetaItem
                  icon={<Target className="text-blue-500" />}
                  label="Title"
                  value={formData.title || "Standard Quiz"}
                  delay="0"
                  isDark={isDarkMode}
                />
                <MetaItem
                  icon={<Clock className="text-orange-500" />}
                  label="Duration"
                  value={formData.duration}
                  delay="100"
                  isDark={isDarkMode}
                />
                <MetaItem
                  icon={<Building2 className="text-purple-500" />}
                  label="Dept"
                  value={formData.department || "General"}
                  delay="200"
                  isDark={isDarkMode}
                />
                <MetaItem
                  icon={<Users className="text-emerald-500" />}
                  label="Year/Sec"
                  value={`${formData.year} (${formData.section.join(", ") || "ALL"})`}
                  delay="300"
                  isDark={isDarkMode}
                />
                <MetaItem
                  icon={<CalendarCheck className="text-rose-500" />}
                  label="Pass %"
                  value={`${formData.passGrade || "40"}%`}
                  delay="400"
                  isDark={isDarkMode}
                />
              </div>

              {/* Date Detail Box */}
              <div
                className={`p-4 rounded-2xl ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"} border animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both`}
                style={{ animationDelay: "500ms" }}
              >
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                  <span>Start Window</span>
                  <span>End Window</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="truncate">
                    {formData.startDate
                      ? new Date(formData.startDate).toLocaleString()
                      : "Not Set"}
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 mx-2 flex-shrink-0"
                  />
                  <span className="truncate">
                    {formData.endDate
                      ? new Date(formData.endDate).toLocaleString()
                      : "Not Set"}
                  </span>
                </div>
              </div>

              <button
                onClick={resetAll}
                className="w-full py-4 bg-slate-900 text-white dark:bg-blue-600 rounded-2xl font-black text-lg shadow-xl hover:opacity-90 active:scale-[0.98] transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic CSS for Animations and Removing Number Input Spinners */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        .color-scheme-dark {
          color-scheme: dark;
        }
        /* Remove arrows (spinners) from number inputs */
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
        /* Block body scroll when modal is open */
        body {
          overflow: ${showSuccessModal ? "hidden" : "auto"};
        }
      `}</style>
    </div>
  );
}
// Sub-component for Modal Metadata Items
function MetaItem({ icon, label, value, delay, isDark }) {
  return (
    <div
      className={`flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-700 fill-mode-both`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`mt-1 p-2 rounded-lg flex-shrink-0 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
      >
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p
          className={`text-sm font-bold truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
