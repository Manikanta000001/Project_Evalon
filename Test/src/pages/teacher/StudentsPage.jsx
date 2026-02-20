import { useOutletContext } from "react-router-dom";

import React, { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  FileBarChart as FileBarChartIcon,
  Trash2 as Trash2Icon,
  Settings as SettingsIcon,
  LayoutDashboard as LayoutDashboardIcon,
  Clock as ClockIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  GraduationCap as GraduationCapIcon,
  UserCheck as UserCheckIcon,
  Download as DownloadIcon,
  AlertTriangle as AlertTriangleIcon,
  X as XIcon,
  Loader2 as Loader2Icon,
  FileText as FileTextIcon,
  CheckCircle2 as CheckIcon,
} from "lucide-react";

const StudentsPage = () => {
  const { dark: isDarkMode } = useOutletContext() || {};
  const [filter, setFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [examActive, setExamActive] = useState(null);

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [reportFormat, setReportFormat] = useState("pdf");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teacher/exams", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Status:", res.status);

        const text = await res.text();
        console.log("Raw response:", text);

        if (!res.ok) throw new Error(text);

        const data = JSON.parse(text);
        console.log(data);
        
        setExams(data);
      } catch (err) {
        console.error("Failed to load exams:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const getExamStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.startAt);
    const end = new Date(exam.endAt);

    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "live";
  };

  const filteredExams =
    filter === "all" ? exams : exams.filter((e) => getExamStatus(e) === filter);

  const statusConfig = {
    live: {
      label: "Live Now",
      bg: "bg-emerald-500/10 text-emerald-500",
      dot: "bg-emerald-500",
    },
    completed: {
      label: "Completed",
      bg: "bg-slate-500/10 text-slate-400",
      dot: "bg-slate-400",
    },
    upcoming: {
      label: "Upcoming",
      bg: "bg-blue-500/10 text-blue-400",
      dot: "bg-blue-500",
    },
  };

  const handleOpenReport = (exam) => {
    setExamActive(exam);
    setReportFormat("pdf");
    setDownloadComplete(false);
    setIsDownloading(false);
    setShowReportModal(true);
  };

const handleDownload = async () => {
  setIsDownloading(true);
  console.log("trying to fetch reports");

  const res = await fetch(
    `http://localhost:5000/api/exams/${examActive._id}/reports?format=${reportFormat}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Response object:", res);
  console.log("Content-Type:", res.headers.get("content-type"));

  if (!res.ok) {
    setIsDownloading(false);
    alert("Failed to download report");
    return;
  }

  // 🔴 IMPORTANT: use BLOB for Excel/PDF
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;

  // dynamic file name
  const extension = reportFormat === "excel" ? "xlsx" : "pdf";
  a.download = `${examActive.title}-report.${extension}`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setIsDownloading(false);
  setDownloadComplete(true);
};


  const confirmDelete = async () => {
    try {
      console.log("trying to fetch delete");

      await fetch(`http://localhost:5000/api/exams/${examActive._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExams((prev) => prev.filter((e) => e._id !== examActive._id));
      setShowDeleteModal(false);
      setExamActive(null);
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <div
      className={`flex min-h-screen font-sans antialiased transition-colors duration-500 rounded-2xl ${
        isDarkMode
          ? "bg-slate-900 text-slate-200"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Examination Hub
                </h1>
                <p className="text-slate-500 text-sm">
                  Monitor and manage institutional assessments.
                </p>
              </div>

              <div
                className={`flex items-center p-1 rounded-xl border ${
                  isDarkMode
                    ? "bg-[#0D1117] border-slate-800"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {["all", "live", "upcoming", "completed"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      filter === t
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {loading && (
                <div className="flex justify-center py-20">
                  <p className="text-slate-500 text-sm font-semibold animate-pulse">
                    Loading exams...
                  </p>
                </div>
              )}

              {!loading && filteredExams.length === 0 && (
                <div className="flex justify-center py-20">
                  <p className="text-slate-500 text-sm font-semibold">
                    No exams found
                  </p>
                </div>
              )}

              {!loading &&
                filteredExams.map((exam) => {
                  const status = getExamStatus(exam);
                  return (
                    <div
                      key={exam._id}
                      className={`flex flex-col lg:flex-row lg:items-center gap-6 py-5 px-6 rounded-2xl border transition-all duration-300 ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                          : "bg-white border-slate-200 hover:shadow-lg"
                      }`}
                    >
                      <div className="lg:w-64 shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${statusConfig[status].bg}`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${statusConfig[status].dot} ${status === "live" ? "animate-pulse" : ""}`}
                            />
                            {statusConfig[status].label}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {exam.code}
                          </span>
                        </div>
                        <h3 className="text-base font-bold tracking-tight">
                          {exam.title}
                        </h3>
                      </div>

                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Students
                          </p>
                          <div className="flex items-center gap-2 text-sm font-bold">
                            <UserCheckIcon
                              size={14}
                              className="text-indigo-500"
                            />
                            {exam.students ?? "--"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Time/Date
                          </p>
                          <div className="flex items-center gap-2 text-sm font-bold">
                            <ClockIcon size={14} className="text-slate-400" />
                            {status === "live"
                              ? "In Progress"
                              : new Date(exam.endAt).toLocaleDateString()}
                          </div>
                        </div>
                        {status === "live" && (
                          <div className="hidden sm:block space-y-1.5">
                            <div className="flex justify-between text-[9px] font-black uppercase">
                              <span className="text-slate-500">
                                Submissions
                              </span>
                              <span className="text-emerald-500">
                                {exam.submissionRate}%
                              </span>
                            </div>
                            <div
                              className={`h-1.5 w-full rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                            >
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{
                                  width: `${exam.submissionRate ?? 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {status === "completed" && (
                          <button
                            onClick={() => handleOpenReport(exam)}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/10 transition-all flex items-center gap-2"
                          >
                            <DownloadIcon size={14} /> Download Report
                          </button>
                        )}
                        {status === "upcoming" && (
                          <button
                            onClick={() => {
                              setExamActive(exam);
                              setShowDeleteModal(true);
                            }}
                            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 transition-all flex items-center gap-2 shadow-sm"
                            title="Delete Exam"
                          >
                            <Trash2Icon size={14} /> Delete Assessment
                          </button>
                        )}
                        {status === "live" && (
                          <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-50 cursor-not-allowed border border-transparent">
                            <XIcon size={14} /> Locked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => !isDownloading && setShowReportModal(false)}
            />

            <div
              className={`relative w-full max-w-sm rounded-3xl p-8 border shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden ${
                isDarkMode
                  ? "bg-[#0D1117] border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="text-center space-y-6 relative z-10">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-500 transform ${
                    downloadComplete
                      ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30"
                      : isDownloading
                        ? "bg-indigo-500/10 text-indigo-500"
                        : "bg-slate-500/10 text-slate-500"
                  }`}
                >
                  {downloadComplete ? (
                    <CheckIcon
                      className="animate-in zoom-in duration-300"
                      size={32}
                    />
                  ) : isDownloading ? (
                    <Loader2Icon className="animate-spin" size={32} />
                  ) : (
                    <FileTextIcon size={32} />
                  )}
                </div>

                <div className="space-y-2">
                  <h3
                    className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                      downloadComplete ? "text-emerald-500" : ""
                    }`}
                  >
                    {downloadComplete
                      ? "Download Started!"
                      : isDownloading
                        ? "Generating Data..."
                        : "Assessment Report"}
                  </h3>
                  <p className="text-slate-500 mb-7 text-sm">
                    {downloadComplete
                      ? "The file is being saved to your device."
                      : isDownloading
                        ? "Compiling student responses and grade distributions."
                        : `Consolidated records for ${examActive?.title}`}
                  </p>
                </div>

                <div className="h-[100px] flex items-center justify-center w-full">
                  {!isDownloading && !downloadComplete && (
                    <div className="flex flex-col gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {!isDownloading && !downloadComplete && (
                        <div className="flex gap-3 w-full">
                          <button
                            onClick={() => setReportFormat("pdf")}
                            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                              reportFormat === "pdf"
                                ? "bg-red-600 text-white border-red-600"
                                : "border-slate-300 text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            PDF
                          </button>

                          <button
                            onClick={() => setReportFormat("excel")}
                            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                              reportFormat === "excel"
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "border-slate-300 text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            Excel
                          </button>
                        </div>
                      )}

                      <button
                        onClick={handleDownload}
                        className="w-full mt-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <DownloadIcon size={16} /> Start Download
                      </button>
                      <button
                        onClick={() => setShowReportModal(false)}
                        className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors ${
                          isDarkMode
                            ? "text-slate-500 hover:text-slate-300"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {isDownloading && (
                    <div className="w-full space-y-4 animate-in fade-in duration-300">
                      <div
                        className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                      >
                        <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 animate-pulse text-center">
                        Encrypting Dataset...
                      </p>
                    </div>
                  )}

                  {downloadComplete && (
                    <div className="w-full text-center animate-in zoom-in-90 duration-500">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckIcon size={14} /> File Ready
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {downloadComplete && (
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              onClick={() => setShowDeleteModal(false)}
            />
            <div
              className={`relative w-full max-w-md rounded-[2.5rem] p-10 border shadow-2xl animate-in zoom-in-95 duration-300 ${
                isDarkMode
                  ? "bg-[#0D1117] border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                  <AlertTriangleIcon size={36} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    Delete Assessment
                  </h3>
                  <p className="text-slate-500 text-sm mt-3 px-4">
                    Removing{" "}
                    <span className="font-bold text-slate-500 dark:text-slate-200">
                      "{examActive?.title}"
                    </span>{" "}
                    will purge all scheduling data.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-10">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 transition-all active:scale-95"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                    isDarkMode
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `,
        }}
      />
    </div>
  );
};

export default StudentsPage;
