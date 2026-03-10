const express = require("express");
const router = express.Router();

const {
  uploadQuestionBank,
  getPendingForHOD, 
  approveByHOD,
  rejectByHOD,
  getApprovedForExamCell,
  getMyQuestionBanks

} = require("../controllers/questionBank.controller");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const upload = require("../middleware/multer"); // your multer memoryStorage

// Teacher uploads question bank
router.post(
  "/upload",
  protect,
  authorizeRoles("teacher"),
  upload.single("file"),
  uploadQuestionBank
);


router.get(
  "/pending",
  protect,
  authorizeRoles("hod"),
  getPendingForHOD
);

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("hod"),
  approveByHOD
);


router.put(
  "/:id/reject",
  protect,
  authorizeRoles("hod"),
  rejectByHOD
);


router.get(
  "/approved",
  protect,
  authorizeRoles("examcell","principal"),
  getApprovedForExamCell
);


router.get(
  "/my-submissions",
  protect,
  authorizeRoles("teacher"),
  getMyQuestionBanks
);

module.exports = router;