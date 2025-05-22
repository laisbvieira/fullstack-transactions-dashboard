const express = require("express");
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });


router.get("/", authMiddleware, transactionController.get)
router.post("/", authMiddleware, transactionController.create);
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"), 
  transactionController.upload 
);

module.exports = router;
