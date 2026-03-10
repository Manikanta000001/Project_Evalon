import React, { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Eye,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  History,
  Moon,
  Sun,
  ChevronRight,
  Filter,
} from "lucide-react";

const BankStatusComp = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { dark: isDarkMode } = useOutletContext() || {};

  const [selectedDoc, setSelectedDoc] = useState(null);


  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchMyDocs = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userdata"))?.token;

        const res = await axios.get(
          "http://localhost:5000/api/question-banks/my-submissions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const formatted = res.data.map((doc) => ({
          id: doc._id,
          title: doc.title,
          course: doc.subject,
          submittedDate: new Date(doc.createdAt).toLocaleDateString(),
          status:
            doc.status === "HOD_APPROVED"
              ? "Approved"
              : doc.status === "HOD_REJECTED"
                ? "Rejected"
                : "Submitted",
          hodComment: doc.remarks?.length
            ? doc.remarks[doc.remarks.length - 1].comment
            : null,
          fileType: "DOCX",
          fileSize: "",
          fileUrl: doc.fileUrl,
        }));
        console.log(formatted);

        setDocuments(formatted);
      } catch (err) {
        console.error("Fetch teacher submissions error", err);
      }
    };

    fetchMyDocs();
  }, []);

  const handleDownload = (url, name) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name || "document.docx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesTab = activeTab === "All" || doc.status === activeTab;
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.course.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [documents,activeTab, searchQuery]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return isDarkMode
          ? "bg-emerald-900/20 text-emerald-400 border-emerald-800"
          : "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Rejected":
        return isDarkMode
          ? "bg-rose-900/20 text-rose-400 border-rose-800"
          : "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return isDarkMode
          ? "bg-blue-900/20 text-blue-400 border-blue-800"
          : "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={16} />;
      case "Rejected":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 font-sans ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <FileText className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Submission Portal
              </h1>
              <p
                className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-sm`}
              >
                Manage and track your document approvals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex p-1 rounded-xl border shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              {["All", "Submitted", "Approved", "Rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md"
                      : isDarkMode
                        ? "text-slate-500 hover:text-slate-300"
                        : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by document title or course name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            />
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className={`group border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl ${isDarkMode ? "bg-orange-900/20" : "bg-orange-50"}`}
                    >
                      <FileText className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                        {doc.title}
                      </h3>
                      <div
                        className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                      >
                        <span
                          className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                        >
                          {doc.course}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} /> {doc.submittedDate}
                        </span>
                        <span
                          className={
                            isDarkMode ? "text-slate-700" : "text-slate-300"
                          }
                        >
                          |
                        </span>
                        <span>
                          {doc.fileType} • {doc.fileSize}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      title="Preview"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                     onClick={() => handleDownload(doc.fileUrl, doc.title)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isDarkMode
                          ? "border-slate-800 text-slate-400 hover:bg-slate-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Download size={20} />
                    </button>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm ${getStatusStyle(doc.status)}`}
                    >
                      {getStatusIcon(doc.status)}
                      {doc.status}
                    </div>
                  </div>
                </div>

                {/* Audit Trail Section */}
                {doc.hodComment && (
                  <div
                    className={`px-5 py-4 border-t flex flex-col gap-2 ${isDarkMode ? "bg-slate-800/30 border-slate-800" : "bg-slate-50/50 border-slate-100"}`}
                  >
                    <div
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                    >
                      <History size={12} />
                      Audit Trail
                    </div>
                    <div className="flex gap-3 text-sm">
                      <span className="text-slate-400">
                        {doc.submittedDate}
                      </span>
                      <span
                        className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                      >
                        HOD
                      </span>
                      <span
                        className={`italic ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        "{doc.hodComment}"
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className={`py-20 text-center rounded-3xl border-2 border-dashed ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
              >
                <Search className="text-slate-400" size={24} />
              </div>
              <h3 className="text-lg font-medium">No documents found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                Try adjusting your filters or search terms to find what you're
                looking for.
              </p>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className={`w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
            >
              <div
                className={`p-6 border-b flex items-center justify-between ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
              >
                <div>
                  <h2 className="text-xl font-bold">{selectedDoc.title}</h2>
                  <p className="text-sm text-slate-500">
                    {selectedDoc.course} • Document Preview
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                >
                  <XCircle size={24} className="text-slate-400" />
                </button>
              </div>

              {/* preview will appear here */}

  <iframe
    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedDoc.fileUrl)}`}
    className="w-full h-[600px]"
  />

              <div
                className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
              >
                <button
                  onClick={() => setSelectedDoc(null)}
                  className={`px-6 py-2 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(selectedDoc.fileUrl, selectedDoc.title)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all hover:opacity-90 ${
                    isDarkMode
                      ? "bg-white text-slate-900"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  <Download size={18} /> Download Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankStatusComp;
