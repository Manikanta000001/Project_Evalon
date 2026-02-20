import { useEffect } from "react";
export default function LeftPanel({
  question,
  questionIdx,
  activeTab,
  setActiveTab,
  isOpen,
  judgeResults,
}) {
  useEffect(() => {
    if (judgeResults) {
      setActiveTab("testcases");
    }
  }, [judgeResults]);


  return (
    <div
      className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${
        isOpen ? "w-[40%] min-w-[320px]" : "w-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="p-8 overflow-y-auto flex-1">
        {question.type === "mcq" ? (
          <div className="space-y-4">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest uppercase">
              Question {questionIdx + 1}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight mt-3">
              {question.text}
            </h3>
            <p className="text-slate-400 text-sm italic pt-4">
              Select the best answer from the options on the right.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-3 px-4 text-[10px] font-bold uppercase tracking-widest border-b-2 ${
                  activeTab === "description"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400"
                }`}
              >
                Problem
              </button>
              <button
                onClick={() => setActiveTab("testcases")}
                className={`py-3 px-4 text-[10px] font-bold uppercase tracking-widest border-b-2 ${
                  activeTab === "testcases"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400"
                }`}
              >
                Test Cases
              </button>
            </div>

            {activeTab === "description" ? (
              <>
                {/* Title + Meta Row */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xl leading-tight">
                    {question.text}
                  </h4>

                  {/* Meta Info Row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Difficulty Badge */}
                    {question.difficulty && (
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          question.difficulty === "Easy"
                            ? "bg-green-100 text-green-700"
                            : question.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    )}

                    {/* Marks Badge */}
                    {question.marks && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700">
                        {question.marks} Marks
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {question.description}
                </div>

                {/* Input Format */}
                {question.inputFormat && (
                  <div className="mt-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Input Format
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 whitespace-pre-wrap">
                      {question.inputFormat}
                    </div>
                  </div>
                )}

                {/* Output Format */}
                {question.outputFormat && (
                  <div className="mt-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Output Format
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 whitespace-pre-wrap">
                      {question.outputFormat}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {/* {question.testCases?.map((tc, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border">
                    <p className="text-[10px] font-bold text-slate-400">
                      INPUT
                    </p>
                    <code className="text-xs block bg-white p-2 rounded">
                      {tc.input}
                    </code>
                    <p className="text-[10px] font-bold text-slate-400">
                      EXPECTED
                    </p>
                    <code className="text-xs block bg-blue-50 p-2 rounded">
                      {tc.expectedOutput}
                    </code>
                  </div>
                ))} */}
                {question.testCases?.map((tc, i) => {
                  const result = judgeResults?.find(
                    (r) => r.input === tc.input,
                  );

                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        result
                          ? result.passed
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Input
                      </p>
                      <code className="text-xs block bg-white p-2 rounded mt-1">
                        {tc.input}
                      </code>

                      {!tc.isHidden && (
                        <>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-3">
                            Expected
                          </p>
                          <code className="text-xs block bg-blue-50 p-2 rounded mt-1">
                            {tc.expectedOutput}
                          </code>
                        </>
                      )}

                      {result && (
                        <>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-3">
                            Output
                          </p>
                          <code className="text-xs block bg-white p-2 rounded mt-1">
                            {result.output}
                          </code>

                          <div className="mt-3 text-xs font-bold">
                            {result.passed ? (
                              <span className="text-green-600">✔ Passed</span>
                            ) : (
                              <span className="text-red-600">✖ Failed</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
