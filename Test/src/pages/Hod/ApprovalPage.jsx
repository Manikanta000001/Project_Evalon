import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  History,
  Search,
  Eye,
  Printer,
  Download,
  X,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
/**
 * MOCK DATA: Represents documents submitted by teachers.
 * Added 'content' field to simulate document data for preview/print.
 */

const ApprovalPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("SUBMITTED");
  const { dark: darkMode } = useOutletContext() || {};

  // Persistence for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  useEffect(() => {
    const fetchSubmittedQBs = async () => {
      try {
        console.log("fetching");
        const token = JSON.parse(localStorage.getItem("userdata"))?.token;

        const response = await axios.get(
          "http://localhost:5000/api/question-banks/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setDocuments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching question banks:", error);
        setLoading(false);
      }
    };

    fetchSubmittedQBs();
  }, []);
  const handleFinalizeAction = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userdata"))?.token;

      const endpoint =
        actionType === "approve"
          ? `http://localhost:5000/api/question-banks/${selectedDoc._id}/approve`
          : `http://localhost:5000/api/question-banks/${selectedDoc._id}/reject`;

      await axios.put(
        endpoint,
        { comment: feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Refresh list
      const refreshed = await axios.get(
        "http://localhost:5000/api/question-banks/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setDocuments(refreshed.data);
      closeModal();
    } catch (error) {
      console.error("Approval error:", error);
    }
  };

  const closeModal = () => {
    setSelectedDoc(null);
    setActionType(null);
    setFeedback("");
  };

  const openPreview = (doc) => {
    setPreviewDoc(doc);
    console.log(doc);
  };

  const handlePrint = () => {
    window.open(
      `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(previewDoc.fileUrl)}`,
      "_blank",
    );
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const teacherName = doc.uploadedBy?.name || "";
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacherName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab = doc.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [documents, searchTerm, activeTab]);

  const tabs = [
    { value: "SUBMITTED", label: "Submitted" },
    { value: "HOD_APPROVED", label: "Approved" },
    { value: "HOD_REJECTED", label: "Rejected" },
  ];

  const statusLabelMap = {
    SUBMITTED: "Submitted",
    HOD_APPROVED: "Approved",
    HOD_REJECTED: "Rejected",
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} font-sans p-4 md:p-8`}
    >
      {/* Header Section */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/20">
              <FileText className="text-white" size={28} />
            </div>
            <div>
              <h1
                className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-900"}`}
              >
                Approval Portal
              </h1>
              <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
                Review and manage document submissions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center p-1 rounded-lg border shadow-sm ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
            >
   {tabs.map((tab) => (
  <button
    key={tab.value}
    onClick={() => setActiveTab(tab.value)}
    className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
      activeTab === tab.value
        ? "bg-blue-600 text-white shadow-md"
        : "text-slate-500 hover:bg-slate-50"
    }`}
  >
    {tab.label}
  </button>
))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto">
        {/* Search */}
        <div
          className={`rounded-xl shadow-sm border mb-6 p-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by document title or teacher name..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div
                key={doc._id}
                className={`rounded-xl shadow-sm border overflow-hidden transition-all ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 hover:border-blue-300"}`}
              >
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"}`}
                    >
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3
                          className={`text-lg font-semibold ${darkMode ? "text-slate-100" : "text-slate-800"}`}
                        >
                          {doc.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span
                          className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                        >
                          {doc.uploadedBy?.name}
                        </span>
                        <span>•</span>
                        <span>{doc.subject}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => openPreview(doc)}
                      className={`p-2 rounded-lg border transition-colors ${darkMode ? "border-slate-700 text-slate-400 hover:text-blue-400" : "border-slate-200 text-slate-500 hover:text-blue-600"}`}
                      title="Preview Document"
                    >
                      <Eye size={18} />
                    </button>

                    {doc.status === "SUBMITTED" ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setActionType("reject");
                          }}
                          className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setActionType("approve");
                          }}
                          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                        >
                          Approve
                        </button>
                      </>
                    ) : (
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                          doc.status === "HOD_APPROVED"
                            ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {doc.status === "HOD_APPROVED" ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                        {statusLabelMap[doc.status]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit Trail */}
                {doc.remarks?.length > 0 && (
                  <div
                    className={`border-t px-5 py-3 ${
                      darkMode
                        ? "bg-slate-800/30 border-slate-800"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <History size={14} /> Audit Trail
                    </div>

                    <div className="space-y-2 mt-2">
                      {doc.remarks.map((entry, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                          <span className="text-slate-400 text-xs">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>

                          <span className="font-bold uppercase text-blue-500">
                            {entry.role}
                          </span>

                          <span className="italic text-slate-500">
                            "{entry.comment}"
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className={`rounded-xl border border-dashed p-12 text-center ${darkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-300 bg-white"}`}
            >
              <Search className="text-slate-300 w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No documents found</h3>
            </div>
          )}
        </div>
      </main>

      {/* Decision Modal */}
      {selectedDoc && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden ${darkMode ? "bg-slate-900" : "bg-white"}`}
          >
            <div
              className={`p-6 text-white ${actionType === "approve" ? "bg-blue-600" : "bg-red-600"}`}
            >
              <h3 className="text-xl font-bold">
                {actionType === "approve"
                  ? "Confirm Approval"
                  : "Rejection Reason"}
              </h3>
              <p className="text-white/80 text-sm mt-1 truncate">
                {selectedDoc.title}
              </p>
            </div>
            <div className="p-6">
              <textarea
                className={`w-full h-32 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"}`}
                placeholder={
                  actionType === "approve"
                    ? "Optional approval note..."
                    : "Reason for rejection (Required)..."
                }
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className={`flex-1 py-3 font-bold rounded-xl ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalizeAction}
                  disabled={actionType === "reject" && !feedback.trim()}
                  className={`flex-1 py-3 font-bold text-white rounded-xl ${actionType === "approve" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700 disabled:opacity-50"}`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div
            className={`w-[90%] h-[90%] rounded-xl overflow-hidden ${
              darkMode ? "bg-slate-900" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {previewDoc.title}
              </h3>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all shadow-sm"
                >
                  <Printer size={16} />
                  Print
                </button>

                <button
                  onClick={() => window.open(previewDoc.fileUrl, "_blank")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-all shadow-sm"
                >
                  <Download size={16} />
                  Download
                </button>

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>

            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewDoc.fileUrl)}`}
              className="w-full h-[calc(100%-64px)]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPage;
