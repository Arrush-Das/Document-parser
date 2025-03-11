const axios = require("axios");
const fs = require("fs");
require("dotenv").config();


const WHISPER_API_KEY = process.env.LLMWHISP_API_KEY;
//console.log("whisper key: " , WHISPER_API_KEY)
const WHISPER_UPLOAD_URL = "https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper";
const WHISPER_RETRIEVE_URL = "https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper-retrieve";

const uploadToWhisper = async (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);

        const response = await axios.post(WHISPER_UPLOAD_URL, fileBuffer, {
            headers: { 
                "unstract-key": WHISPER_API_KEY, 
                "Content-Type": "application/octet-stream"
            }
        });

        return response.status === 202 && response.data?.whisper_hash ? response.data.whisper_hash : null;

    } catch (error) {
        console.error("Whisper Upload Error:", error.response?.data || error.message);
        return null;
    }
};

const retrieveFromWhisper = async (whisperHash, maxRetries = 10, baseDelay = 5000) => {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const response = await axios.get(`${WHISPER_RETRIEVE_URL}?whisper_hash=${whisperHash}`, {
                headers: { "unstract-key": WHISPER_API_KEY }
            });

            if (response.status === 200 && response.data?.result_text) {
                console.log("✅ Whisper extraction successful!");
                return response.data.result_text;  // ✅ Return extracted text
            }

            console.log(`⏳ Whisper not ready (Attempt ${retries + 1}/${maxRetries}), retrying in ${baseDelay / 1000} sec...`);
            
            await new Promise(resolve => setTimeout(resolve, baseDelay));  // 🔄 Wait before retrying
            baseDelay *= 1.5;  // ⏳ Increase wait time (Exponential Backoff)
            retries++;

        } catch (error) {
            console.error("❌ Whisper Retrieve Error:", error.response?.data || error.message);
            return null;
        }
    }

    console.log("❌ Whisper still not ready after maximum retries!");
    return null;
};


module.exports = { uploadToWhisper, retrieveFromWhisper };
