const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    filename: String,
    documentType: String,
    extractedText: String,
    structuredData: Object,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Document", DocumentSchema);
