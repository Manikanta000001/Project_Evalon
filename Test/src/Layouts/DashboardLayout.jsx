import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import necn from '../../public/necn.avif'

import {
  LayoutDashboard,
  Plus,
  BookOpen,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  GraduationCap,
  Clock,
} from "lucide-react";

import SidebarItem from "../components/SidebarItem";

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // highlight active item
  const path = location.pathname;

  // add/remove body dark background
  useEffect(() => {
    if (isDarkMode) document.body.classList.add("bg-slate-950");
    else document.body.classList.remove("bg-slate-950");
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ---------- Sidebar ---------- */}
      <aside
        className={`border-r fixed h-full flex flex-col transition-all duration-300 z-20 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      >
        {/* Logo */}
        <div
          className={`p-6 flex items-center transition-all ${
            isCollapsed ? "justify-center" : "space-x-2"
          }`}
        >
          <div className="w-10 h-10 bg-brandBlue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brandBlue-500/20">
            <GraduationCap size={22} />
          </div>

          {!isCollapsed && (
            <h1 className="text-3xl font-black tracking-tight">Evalon</h1>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-20 border rounded-full p-1 shadow-sm hidden md:block ${
            isDarkMode
              ? "bg-slate-900 border-slate-700 text-slate-400"
              : "bg-white border-slate-200 text-slate-400"
          }`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Sidebar Navigation */}
        <nav className={`flex-1 px-3 py-4 space-y-1 overflow-y-auto`}>
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={path === "/teacher"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/teacher")}
          />

          <SidebarItem
            icon={Plus}
            label="Assessment Studio"
            active={path === "/teacher/create"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/teacher/create")}
          />

          <SidebarItem
            icon={BookOpen}
            label="Question Bank"
            active={path === "/teacher/questions"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/teacher/questions")}
          />

          <SidebarItem
            icon={Users}
            label="Classroom"
            active={path === "/teacher/students"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/teacher/students")}
          />

          <SidebarItem
            icon={BarChart3}
            label="Insights"
            active={path === "/teacher/analytics"}
            collapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={() => navigate("/teacher/analytics")}
          />
        </nav>
      </aside>

      {/* ---------- Main Content Area ---------- */}
      <main
        className={`transition-all duration-300 flex-1 ${
          isCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">

          {/* ---------- Page Header ---------- */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <p className="text-xs font-black text-brandBlue-500 uppercase tracking-widest">
                Educator Workspace
              </p>
            </div>

            {/* Right controls */}
            <div className="flex items-center space-x-4">
              {/* Date pill */}
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <Clock size={16} className="text-brandBlue-500" />
                <span className="text-xs font-bold uppercase tracking-tight">
                  Jan 2024
                </span>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl border transition-all ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-yellow-400 hover:text-yellow-300"
                    : "bg-white border-slate-200 text-slate-500 hover:text-brandBlue-600"
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Profile */}
              <div
                className={`flex items-center space-x-3 pl-3 border-l ${
                  isDarkMode ? "border-slate-800" : "border-slate-200"
                }`}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold">Mani</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tight">
                    Physics Dept
                  </p>
                </div>

                <img
                  src={necn}
                  className="w-11 h-11 rounded-xl border-2 border-white shadow"
                  alt="profile"
                />
              </div>
            </div>
          </header>

          {/* ---------- render nested page here ---------- */}
          <Outlet context={{ dark: isDarkMode }} />
        </div>
      </main>
    </div>
  );
}
