import React from "react";
import { MoreVertical } from "lucide-react";

const Card = ({ title, children, subtitle, isDarkMode }) => (
  <div
    className={`${
      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    } p-6 rounded-xl border shadow-sm`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          {title}
        </h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <MoreVertical size={16} className="text-slate-400" />
    </div>
    {children}
  </div>
);

export default Card;
