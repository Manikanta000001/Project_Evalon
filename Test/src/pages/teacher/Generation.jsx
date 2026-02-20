
import Preview from "../../components/Preview";


import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";



// testing logic
import React, { useState, useRef, useEffect } from "react";
import {
  FileCheck,
  Sparkles,
  Upload,
  ArrowLeft,
  Printer,
  Calendar,
  Clock,
  BookOpen,
  Layers,
  GraduationCap,
  Hash,
  FileText,
  CheckCircle2,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  Loader2,
  Info,
  ChevronRight,
  SearchCode,
  ScanSearch,
  XCircle,
  RefreshCcw,
  Binary,
  Cloud,
  FileDigit,
  FileType,
  Moon,
  Sun,
  Layout,
  Settings2,
  History,
  Database,
  Code,
  Timer,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

/**
 * ACTION FEEDBACK TOAST
 */
const ActionFeedback = ({ show, type, message }) => {
  if (!show) return null;
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-4 duration-500">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
          type === "success"
            ? "bg-emerald-500/90 border-emerald-400 text-white"
            : "bg-blue-600/90 border-blue-400 text-white"
        }`}
      >
        {type === "success" ? (
          <CheckCircle2 size={18} className="animate-bounce" />
        ) : (
          <FileDigit size={18} className="animate-pulse" />
        )}
        <span className="font-bold text-sm tracking-tight">{message}</span>
      </div>
    </div>
  );
};

/**
 * CUSTOM NOTIFICATION MODAL
 */
const NotificationModal = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  showInput,
  inputValue,
  setInputValue,
  isDark,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} rounded-[2rem] shadow-2xl max-w-md w-full p-8 border animate-in zoom-in-95 duration-300`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
            type === "warning"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-blue-500/10 text-blue-500"
          }`}
        >
          {type === "warning" ? <AlertCircle size={28} /> : <Info size={28} />}
        </div>
        <h3
          className={`text-xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </h3>
        <p
          className={`font-medium mb-6 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {message}
        </p>

        {showInput && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-full p-4 rounded-xl border mb-6 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
            placeholder="e.g. Mid_Term_2024"
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${isDark ? "text-slate-500 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-50"}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Generation() {



  // --- Global States ---
  const { dark: isDark } = useOutletContext() || {};

  const [backendResult, setBackendResult] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [parseError, setParseError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const [actionFeedback, setActionFeedback] = useState({
    show: false,
    type: "",
    message: "",
  });
  const fileInputRef = useRef(null);

  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
    action: null,
    showInput: false,
  });
  const [repoName, setRepoName] = useState("");

  const [formData, setFormData] = useState({
    regulation: "",
    examType: "",
    degree: "",
    department: "",
    year: "",
    semester: "",
    commonTo: [],
    paperType: "",
    courseName: "",
    courseId: "",
    date: "",
    startTime: "",
    endTime: "",
    session: "",
  });
  const [file, setFile] = useState(null);

  const regulations = ["R21", "R22", "R23", "R29"];
  const examTypes = [
    "Assignment 1",
    "Assignment 2",
    "Mid 1",
    "Mid 2",
    "Semester End",
  ];
  const degrees = ["B.Tech", "M.Tech", "MBA", "MCA"];
  const years = ["I", "II", "III", "IV"];
  const semesters = ["I", "II"];
  const sessions = ["Forenoon", "Afternoon"];
  const departments = ["CSE", "ECE", "EEE", "IT", "MECH", "CIVIL"];

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleCommonTo = (dept) => {
    setFormData((prev) => ({
      ...prev,
      commonTo: prev.commonTo.includes(dept)
        ? prev.commonTo.filter((d) => d !== dept)
        : [...prev.commonTo, dept],
    }));
  };

const downloadPDF = async () => {
  const node = document.getElementById("printable-paper");

  const dataUrl = await toPng(node, {
    backgroundColor: "#fff",
    pixelRatio: 2,
  });

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const img = new Image();
  img.src = dataUrl;

  img.onload = () => {
    const imgHeight = (img.height * pageWidth) / img.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(dataUrl, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Exam_Paper.pdf");
  };
};

  const isFormFilled = () => {
    const req = [
      "regulation",
      "examType",
      "degree",
      "year",
      "semester",
      "courseName",
      "date",
      "startTime",
      "endTime",
      "session",
    ];
    return req.every((f) => !!formData[f]);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith(".docx")) {
      setFile(selected);
      setParseSuccess(false);
      setParseError(false);
    } else if (selected) {
      showActionFeedback("info", "Only .docx files are allowed");
      e.target.value = null;
    }
  };

  const startParsing = async () => {
    if (!file) return;

    setIsParsing(true);
    setParseSuccess(false);
    setParseError(false);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("examType", formData.examType);

      const res = await axios.post("http://127.0.0.1:8000/process", form);

      // 🔑 store backend response AS-IS
      setBackendResult(res.data);

      setParseSuccess(true);
      showActionFeedback("success", "Document parsed successfully");
    } catch (err) {
      console.error(err)
      setParseError(true);
      showActionFeedback("error", "Document analysis failed");
    } finally {
      setIsParsing(false);
    }
  };

  const showActionFeedback = (type, message) => {
    setActionFeedback({ show: true, type, message });
    setTimeout(
      () => setActionFeedback({ show: false, type: "", message: "" }),
      3000,
    );
  };

  const triggerSave = () => {
    setModal({
      open: true,
      type: "info",
      title: "Cloud Repository",
      message:
        "Enter a filename to sync this draft across all exam cell terminals.",
      showInput: true,
      action: () => {
        setModal({ open: false });
        showActionFeedback(
          "success",
          `Paper synced to cloud as "${repoName || "Untitled"}"`,
        );
      },
    });
  };

  const triggerDownload = () => {
    setModal({
      open: true,
      type: "warning",
      title: "Confirm Final Output",
      message:
        "Generated documents are locked for auditing. Ensure all metadata is correct.",
      showInput: false,
      action: () => {
        setModal({ open: false });
        showActionFeedback("info", "Compiling assets...");
        downloadPDF();
        setTimeout(
          () => showActionFeedback("success", "Download ready!"),
          1500,
        );
      },
    });
  };

  const inputClasses = `w-full p-3.5 rounded-xl border transition-all outline-none font-semibold ${
    isDark
      ? "bg-slate-800/50 border-slate-700 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      : "bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
  }`;

  const labelClasses = `text-[10px] font-black uppercase tracking-widest mb-1.5 block ${
    isDark ? "text-slate-500" : "text-slate-400"
  }`;

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${isDark ? " text-slate-200" : " text-slate-900"} p-4 md:p-8 font-sans`}
    >
      <ActionFeedback {...actionFeedback} />

      <NotificationModal
        isOpen={modal.open}
        {...modal}
        isDark={isDark}
        onCancel={() => setModal({ open: false })}
        onConfirm={modal.action}
        inputValue={repoName}
        setInputValue={setRepoName}
      />

      {!showPreview ? (
        <main className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div
            className={`rounded-3xl p-8 border ${isDark ? "bg-slate-900/50 border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                  <Layout size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight leading-none">
                    Exam Configuration
                  </h1>
                  <span className="text-[11px] font-bold text-blue-500 tracking-widest uppercase">
                    Exam meta data
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className={labelClasses}>Regulation Authority</label>
                <select
                  value={formData.regulation}
                  onChange={(e) =>
                    handleInputChange("regulation", e.target.value)
                  }
                  className={inputClasses}
                >
                  <option value="">Select Protocol</option>
                  {regulations.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Examination Category</label>
                <select
                  value={formData.examType}
                  onChange={(e) =>
                    handleInputChange("examType", e.target.value)
                  }
                  className={inputClasses}
                >
                  <option value="">Select Category</option>
                  {examTypes.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Academic Degree</label>
                <select
                  value={formData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Select Degree</option>
                  {degrees.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      handleInputChange("semester", e.target.value)
                    }
                    className={inputClasses}
                  >
                    <option value="">Sem</option>
                    {semesters.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className={labelClasses}>
                  Multidisciplinary Mapping (Common To)
                </label>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => toggleCommonTo(dept)}
                      className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all border ${
                        formData.commonTo.includes(dept)
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : isDark
                            ? "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600"
                            : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100/10">
                <div>
                  <label className={labelClasses}>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className={inputClasses}
                  >
                    <option value="">Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>Course code (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="CS-601"
                      value={formData.courseId}
                      onChange={(e) =>
                        handleInputChange("courseId", e.target.value)
                      }
                      className={inputClasses + " pl-12"}
                    />
                    <Binary
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Full Course Title</label>
                  <input
                    type="text"
                    placeholder="Quantum Computing Basics"
                    value={formData.courseName}
                    onChange={(e) =>
                      handleInputChange("courseName", e.target.value)
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Scheduled Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                <div>
                  <label className={labelClasses}>Session</label>
                  <select
                    value={formData.session}
                    onChange={(e) =>
                      handleInputChange("session", e.target.value)
                    }
                    className={inputClasses}
                  >
                    <option value="">Select Session</option>
                    {sessions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Time Window</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        handleInputChange("startTime", e.target.value)
                      }
                      className={inputClasses.replace("p-3.5", "p-2")}
                    />
                    <span className="text-slate-500 font-bold">/</span>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        handleInputChange("endTime", e.target.value)
                      }
                      className={inputClasses.replace("p-3.5", "p-2")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-3xl p-8 border flex flex-col ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Database size={18} className="text-blue-500" />
                Question Bank
              </h2>
            </div>

            <div
              onClick={() => !file && fileInputRef.current?.click()}
              className={`group flex-1 min-h-[260px] rounded-2xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden ${
                parseSuccess
                  ? isDark
                    ? "bg-emerald-500/5 border-emerald-500/30"
                    : "bg-emerald-50 border-emerald-200"
                  : parseError
                    ? isDark
                      ? "bg-rose-500/5 border-rose-500/30"
                      : "bg-rose-50 border-rose-200"
                    : isParsing
                      ? isDark
                        ? "bg-blue-500/5 border-blue-500/30"
                        : "bg-blue-50 border-blue-200"
                      : file
                        ? isDark
                          ? "bg-slate-800 border-blue-500"
                          : "bg-slate-50 border-blue-400"
                        : isDark
                          ? "bg-slate-800/50 border-slate-700 hover:border-blue-500"
                          : "bg-slate-50 border-slate-200 hover:border-blue-400 cursor-pointer"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                className="hidden"
                onChange={handleFileChange}
              />

              {isParsing ? (
                <div className="space-y-6 flex flex-col items-center relative z-10">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                    >
                      <ScanSearch size={36} className="animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 animate-ping opacity-20"></div>
                  </div>
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-black tracking-tight text-blue-500">
                      PARSING DOCX
                    </h4>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Extracting question nodes...
                    </p>
                  </div>
                </div>
              ) : parseError ? (
                <div className="space-y-6 flex flex-col items-center w-full max-w-sm">
                  <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
                    <AlertCircle size={32} />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-black text-rose-500">
                      Syntax Error
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">
                      Metadata Validation Failed
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startParsing(false);
                    }}
                    className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl"
                  >
                    <RefreshCcw size={16} /> RE-ANALYZE
                  </button>
                </div>
              ) : parseSuccess ? (
                <div className="space-y-6 flex flex-col items-center w-full max-w-sm">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-black text-emerald-500">
                      Assets Loaded
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">
                      5 Sections / 20 Questions
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!backendResult) return;
                      setShowPreview(true);
                    }}
                    disabled={!isFormFilled()}
                    className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                      isFormFilled()
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:scale-[1.02]"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    GENERATE PAPER
                  </button>
                </div>
              ) : file ? (
                <div className="space-y-6 flex flex-col items-center w-full max-w-sm">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? "bg-slate-700 text-blue-400" : "bg-white text-blue-600 border border-slate-100"}`}
                  >
                    <FileCheck size={32} />
                  </div>
                  <div className="text-center px-4">
                    <h4
                      className={`text-sm font-black truncate max-w-[200px] ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      {file.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">
                      Awaiting Command
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startParsing(false);
                    }}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <SearchCode size={18} /> PARSE
                  </button>
                </div>
              ) : (
                <div className="text-center group-hover:scale-105 transition-transform">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all ${isDark ? "bg-slate-800 text-slate-600 group-hover:bg-blue-500/10 group-hover:text-blue-400" : "bg-white text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 shadow-sm border border-slate-100"}`}
                  >
                    <Upload size={32} />
                  </div>
                  <h4
                    className={`font-black text-sm mb-1 ${isDark ? "text-slate-300" : "text-slate-800"}`}
                  >
                    Drop Paper Sources
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    DOCX Document only
                  </p>
                </div>
              )}

              {isParsing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60 animate-[scan_1.5s_linear_infinite]"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <a
              href="#"
              className={`group flex items-center gap-4 px-8 py-4 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? "bg-slate-900/50 border-slate-800 hover:border-blue-500 hover:bg-blue-500/5"
                  : "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? "bg-slate-800 text-blue-400 group-hover:bg-blue-500/20" : "bg-slate-50 text-blue-600 group-hover:bg-blue-500 shadow-sm group-hover:text-white"}`}
              >
                <Info size={20} />
              </div>
              <div className="text-left">
                <p
                  className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  How a document should be structured
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                  Technical formatting guidelines
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </main>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">
          <header
            className={` top-4 z-50 flex flex-col md:flex-row justify-between items-center p-4  border backdrop-blur-md gap-4 ${isDark ? "bg-slate-900/80 border-slate-800 shadow-2xl" : "bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50"}`}
          >
            <button
              onClick={() => setShowPreview(false)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
            >
              <ArrowLeft size={16} /> Exit Editor
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center p-1 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
              >
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 10, 50))}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="px-4 text-[11px] font-black min-w-[60px] text-center text-blue-500">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 10, 200))}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden md:block mx-1" />
  
              <button
                onClick={triggerSave}
                className={`p-3 rounded-xl transition-all border ${isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600 shadow-sm"}`}
              >
                <Save size={20} />
              </button>
              <button
                onClick={triggerDownload}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/30 font-black text-[11px] uppercase hover:bg-blue-700 transition-all active:scale-95"
              >
                <Download size={18} /> Export PDF
              </button>
            </div>
          </header>

          <div    style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
        }}
            className={` p-8 md:p-16 overflow-auto min-h-[310mm] flex justify-center border-2 border-white dark:border-slate-800 shadow-inner ${isDark ? "bg-slate-900/50" : "bg-slate-200/50"}`}
          >

{backendResult && (
  <Preview
    backendData={backendResult}
    meta={formData}
     zoomLevel={zoomLevel}
  />
)}

 
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        @media print {
  body * {
    visibility: hidden;
  }

  .print-area,
  .print-area * {
    visibility: visible;
  }

  .print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm;
    min-height: 297mm;
    box-shadow: none !important;
    transform: none !important;
  }
}

        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; }
      `}</style>
    </div>
  );
}
