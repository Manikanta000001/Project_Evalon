const express = require("express");
const router = express.Router();

const {
  createPaper,
  getAllPapers,
  getPaperById,
} = require("../controllers/paper.controller");

router.post("/", createPaper);
router.get("/", getAllPapers);
router.get("/:id", getPaperById);



module.exports = router;