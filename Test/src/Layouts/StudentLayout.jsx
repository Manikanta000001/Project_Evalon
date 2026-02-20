import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import necn from '../../public/necn.avif'


import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  GraduationCap,
  Clock,
  LogOut,
} from "lucide-react";

import SidebarItem from "../components/SidebarItem";

export default function StudentLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) document.body.classList.add("bg-slate-950");
    else document.body.classList.remove("bg-slate-950");
  }, [isDarkMode]);

  const pageTitleMap = {
    "/student": "Dashboard",
    "/student/exams": "My Exams",
    "/student/results": "Results",
    "/student/profile": "Profile",
  };

  const pageTitle = pageTitleMap[location.pathname] || "Student";

  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed h-full border-r transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      >
        <div
          className={`p-6 flex items-center ${
            isCollapsed ? "justify-center" : "space-x-2"
          }`}
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <GraduationCap size={22} />
          </div>

          {!isCollapsed && (
            <h1 className="text-3xl font-black tracking-tight">Evalon</h1>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-20 border rounded-full p-1 shadow hidden md:block ${
            isDarkMode
              ? "bg-slate-900 border-slate-700 text-slate-400"
              : "bg-white border-slate-200 text-slate-400"
          }`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <nav className="px-3 py-4 space-y-1">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={location.pathname === "/student"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/student")}
          />

          <SidebarItem
            icon={FileText}
            label="My Exams"
            active={location.pathname === "/student/exams"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/student/exams")}
          />

          <SidebarItem
            icon={CheckCircle}
            label="Results"
            active={location.pathname === "/student/results"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/student/results")}
          />

          <SidebarItem
            icon={User}
            label="Profile"
            active={location.pathname === "/student/profile"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/student/profile")}
          />
                <SidebarItem
            icon={LogOut }
            label="Logout"
            active={location.path === "/student/logut"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          />
        </nav>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all ${isCollapsed ? "pl-20" : "pl-64"}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
            <div>
              <p className="text-xs font-black uppercase text-emerald-500">
                Student Workspace
              </p>

              <h2
                className={`text-3xl font-black ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {pageTitle}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 border rounded-full ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <Clock size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase">Jan 2026</span>
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-yellow-400"
                    : "bg-white border-slate-200 text-slate-500"
                }`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <img
                className="w-10 h-10 rounded-xl border object-cover object-center"
                src={necn}
                alt="student"
              />
            </div>
          </header>

          <Outlet context={{ dark: isDarkMode }} />
        </div>
      </main>
    </div>
  );
}
