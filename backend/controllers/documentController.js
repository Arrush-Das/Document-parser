const path = require("path");
const fs = require("fs");
const whisperHelper = require("../utils/whisperHelper");
const mistralHelper = require("../utils/mistralHelper");

const processDocument = async (req, res) => {
    try {
        // Step 1: Get the uploaded file
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const filePath = path.join(__dirname, "../uploads", file.filename);

        // Step 2: Extract text using Whisper
        const extractedText = await whisperHelper.processFile(filePath);
        if (!extractedText) {
            return res.status(500).json({ error: "Failed to extract text" });
        }

        // Step 3: Send text to Mistral for structured processing
        const structuredData = await mistralHelper.analyzeText(extractedText);
        if (!structuredData) {
            return res.status(500).json({ error: "Mistral processing failed" });
        }

        // Step 4: Save structured JSON output
        const outputPath = path.join(__dirname, "../uploads", `${file.filename}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(structuredData, null, 2));

        // Step 5: Return JSON file download link
        res.json({
            message: "Processing successful!",
            extractedText,
            structuredData,
            downloadLink: `/uploads/${file.filename}.json`
        });

    } catch (error) {
        console.error("Error processing document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { processDocument };
