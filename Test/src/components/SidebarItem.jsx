import React from "react";

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed, isDarkMode }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : ""}
    className={`w-full flex items-center rounded-lg transition-all duration-300 group ${
      collapsed ? "justify-center px-0 py-3" : "space-x-3 px-4 py-3"
    } ${
      active
        ? "bg-brandBlue-600 text-white shadow-lg shadow-brandBlue-500/20"
        : isDarkMode
        ? "text-slate-400 hover:bg-slate-800 hover:text-white"
        : "text-slate-500 hover:bg-slate-100"
    }`}
  >
    <Icon size={20} />
    {!collapsed && <span>{label}</span>}
  </button>
);

export default SidebarItem;
