import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Send,
  ChevronDown,
  Code2,
  ShieldAlert,
  Loader2,
} from "lucide-react";

/**
 * Professional Code Editor Component
 * Features:
 * - Current Line Highlighting (Dynamic background)
 * - Custom "Midnight Blue" Theme (bg-[#111827])
 * - Internal State Management
 * - Dynamic Line Numbers
 * - Bracket Auto-closing & Auto-indentation
 * - Anti-cheat: No copy-paste allowed
 */
export default function CodeEditor({
  value = "",
  onChange,
  onRun,
  onSubmit,
  languages = ["python", "javascript", "java", "cpp"],
  isRunning = false,
  isSubmitting = false,
}) {
  const [internalValue, setInternalValue] = useState(value);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleUpdate = (val) => {
    setInternalValue(val);
    if (typeof onChange === "function") {
      onChange(val);
    }
  };

  // Calculate which line the cursor is currently on
  const currentLineIndex = useMemo(() => {
    return internalValue.substring(0, cursorPos).split("\n").length - 1;
  }, [internalValue, cursorPos]);

  const lineCount = internalValue.split("\n").length;
  const displayLineCount = Math.max(lineCount, 25);

  const handleSelect = (e) => {
    setCursorPos(e.target.selectionStart);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    triggerAlert();
  };

  const handleCopy = (e) => {
    e.preventDefault();
    triggerAlert();
  };

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    // Bracket pairs
    const pairs = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
    if (pairs[e.key]) {
      e.preventDefault();
      const closingChar = pairs[e.key];
      const newValue =
        internalValue.substring(0, selectionStart) +
        e.key +
        closingChar +
        internalValue.substring(selectionEnd);
      handleUpdate(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        setCursorPos(selectionStart + 1);
      }, 0);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const tabSpace = "    ";
      const newValue =
        internalValue.substring(0, selectionStart) +
        tabSpace +
        internalValue.substring(selectionEnd);
      handleUpdate(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          selectionStart + tabSpace.length;
        setCursorPos(selectionStart + tabSpace.length);
      }, 0);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const lines = internalValue.substring(0, selectionStart).split("\n");
      const currentLine = lines[lines.length - 1];
      const indentationMatch = currentLine.match(/^\s*/);
      let indentation = indentationMatch ? indentationMatch[0] : "";

      if (
        (selectedLang === "python" && currentLine.trim().endsWith(":")) ||
        currentLine.trim().endsWith("{")
      ) {
        indentation += "    ";
      }

      const newValue =
        internalValue.substring(0, selectionStart) +
        "\n" +
        indentation +
        internalValue.substring(selectionEnd);
      handleUpdate(newValue);
      setTimeout(() => {
        const newPos = selectionStart + indentation.length + 1;
        textarea.selectionStart = textarea.selectionEnd = newPos;
        setCursorPos(newPos);
      }, 0);
    }

    // Update cursor pos for navigation keys
    setTimeout(() => setCursorPos(textarea.selectionStart), 0);
  };

  return (
    <div className="h-full flex flex-col bg-[#111827] rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative text-left">
      {/* Toolbar */}
      <div className="h-14 bg-[#0b0f1a] border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-200 text-xs font-medium transition-colors border border-slate-700"
            >
              <Code2 size={14} className="text-blue-400" />
              <span className="capitalize">{selectedLang}</span>
              <ChevronDown
                size={14}
                className={`text-slate-500 transition-transform ${showLangMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showLangMenu && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setSelectedLang(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs capitalize hover:bg-blue-600 transition-colors ${selectedLang === lang ? "bg-blue-600 text-white font-bold" : "text-slate-300"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <span className="text-slate-500 text-[10px] font-mono tracking-widest uppercase hidden sm:inline">
            Main.
            {selectedLang === "python"
              ? "py"
              : selectedLang === "javascript"
                ? "js"
                : "java"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* <button type="button" onClick={() => onRun?.(selectedLang, internalValue)} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded-md text-xs font-bold transition-all border border-emerald-500/30">
            <Play size={14} fill="currentColor" /> Run
          </button> */}
          <button
            type="button"
            disabled={isRunning}
            onClick={() => onRun?.(selectedLang, internalValue)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all border ${
              isRunning
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/20 cursor-not-allowed"
                : "bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                Run
              </>
            )}
          </button>
          {/* 
          <button
            type="button"
            onClick={() => onSubmit?.(selectedLang, internalValue)}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold transition-all shadow-lg"
          >
            <Send size={14} /> Submit
          </button> */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit?.(selectedLang, internalValue)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-lg ${
              isSubmitting
                ? "bg-blue-500/60 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={14} />
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Line Numbers Gutter */}
        <div className="w-12 bg-[#0b0f1a] border-r border-slate-800/50 flex flex-col items-center pt-6 shrink-0 select-none overflow-hidden z-10">
          {Array.from({ length: displayLineCount }).map((_, i) => (
            <span
              key={i}
              className={`text-[10px] font-mono leading-6 h-6 transition-colors ${currentLineIndex === i ? "text-blue-400" : "text-slate-600"}`}
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Highlight & Textarea Container */}
        <div className="relative flex-1 bg-[#111827] overflow-hidden">
          {/* Active Line Highlight Layer */}
          <div
            className="absolute left-0 right-0 h-6 bg-slate-800/40 pointer-events-none transition-all duration-75 border-y border-slate-700/20"
            style={{ top: `${currentLineIndex * 24 + 24}px` }}
          />

          <textarea
            ref={textareaRef}
            className="absolute inset-0 w-full h-full bg-transparent text-slate-300 p-6 font-mono text-sm resize-none focus:outline-none leading-6 placeholder:text-slate-700 overflow-y-auto z-10"
            value={internalValue}
            onChange={(e) => handleUpdate(e.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            onPaste={handlePaste}
            onCopy={handleCopy}
            onContextMenu={(e) => e.preventDefault()}
            spellCheck="false"
            placeholder={`// Start coding in ${selectedLang}...`}
          />
        </div>

        {/* Alert Toast */}
        {showAlert && (
          <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-lg shadow-2xl z-50 animate-bounce">
            <ShieldAlert size={18} />
            <span className="text-xs font-bold uppercase tracking-tight">
              Copy-Paste Disabled
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-8 bg-[#0b0f1a] border-t border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
          <span>UTF-8</span>
          <span>Tab: 4 Spaces</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono uppercase font-medium">
          {selectedLang} | {lineCount} Lines
        </div>
      </div>
    </div>
  );
}
