import * as XLSX from "xlsx";

/**
 * STRICT MCQ Excel Parser (Frontend)
 * Mirrors ExcelJS backend behavior
 */
export function parseMCQExcelStrict(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Force column positions (DO NOT auto-trim)
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          blankrows: false,
          defval: "",          // 🔑 IMPORTANT
        });

        if (rows.length <= 1) {
          throw new Error("Excel has no data rows");
        }

        const answerIndexMap = { A: 0, B: 1, C: 2, D: 3, E: 4 };
        const questions = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];

          // 🔒 Normalize row length to at least 9 columns (A–I)
          while (row.length < 9) row.push("");

          const text = String(row[2]).trim();      // Column C
          const correctRaw = String(row[8]).trim(); // Column I

          // 1️⃣ Question text
          if (!text) {
            throw new Error(`Row ${i + 1}: Question text missing`);
          }

          // 2️⃣ Correct answer
          if (!answerIndexMap.hasOwnProperty(correctRaw)) {
            throw new Error(`Row ${i + 1}: Invalid correct answer \n (upload properly structured excel)`);
          }

          // 3️⃣ Options (D → H)
          const options = [];
          let currentIndex = 0;

          for (let col = 3; col <= 7; col++) {
            const optionText = String(row[col]).trim();
            if (optionText) {
              options.push({
                index: currentIndex,
                text: optionText,
              });
              currentIndex++;
            }
          }

          if (options.length < 2) {
            throw new Error(`Row ${i + 1}: Less than 2 options`);
          }

          const correctOptionIndex = answerIndexMap[correctRaw];

          if (correctOptionIndex >= options.length) {
            throw new Error(
              `Row ${i + 1}: Correct answer index out of range`
            );
          }

          questions.push({
            type: "mcq",
            text,
            options,
            correctOptionIndex,
          });
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
