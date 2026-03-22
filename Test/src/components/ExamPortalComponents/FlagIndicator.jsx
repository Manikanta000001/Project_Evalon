import React from 'react';
import { Flag } from "lucide-react";

/**
 * FlagIndicator Component - Blue & White Theme
 * Displays a warning flag icon with the violation count.
 * Only appears if count > 0.
 */
const FlagIndicator = ({ count }) => {
  // Ensure count is treated as a number
  const flagCount = Number(count);
  
  if (isNaN(flagCount) || flagCount <= 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 rounded-lg shadow-sm mr-4 relative animate-in fade-in slide-in-from-right-2 duration-300">
      {/* Subtle Blue Pulse Backdrop */}
      <div className="absolute inset-0 bg-blue-50/30 animate-pulse-slow rounded-lg" />
      
      <div className="relative flex items-center justify-center">
        {/* Flag Icon with a gentle alert animation */}
        <Flag 
          size={18} 
          className="text-blue-600 fill-blue-600 relative z-10 animate-gentle-bounce" 
        />
        
        {/* Small alert ring */}
        <span className="absolute flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 relative z-10">
        {/* Normal styled number as requested */}
        <span className="text-blue-700 font-semibold text-base leading-none">
          {flagCount}
        </span>
        <div className="flex flex-col">
          <span className="text-blue-600 font-bold text-[10px] uppercase tracking-tight leading-none">
            Flags
          </span>
          <span className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter leading-none mt-0.5">
            Warning
          </span>
        </div>
      </div>

      {/* Blue Theme Animations */}
      <style>{`
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .animate-gentle-bounce {
          animation: gentle-bounce 2s infinite ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FlagIndicator;