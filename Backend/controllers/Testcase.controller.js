const Question = require("../models/Question.model");
const { runSingleTest } = require("../services/judge.service");

const runAllTestCases = async (req, res) => {
  try {
    const { questionId, language, sourceCode } = req.body;

    const question = await Question.findById(questionId);

    if (!question || question.type !== "coding") {
      return res.status(404).json({ message: "Coding question not found" });
    }

    const results = [];

    for (const testCase of question.testCases) {
      const execution = await runSingleTest({
        language,
        sourceCode,
        stdin: testCase.input,
      });

      const passed =
        execution.stdout?.trim() === testCase.expectedOutput?.trim();

      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        output: execution.stdout,
        passed,
        isHidden: testCase.isHidden,
      });
    }

    res.json({
      success: true,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Execution failed" });
  }
};
module.exports = {
  
  runAllTestCases,
};
