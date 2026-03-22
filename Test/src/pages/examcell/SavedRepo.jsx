import React, { useState, useMemo, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Preview from "../../components/Preview";
import PreviewContainer from "../../components/PreviewContainer.jsx";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import {
  Search,
  Sun,
  Moon,
  ChevronRight,
  Filter,
  FileText,
  GraduationCap,
  Clock,
  BookOpen,
  ChevronDown,
  Check,
} from "lucide-react";

const SavedRepo = () => {
  const { dark: darkMode } = useOutletContext() || {};
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDeptDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock Data
  const [papers, setPapers] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/papers")
      .then((res) => setPapers(res.data))
      .catch((err) => console.error(err));
  }, []);


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

      while (heightLeft > pageHeight) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("Exam_Paper.pdf");
    };
  };

  console.log("the papers", papers);

  const departments = ["All", "CSE", "ECE", "MECH"];

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const matchesDept =
        activeDepartment === "All" ||
        paper.meta.department === activeDepartment;

      const matchesType =
        activeType === "All" ||
        paper.meta.examType.toLowerCase().includes(activeType.toLowerCase());

      const matchesSearch =
        paper.meta.courseName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (paper.meta.courseId &&
          paper.meta.courseId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      return matchesDept && matchesType && matchesSearch;
    });
  }, [papers, activeDepartment, activeType, searchQuery]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handlePreview = (paper) => {
    setSelectedPaper(paper);
    setCurrentPage("preview");
  };

  // --- Sub-Components ---

  const Dashboard = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Question Repository
          </h1>
          <p
            className={`mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Manage and review your academic examination papers
          </p>
        </div>

        <div className="relative group">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
          />
          <input
            type="text"
            placeholder="Search by title or code..."
            className={`pl-10 pr-4 py-2 rounded-xl border transition-all outline-none w-full md:w-64
              ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  : "bg-white border-slate-200 text-slate-900 focus:border-blue-600"
              }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-8">
        {/* Department Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span
              className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Department:
            </span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
              className={`flex items-center justify-between gap-3 px-4 py-2 rounded-xl border transition-all w-48 text-left
                ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-white hover:border-slate-600"
                    : "bg-white border-slate-200 text-slate-900 hover:border-slate-300 shadow-sm"
                }`}
            >
              <span className="font-medium">{activeDepartment}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isDeptDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDeptDropdownOpen && (
              <div
                className={`absolute top-full left-0 mt-2 w-full rounded-xl border shadow-xl z-20 overflow-hidden
                ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}
              >
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setActiveDepartment(dept);
                      setIsDeptDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                      ${
                        activeDepartment === dept
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "text-slate-300 hover:bg-slate-700"
                            : "text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {dept}
                    {activeDepartment === dept && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Paper Type Segmented Control */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span
              className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Type:
            </span>
          </div>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {["All", "Mid", "Assignment", "Objective"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeType === type
                    ? "bg-blue-600 text-white shadow-md"
                    : `text-slate-500 hover:text-blue-500`
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className={`group p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
              ${
                darkMode
                  ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500/50"
                  : "bg-white border-slate-100 hover:border-blue-200 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest
                ${
                  paper.meta.department === "CSE"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : paper.meta.department === "ECE"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                }`}
                >
                  {paper.meta.department}
                </span>
              </div>

              <h3
                className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                {paper.meta.courseName}
              </h3>

              <div
                className={`flex items-center gap-4 text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(paper.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {paper.meta.examType}
                </div>
              </div>

              <button
                onClick={() => handlePreview(paper)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20 active:scale-[0.98]"
              >
                Preview Paper
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <p
              className={`text-lg font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              No papers found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {currentPage === "dashboard" ? (
          <Dashboard />
        ) : (
          <PreviewContainer
            isDark={darkMode}
             showSave = {false}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            triggerSave={() => {}}
            triggerDownload={downloadPDF}
            onExit={() => setCurrentPage("dashboard")}
          >
            {selectedPaper && (
              <Preview
                backendData={selectedPaper.questions}
                meta={selectedPaper.meta}
              />
            )}
          </PreviewContainer>
        )}
      </main>
    </div>
  );
};

export default SavedRepo;
