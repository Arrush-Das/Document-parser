const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const whisperHelper = require("./utils/whisperHelper");
const mistralHelper = require("./utils/mistralHelper");
require("dotenv").config();
//console.log("WHISPER_API_KEY:", process.env.LLMWHISP_API_KEY);
//console.log("MISTRAL_API_KEY:", process.env.MISTRAL_API_KEY);

const app = express();
const PORT = 5000;
// Middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });


app.use(cors({
    origin: "http://localhost:3000",  // ✅ Allow React frontend
    methods: ["GET", "POST"],
    credentials: true
}));


// Serve uploaded JSON files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Route
app.get("/", (req, res) => {
    res.send("✅ Backend is running!");
});

// File Upload & Processing Route
app.post("/uploads", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "❌ No file uploaded" });
        }

        const filePath = path.join(__dirname, "uploads", req.file.filename);
        console.log(`📂 File uploaded: ${filePath}`);

        // ✅ Step 1: Extract text using Whisper
        console.log('sending pdf to LLMWhisperer')
        const whisperID = await whisperHelper.uploadToWhisper(filePath)
        console.log("⏳ Waiting for Whisper to process the document...");
        await new Promise(resolve => setTimeout(resolve, 10000));  // 🔄 Wait for 10 seconds before first attempt

        console.log('getting text from LLMWhisperer')

        const extractedText = await whisperHelper.retrieveFromWhisper(whisperID);
        console.log("📜 Extracted text:", extractedText);

        if (!extractedText || extractedText.trim() === "") {
            return res.status(500).json({ error: "❌ Whisper extraction failed" });
        }

        // ✅ Step 2: Analyze text with Mistral LLM
        const structuredData = await mistralHelper.queryMistral(extractedText);
        console.log("📊 Structured Data:", structuredData);

        if (!structuredData) {
            return res.status(500).json({ error: "❌ Mistral processing failed" });
        }

        // ✅ Step 3: Save JSON output
        const jsonOutputPath = path.join(__dirname, "uploads", `${req.file.filename}.json`);
        fs.writeFileSync(jsonOutputPath, JSON.stringify(structuredData, null, 2));

        // ✅ Step 4: Return JSON file download link
        res.json({
            message: "✅ Processing successful!",
            extractedText,
            structuredData,
            downloadLink: `/uploads/${req.file.filename}.json`
        });

    } catch (error) {
        console.error("❌ Processing error:", error);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
