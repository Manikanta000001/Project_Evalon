import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  FileText,
  CheckCircle,
  Download,
  Printer,
  Eye,
  Search,
  Moon,
  Sun,
  X,
  User,
  Calendar,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  Filter,
  Layers,
} from "lucide-react";

const ExamQuestionBanks = () => {
  const { dark: darkMode } = useOutletContext() || {};
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Filter options
  const departments = ["ALL", "CSE", "ECE", "MECH", "PHYSICS", "BUSINESS"];
  const years = ["ALL", "1st Year", "2nd Year", "3rd Year", "4th Year"];

  // Mock data representing approved exam papers with Year added
  const [examPapers, setExamPapers] = useState([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userdata"))?.token;

        const response = await axios.get(
          "http://localhost:5000/api/question-banks/approved",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setExamPapers(response.data);
      } catch (error) {
        console.error("Error fetching approved papers:", error);
      }
    };

    fetchApproved();
  }, []);

  //   const filteredPapers = useMemo(() => {
  //     return examPapers.filter((paper) => {
  //       const matchesSearch =
  //         paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         paper.creator.toLowerCase().includes(searchTerm.toLowerCase());
  //       const matchesDept = selectedDept === "ALL" || paper.dept === selectedDept;
  //       const matchesYear = selectedYear === "ALL" || paper.year === selectedYear;
  //       return matchesSearch && matchesDept && matchesYear;
  //     });
  //   }, [searchTerm, selectedDept, selectedYear, examPapers]);

  const filteredPapers = useMemo(() => {
    return examPapers.filter((paper) => {
      const matchesSearch =
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.uploadedBy?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept =
        selectedDept === "ALL" || paper.department === selectedDept;

      const matchesYear = selectedYear === "ALL" || paper.year === selectedYear;

      return matchesSearch && matchesDept && matchesYear;
    });
  }, [searchTerm, selectedDept, selectedYear, examPapers]);
  const handleOpenPreview = (e, paper) => {
    e.stopPropagation();
    setModalData(paper);
    setShowSourceModal(true);
  };

  const handlePrint = () => {
    const printWindow = window.open(
      `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(modalData.fileUrl)}`,
      "_blank",
    );

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} font-sans p-4 md:p-8`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <nav
          className={`rounded-3xl sticky top-0 z-10 border-b px-6 py-4 flex justify-between items-center shadow-sm mb-6 transition-colors ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg ">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1
                className={`text-xl font-bold tracking-tight leading-none ${darkMode ? "text-blue-100" : "text-blue-900"}`}
              >
                Exam Monitoring System
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty or subject..."
                className={`pl-10 pr-4 py-2 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none w-64 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </nav>

        {/* Multi-Filter Navigation Bar */}
        <div
          className={`rounded-2xl border-b px-4 py-3 flex flex-col md:flex-row items-stretch md:items-center gap-4 sticky top-[73px] z-[9] mb-8 transition-colors ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
        >
          {/* Dept Filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
            <div
              className={`flex items-center gap-2 pr-4 border-r ${darkMode ? "border-slate-800" : "border-slate-200"}`}
            >
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Department:
              </span>
            </div>
            <div className="flex gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                    selectedDept === dept
                      ? "bg-blue-600 text-white shadow-md"
                      : `${darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter - Right Aligned */}
          <div
            className={`flex items-center gap-2 pl-0 md:pl-4   pt-3 md:pt-0 ${darkMode ? "border-slate-800" : "border-slate-200"}`}
          >
            <div className="flex items-center gap-2 pr-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Year:
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-tighter ${
                    selectedYear === year
                      ? "bg-indigo-600 text-white shadow-md"
                      : `${darkMode ? "text-slate-500 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200"}`
                  }`}
                >
                  {year === "ALL" ? "All Years" : year.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Notification Feed */}
            <div
              className={`${selectedPaper ? "lg:col-span-5" : "lg:col-span-12"} space-y-6 transition-all duration-500`}
            >
              <div className="flex items-center justify-between mb-2">
                <h2
                  className={`text-xl font-bold flex items-center gap-3 ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                >
                  <Bell className="w-6 h-6 text-blue-600" />
                  Notifications
                </h2>
                <div className="flex gap-2">
                  {selectedYear !== "ALL" && (
                    <span
                      className={`text-[10px] px-2 py-1 rounded bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/20`}
                    >
                      {selectedYear.toUpperCase()}
                    </span>
                  )}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-black tracking-widest uppercase ${darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                  >
                    {filteredPapers.length} Records
                  </span>
                </div>
              </div>

              <div
                className={`grid gap-4 ${selectedPaper ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar transition-all`}
              >
                {filteredPapers.length > 0 ? (
                  filteredPapers.map((paper) => (
                    <div
                      key={paper._id}
                      onClick={() => setSelectedPaper(paper)}
                      className={`group relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 shadow-sm ${
                        selectedPaper?._id === paper._id
                          ? "bg-white dark:bg-slate-800 border-blue-500 ring-2 ring-blue-500/20 shadow-xl"
                          : `${darkMode ? "bg-slate-900 border-slate-800 hover:border-blue-400" : "bg-white border-slate-200 hover:border-blue-400"}`
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-1.5">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${darkMode ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                          >
                            {paper.department}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}
                          >
                            {paper.year}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold tracking-tighter">
                          {paper.id}
                        </span>
                      </div>

                      <h3
                        className={`font-bold text-lg leading-tight mb-4 pr-6 ${darkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {paper.title}
                      </h3>

                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
                        >
                          <User
                            className={`w-4 h-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                          />
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold leading-none ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                          >
                            {paper.uploadedBy?.name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">
                            Course Instructor
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center justify-between pt-4 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Verified
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleOpenPreview(e, paper)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 border ${darkMode ? "bg-blue-900/30 text-blue-400 border-blue-800 hover:bg-blue-600 hover:text-white" : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white"}`}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>

                      {selectedPaper?.id === paper.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-blue-600 rounded-r-full"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    className={`col-span-full py-32 text-center border-4 border-dotted rounded-3xl ${darkMode ? "border-slate-800" : "border-slate-200"}`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
                    >
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400">
                      No matching records found
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Try adjusting your department or year filters
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Overview */}
            {selectedPaper && (
              <div className="lg:col-span-7 h-full">
                <div
                  className={`rounded-3xl border shadow-2xl overflow-hidden h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 transition-colors ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
                >
                  {/* Header Actions */}
                  <div
                    className={`px-8 py-6 border-b flex justify-between items-center ${darkMode ? "bg-slate-800/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                  >
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => setSelectedPaper(null)}
                          className={`p-1 -ml-1 rounded-md transition-colors lg:hidden ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-200"}`}
                        >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <h2 className="font-black text-2xl leading-tight truncate">
                          {selectedPaper.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-widest">
                        <span className="text-blue-600">
                          {selectedPaper.department}
                        </span>
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                        <span className="text-indigo-600">
                          {selectedPaper.year}
                        </span>
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />{" "}
                          {selectedPaper.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handlePrint}
                        className={`p-3 border rounded-2xl transition-all shadow-sm active:scale-95 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-blue-400" : "bg-white border-slate-200 text-slate-600 hover:text-blue-600"}`}
                      >
                        <Printer className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setSelectedPaper(null)}
                        className={`p-3 border rounded-2xl transition-all shadow-sm active:scale-95 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-red-500" : "bg-white border-slate-200 text-slate-400 hover:text-red-500"}`}
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-10 overflow-y-auto flex-1 space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Lead Creator
                        </p>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                          >
                            {selectedPaper.uploadedBy?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-base font-bold">
                              {selectedPaper.uploadedBy?.name}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              Department Faculty
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          HOD Approval
                        </p>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"}`}
                          >
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-base font-bold">
                              {selectedPaper.hod}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              Head of Department
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
                        <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                        Examination Context
                      </h4>
                      <div
                        className={`p-8 rounded-3xl border leading-relaxed text-lg font-medium italic shadow-inner ${darkMode ? "bg-slate-900/50 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"}`}
                      >
                        "{selectedPaper.subject}"
                      </div>
                    </div>

                    <div
                      className={`rounded-3xl p-8 border ${darkMode ? "bg-blue-950/20 border-blue-900/50" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"}`}
                    >
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                            <FileText className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">
                              Authenticated Reference
                            </p>
                            <h5 className="font-bold text-xl truncate max-w-[300px]">
                              {selectedPaper.title}
                            </h5>
                            <p className="text-sm text-slate-500 font-medium">
                              {selectedPaper.sourceType}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleOpenPreview(e, selectedPaper)}
                          className={`px-6 py-4 rounded-2xl border-2 transition-all font-black text-xs shadow-lg flex items-center gap-3 ${darkMode ? "bg-slate-800 border-slate-700 text-blue-400 hover:bg-blue-600 hover:text-white" : "bg-white border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
                        >
                          <Maximize2 className="w-5 h-5" />
                          VIEW SOURCE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Source PDF Popup Modal */}
      {showSourceModal && modalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
            onClick={() => setShowSourceModal(false)}
          ></div>

          <div
            className={`relative w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300 ${darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}
          >
            <div
              className={`px-8 py-5 border-b flex justify-between items-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-2.5 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm leading-none uppercase tracking-tight">
                    Source Material Preview
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1.5 font-bold uppercase tracking-widest">
                    {modalData.sourceName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="p-2.5 text-slate-400 hover:text-blue-600 transition-colors"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = modalData.fileUrl;
                    link.download = modalData.title || "question-paper.docx";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="w-5 h-5" />
                </button>
                <div
                  className={`w-px h-8 mx-1 ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
                ></div>
                <button
                  onClick={() => setShowSourceModal(false)}
                  className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div
              className={`flex-1 p-8 overflow-y-auto flex justify-center ${
                darkMode ? "bg-slate-950" : "bg-slate-100"
              }`}
            >
              <div
                className={`w-full max-w-4xl shadow-2xl rounded-md border overflow-hidden ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
                style={{ aspectRatio: "8.5 / 11" }} // A4/Letter ratio
              >
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    modalData.fileUrl,
                  )}`}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slide-in-right { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-in { animation: fade-in 0.4s ease-out; }
        .zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .slide-in-right { animation: slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @media print {
          nav, button, .flex-1, .fixed {
            display: none !important;
          }
          main { p: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default ExamQuestionBanks;
