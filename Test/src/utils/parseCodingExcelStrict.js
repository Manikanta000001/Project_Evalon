import * as XLSX from "xlsx";

export function parseCodingExcelStrict(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          blankrows: false,
          defval: "",
        });

        if (rows.length <= 1) {
          throw new Error("Excel has no data rows");
        }

        const difficultySet = new Set(["Easy", "Medium", "Hard"]);

        const questions = [];
        let currentQuestion = null;

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          while (row.length < 9) row.push("");

          const title = String(row[0]).trim();
          const description = String(row[1]).trim();
          const inputFormat = String(row[2]).trim();
          const outputFormat = String(row[3]).trim();
          const marksRaw = String(row[4]).trim();
          const difficulty = String(row[5]).trim();
          const testInput = String(row[6]).trim();
          const testOutput = String(row[7]).trim();
          const hiddenRaw = String(row[8]).trim().toUpperCase();

          // 🟢 NEW QUESTION STARTS
          if (title) {
            if (!description)
              throw new Error(`Row ${i + 1}: Description missing`);

            if (!marksRaw || isNaN(Number(marksRaw)) || Number(marksRaw) <= 0)
              throw new Error(`Row ${i + 1}: Invalid marks`);

            if (!difficultySet.has(difficulty))
              throw new Error(`Row ${i + 1}: Difficulty must be Easy/Medium/Hard`);

            currentQuestion = {
              type: "coding",
              title,
              description,
              inputFormat,
              outputFormat,
              marks: Number(marksRaw),
              difficulty,
              testCases: [],
            };

            questions.push(currentQuestion);
          }

          // 🔴 If no current question exists
          if (!currentQuestion) {
            throw new Error(`Row ${i + 1}: Test case without problem title`);
          }

          // 🔒 Test case validation
          if (!testInput || !testOutput)
            throw new Error(`Row ${i + 1}: Test case input/output missing`);

          if (!["TRUE", "FALSE"].includes(hiddenRaw))
            throw new Error(`Row ${i + 1}: Hidden must be TRUE or FALSE`);

currentQuestion.testCases.push({
  input: testInput,
  expectedOutput: testOutput,
  isHidden: hiddenRaw === "TRUE",
});

        }

        if (questions.length === 0) {
          throw new Error("No coding questions found");
        }

        resolve(questions);

      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsArrayBuffer(file);
  });
}
