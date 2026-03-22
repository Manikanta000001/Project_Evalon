import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const ExamCell = () => {
  const { dark: darkMode } = useOutletContext() || {};
  const [stats, setStats] = useState({});
  const [departmentData, setDepartmentData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState({});
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dashboard/examcell`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStats(res.data.stats);
      setStatusDistribution(res.data.statusDistribution);
      const maxCount = Math.max(
        ...res.data.departmentStats.map((d) => d.count),
        1,
      );

      const formattedDepartments = res.data.departmentStats.map((d) => ({
        name: d._id,
        count: d.count,
        width: `${(d.count / maxCount) * 90}%`,
      }));

      setDepartmentData(formattedDepartments);
    };

    fetchDashboard();
  }, []);
  console.log(departmentData);

  // Mock Data for the Dashboard
  const statsData = [
    {
      label: "Total Submissions",
      value: stats.totalSubmissions || 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending with HOD",
      value: stats.pendingWithHOD || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Approved by HOD",
      value: stats.approvedByHOD || 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Rejected by HOD",
      value: stats.rejectedByHOD || 0,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  // const departmentData = [
  //   { name: 'CSE', count: 45, color: 'w-[85%]', delay: '0.1s' },
  //   { name: 'ECE', count: 32, color: 'w-[65%]', delay: '0.2s' },
  //   { name: 'MECH', count: 28, color: 'w-[55%]', delay: '0.3s' },
  //   { name: 'BUSINESS', count: 22, color: 'w-[45%]', delay: '0.4s' },
  //   { name: 'CIVIL', count: 15, color: 'w-[30%]', delay: '0.5s' },
  // ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      {/* Global CSS for smoother animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growWidth {
          from { width: 0; }
        }
        @keyframes drawCircle {
          from { stroke-dashoffset: 365; }
          to { stroke-dashoffset: 98; }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-grow {
          animation: growWidth 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-draw {
          stroke-dasharray: 365;
          animation: drawCircle 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      <div
        className={`min-h-screen font-sans p-4 md:p-8 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}
      >
        {/* Header Section */}
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-900"}`}
            >
              Exam Monitoring System
            </h1>
            <p
              className={`${darkMode ? "text-slate-400" : "text-slate-500"} mt-1`}
            >
              Institutional Oversight & Analytics Dashboard
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statsData.map((stat, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 animate-fade-in stagger-${idx + 1} ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-slate-800" : stat.bg}`}
                  >
                    <stat.icon
                      className={`w-6 h-6 ${stat.color} transition-transform group-hover:scale-110`}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Metrics
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1 tracking-tight">
                  {stat.value}
                </h3>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department-Wise Breakdown */}
            <div
              className={`lg:col-span-2 p-6 rounded-xl border shadow-sm animate-fade-in stagger-2 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2
                    className={`font-bold text-lg ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                  >
                    Department Submissions
                  </h2>
                </div>
              </div>
              <div className="space-y-8">
                {departmentData.map((dept, i) => (
                  <div key={i} className="space-y-2 group">
                    <div className="flex justify-between text-sm">
                      <span
                        className={`font-semibold transition-colors duration-300 ${darkMode ? "text-slate-400 group-hover:text-blue-400" : "text-slate-600 group-hover:text-blue-600"}`}
                      >
                        {dept.name}
                      </span>
                      <span
                        className={`font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                      >
                        {dept.count} papers
                      </span>
                    </div>
                    <div
                      className={`h-3 w-full rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full animate-grow shadow-[0_0_12px_rgba(37,99,235,0.2)]"
                        style={{ width: dept.width }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Distribution */}
            <div
              className={`p-6 rounded-xl border shadow-sm animate-fade-in stagger-3 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <div className="flex items-center gap-2 mb-8">
                <PieChart className="w-5 h-5 text-blue-600" />
                <h2
                  className={`font-bold text-lg ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                >
                  Status Distribution
                </h2>
              </div>

              <div className="flex justify-center mb-10">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="72"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className={darkMode ? "text-slate-800" : "text-slate-100"}
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="72"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeLinecap="round"
                      className="text-emerald-500 animate-draw shadow-lg"
                    />
                  </svg>
                  <div className="absolute text-center animate-fade-in stagger-4">
                    <span
                      className={`block text-3xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}
                    >
                      {statusDistribution.percentage || 0}%
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Approved
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border border-transparent transition-all duration-300 group ${darkMode ? "bg-slate-800/40 hover:border-emerald-800" : "bg-slate-50 hover:border-emerald-200"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Verified & Approved
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    {statusDistribution.approved || 0}
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border border-transparent transition-all duration-300 group ${darkMode ? "bg-slate-800/40 hover:border-amber-800" : "bg-slate-50 hover:border-amber-200"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Awaiting Review
                    </span>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{statusDistribution.submitted || 0}</span>
                </div>
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border border-transparent transition-all duration-300 group ${darkMode ? "bg-slate-800/40 hover:border-rose-800" : "bg-slate-50 hover:border-rose-200"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Revisions Needed
                    </span>
                  </div>
                  <span className="text-sm font-bold text-rose-600">{statusDistribution.rejected || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Call to Action Card */}
            <button className="group relative bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl transition-all transform hover:-translate-y-2 hover:shadow-blue-500/30 text-left overflow-hidden animate-fade-in stagger-4">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
                <CheckCircle className="w-48 h-48" />
              </div>

              <div className="relative z-10">
                <h3 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">
                  Workflow Summary
                </h3>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-5xl font-black transition-transform group-hover:scale-110 origin-left inline-block">
                    {stats.approvedByHOD || 0}
                  </span>
                  <span className="text-blue-100 font-medium italic opacity-80">
                    Ready for exam phase
                  </span>
                </div>
                {/* <div className="flex items-center gap-3 text-sm font-bold bg-white/10 w-fit px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors">
                  Generate Final Report
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div> */}
              </div>
            </button>

            {/* System Notice Card */}
            <div
              className={`p-8 rounded-2xl border shadow-sm flex flex-col justify-center animate-fade-in stagger-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h4
                className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}
              >
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Access Permissions
              </h4>
              <p
                className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Your account is registered as a{" "}
                <span className="font-bold text-blue-600">Global Monitor</span>.
                You have real-time visibility across all 5 departments. Data
                modification is restricted to HOD and Exam Cell roles only.
              </p>
            </div>
          </div>
        </main>

        <footer
          className={`max-w-7xl mx-auto mt-12 pb-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs animate-fade-in ${darkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}
        >
          <p className="font-medium">
            © 2026 Exam Management Division • Unified Monitoring Portal
          </p>
          <div className="flex gap-6 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              Network Secure
            </span>
            <span className="hover:text-blue-500 transition-colors cursor-pointer">
              Support
            </span>
            <span className="hover:text-blue-500 transition-colors cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ExamCell;
