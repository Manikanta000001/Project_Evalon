import { parseCodingExcelStrict } from "../../utils/parseCodingExcelStrict";

import {
  Plus,
  Code,
  CheckCircle2,
  Trash2,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";

/* --------------------------
   Fake Excel Validation
---------------------------*/
const parseCodingExcel = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};

export default function CodingLab({
  isDarkMode,
  setCodingQuestions,
  setCurrentCodingQuestion,
  setCodingExcelFile,
  setCodingUploadStatus,
  codingQuestions,
  currentCodingQuestion,
  codingExcelFile,
  codingUploadStatus,
  codingPerStudent,
  setCodingPerStudent
  
}) {
  /* --------------------------
     FUNCTIONS
  ---------------------------*/

  // Add new test case
  const handleAddTestCase = () => {
    setCurrentCodingQuestion((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", expectedOutput: "", isHidden: false }],
    }));
  };

  // Modify test case
  const handleTestCaseChange = (index, field, value) => {
    const updated = [...currentCodingQuestion.testCases];
    updated[index][field] = value;

    setCurrentCodingQuestion((prev) => ({
      ...prev,
      testCases: updated,
    }));
  };

  // Delete test case
  const handleDeleteTestCase = (index) => {
    if (currentCodingQuestion.testCases.length > 1) {
      const updated = currentCodingQuestion.testCases.filter(
        (_, i) => i !== index,
      );

      setCurrentCodingQuestion((prev) => ({
        ...prev,
        testCases: updated,
      }));
    }
  };

  // Save coding question
  const saveCodingQuestion = () => {
    if (!currentCodingQuestion.title || !currentCodingQuestion.description)
      return;

    const validTestCases = currentCodingQuestion.testCases.filter(
      (tc) => tc.input.trim() !== "" || tc.expectedOutput.trim() !== "",
    );

    if (validTestCases.length === 0) return;

    setCodingQuestions((prev) => [
      ...prev,
      {
        ...currentCodingQuestion,
        id: Date.now(),
        testCases: validTestCases,
      },
    ]);

    // Reset form
    setCurrentCodingQuestion({
      title: "",
      description: "",
      inputFormat: "",
      expectedOutputFormat: "",
      marks: "",
      difficulty: "Easy",
      testCases: [{ input: "", expectedOutput: "", isHidden: false }],
    });
  };

  // Excel Upload Validation
const handleCodingExcelChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setCodingExcelFile(file);
  setCodingUploadStatus("parsing");

  try {
    const parsed = await parseCodingExcelStrict(file);

    setCodingQuestions(parsed); // 🔥 REAL DATA
    setCodingUploadStatus("uploaded");

  } catch (err) {
    setCodingUploadStatus("idle");
    alert(err.message);
  }
};

  /* --------------------------
     UI
  ---------------------------*/

  return (
    <div className="mt-12 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">Coding Lab Setup</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <div className={`p-8 rounded-[32px] border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Manual Form Side */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg text-white"><Code size={18}/></div>
                    <h3 className="font-bold text-lg">Question Details</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1 text-slate-400">Problem Title</label>
                      <input 
                        type="text" 
                        value={currentCodingQuestion.title}
                        onChange={(e) => setCurrentCodingQuestion({...currentCodingQuestion, title: e.target.value})}
                        placeholder="e.g. Reverse a Linked List"
                        className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`} 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1 text-slate-400">Description</label>
                      <textarea 
                        rows={4}
                        value={currentCodingQuestion.description}
                        onChange={(e) => setCurrentCodingQuestion({...currentCodingQuestion, description: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border outline-none resize-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase mb-1 text-slate-400">Input Format</label>
                        <textarea 
                          rows={2}
                          value={currentCodingQuestion.inputFormat}
                          onChange={(e) => setCurrentCodingQuestion({...currentCodingQuestion, inputFormat: e.target.value})}
                          className={`w-full px-4 py-2 rounded-xl border outline-none resize-none text-xs ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase mb-1 text-slate-400">expectedOutput Format</label>
                        <textarea 
                          rows={2}
                          value={currentCodingQuestion.expectedOutputFormat}
                          onChange={(e) => setCurrentCodingQuestion({...currentCodingQuestion, expectedOutputFormat: e.target.value})}
                          className={`w-full px-4 py-2 rounded-xl border outline-none resize-none text-xs ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase mb-1 text-slate-400">Marks</label>
                        <input 
                          type="number"
                          value={currentCodingQuestion.marks}
                          onChange={(e) => setCurrentCodingQuestion({...currentCodingQuestion, marks: e.target.value})}
                          className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase mb-1 text-slate-400">Difficulty</label>
                        <select 
                          value={currentCodingQuestion.difficulty}
                          onChange={(e) => setCurrentCodingQuestion({...currentCodingQuestion, difficulty: e.target.value})}
                          className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                        >
                          <option>Easy</option><option>Medium</option><option>Hard</option>
                        </select>
                      </div>
                    </div>
                    <div>
  <label className="block text-[10px] font-black uppercase mb-1 text-slate-400">
    Coding Questions Per Student *
  </label>

  <input
    type="number"
    min="1"
    required
    value={codingPerStudent}
    onChange={(e) => setCodingPerStudent(e.target.value)}
    className={`w-full px-4 py-3 rounded-xl border outline-none ${
      isDarkMode
        ? "bg-slate-800 border-slate-700"
        : "bg-white border-slate-200"
    }`}
  />

  {!codingPerStudent && (
    <p className="text-red-500 text-xs mt-1 font-semibold">
      This field is required.
    </p>
  )}
</div>

                  </div>
                </div>

                {/* Test Cases Side */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-500 rounded-lg text-white"><CheckCircle2 size={18}/></div>
                      <h3 className="font-bold text-lg">Test Cases</h3>
                    </div>
                    <button 
                      onClick={handleAddTestCase}
                      className="text-xs font-bold px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14}/> Add Test Case
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {currentCodingQuestion.testCases.map((tc, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border relative ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}`}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase mb-1 text-slate-500">Input</label>
                            <textarea 
                              value={tc.input}
                              onChange={(e) => handleTestCaseChange(idx, "input", e.target.value)}
                              className={`w-full p-2 rounded-lg border text-xs h-16 resize-none outline-none focus:border-blue-500 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase mb-1 text-slate-500">Expected expectedOutput</label>
                            <textarea 
                              value={tc.expectedOutput}
                              onChange={(e) => handleTestCaseChange(idx, "expectedOutput", e.target.value)}
                              className={`w-full p-2 rounded-lg border text-xs h-16 resize-none outline-none focus:border-blue-500 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={tc.isHidden}
                              onChange={(e) => handleTestCaseChange(idx, "isHidden", e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300" 
                            />
                            <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-blue-500">isHidden Test Case</span>
                          </label>
                          <button 
                            onClick={() => handleDeleteTestCase(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={saveCodingQuestion}
                    className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20}/> Save Coding Question
                  </button>
                </div>
              </div>

              {/* Coding Bulk Upload Section */}
              <div className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="max-w-sm">
                    <h4 className="font-bold">Bulk Upload Coding Questions</h4>
                    <p className="text-xs text-slate-500 mt-1">Optional: Upload an Excel file with question titles, descriptions, and test cases following our template.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {codingUploadStatus === "idle" ? (
                      <label className={`cursor-pointer px-6 py-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${isDarkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-white"}`}>
                        <FileSpreadsheet size={16} /> Choose Excel
                        <input type="file" className="isHidden" accept=".xlsx, .xls" onChange={handleCodingExcelChange} />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-bold text-blue-500 flex items-center gap-2">
                          {codingUploadStatus === "parsing" ? (
                             <>
                               <Loader2 size={14} className="animate-spin" />
                               Parsing File...
                             </>
                          ) : (
                             <>
                               <CheckCircle2 size={14} className="text-emerald-500" />
                               <span className="text-emerald-500">{codingExcelFile?.name}</span>
                             </>
                          )}
                        </div>
                        <button onClick={() =>{ setCodingUploadStatus("idle"); setCodingExcelFile(null);}} className="text-xs text-red-500 font-bold underline">Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* List of saved manual coding questions */}
            {codingQuestions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {codingQuestions.map((q, idx) => (
                  <div key={q.id} className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[150px]">{q.title}</p>
                        <p className="text-[10px] text-slate-500">{q.testCases.length} Test Cases • {q.marks} Marks</p>
                      </div>
                    </div>
                    <button onClick={() => setCodingQuestions(codingQuestions.filter(item => item.id !== q.id))} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
  );
}
