import {
  FileCheck,
  Sparkles,
  Upload,
  ArrowLeft,
  Printer,
  Calendar,
  Clock,
  BookOpen,
  Layers,
  GraduationCap,
  Hash,
  FileText,
  CheckCircle2,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  Loader2,
  Info,
  ChevronRight,
  SearchCode,
  ScanSearch,
  XCircle,
  RefreshCcw,
  Binary,
  Cloud,
  FileDigit,
  FileType,
  Moon,
  Sun,
  Layout,
  Settings2,
  History,
  Database,
  Code,
  Timer,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

export default function PreviewContainer({
  isDark,
  zoomLevel,
  children,
  triggerSave,triggerDownload,handlePrint,setZoomLevel, onExit
}) {
  return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">
          <header
            className={` top-4 z-50 flex flex-col md:flex-row justify-between items-center p-4  border backdrop-blur-md gap-4 ${isDark ? "bg-slate-900/80 border-slate-800 shadow-2xl" : "bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50"}`}
          >
            <button
              onClick={ onExit}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
            >
              <ArrowLeft size={16} /> Exit Editor
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center p-1 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
              >
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 10, 50))}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="px-4 text-[11px] font-black min-w-[60px] text-center text-blue-500">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 10, 200))}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden md:block mx-1" />
  
              <button
                onClick={triggerSave}
                className={`p-3 rounded-xl transition-all border ${isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600 shadow-sm"}`}
              >
                <Save size={20} />
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/30 font-black text-[11px] uppercase hover:bg-blue-700 transition-all active:scale-95"
              >
                <Download size={18} /> Export PDF
              </button>
            </div>
          </header>

          <div    style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
        }}
            className={` p-8 md:p-16 overflow-auto min-h-[310mm] flex justify-center border-2 border-white dark:border-slate-800 shadow-inner ${isDark ? "bg-slate-900/50" : "bg-slate-200/50"}`}
          >

{children}

 
          </div>
        </div>
  );
}