const axios = require("axios");

const JUDGE_URL =
  "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

const LANGUAGE_MAP = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
};

const runSingleTest = async ({ language, sourceCode, stdin }) => {
  const language_id = LANGUAGE_MAP[language];

  if (!language_id) {
    throw new Error("Unsupported language");
  }

  const response = await axios.post(
    JUDGE_URL,
    {
      source_code: sourceCode,
      language_id,
      stdin,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    }
  );

  return response.data;
};

module.exports = { runSingleTest };
