const Paper = require("../models/Paper.js") ;

// CREATE
exports.createPaper = async (req, res) => {
  try {
    const { meta, questions } = req.body;

    const newPaper = new Paper({
      meta,
      questions,
    });

    const saved = await newPaper.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error saving paper", error: err.message });
  }
};

// GET ALL
exports.getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
exports.getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    res.json(paper);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};