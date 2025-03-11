const express = require("express");
const multer = require("multer");
const documentController = require("../controllers/documentController");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// POST route for document processing
router.post("/process", upload.single("file"), documentController.processDocument);

module.exports = router;
