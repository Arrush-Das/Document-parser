const axios = require("axios");
require("dotenv").config();

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

const queryMistral = async (text, documentType) => {
    const prompts = {
"travel_ticket": `I want to extract relevant details from a travel ticket PDF.

The document could be a flight ticket, train ticket, bus ticket, or a ticket related to travel.
Extract the following key details:

Passenger Name
Ticket Number
Carrier Name (Airline, Train, or Bus Operator)
Departure & Arrival Locations
Departure & Arrival Dates and Times
Seat Number (if available)
Price (including currency)
Booking Reference (PNR)
Any other relevant details (like class of travel, baggage allowance, etc.)
Return a JSON object with these details, ensuring accuracy and completeness.
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY 
Be careful to:

Extract details accurately as they appear in the document.
Ensure that the JSON keys match the extracted fields properly.
Preserve the format of date, time, and currency as found in the document.
Ignore unnecessary text like advertisements or unrelated content.
Do NOT assume or generate new data. 
If a field is missing, return an empty string. 
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY
Context:
This is for a document parsing application that takes a travel-related PDF, 
extracts structured information,
and makes the JSON file available for download. 
The document may have various formats,
so adaptability in extraction is important.
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY

Here is the ticket text: ${text} `,
        
"invoice": `
          I want to extract relevant details from an invoice or bill PDF.

The document could be a purchase invoice, utility bill, medical bill, or any other transaction-related document. 
Extract the following key details:

- Vendor/Seller Name  
- Invoice/Bill Number  
- Buyer Name (if available)  
- Date of Issue  
- Due Date (if available)  
- List of Items/Services Purchased (with quantity, unit price, and total price)  
- Subtotal (before tax and discounts)  
- Tax Amount (including type, if available)  
- Discounts (if any)  
- Total Amount Payable (including currency)  
- Payment Method (if mentioned)  
- Any other relevant details (such as invoice notes, terms & conditions, etc.)  
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY
**Return a JSON object with these details, ensuring accuracy and completeness.**  

Be careful to:  
- Extract details exactly as they appear in the document.  
- Ensure that the JSON keys match the extracted fields properly.  
- Preserve the format of dates, amounts, and currency as found in the document.  
- Ignore unnecessary text like advertisements or unrelated content.  
- Do **NOT** assume or generate new data.  
- If a field is missing, return an empty string.  
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY

**Context:**  
This is for a document parsing application that takes an invoice or bill in PDF format,  
extracts structured information, and makes the JSON file available for download.  
The document may have various formats, so adaptability in extraction is important.  
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY

Here is the invoice text: ${text}` ,

"Identification" : `You are an AI document parser. Your task is to extract structured data from various identification documents. These may include:
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY

Passport
Driving License
National ID Card (e.g., Aadhaar, Social Security, PAN)
Voter ID Card
Employee or Student ID Card
Instructions:
Extract only the details that are present in the document. Do not assume or generate any data.
Maintain the original format for dates, numbers, and text.
Return the extracted data as a valid JSON object only. Do not include any additional text.
If a field is missing, return an empty string ("").
Fields to Extract (If Available):
document_type: Type of document (e.g., "passport", "driving_license", "national_id").
full_name: Name of the document holder.
id_number: Unique identification number.
date_of_birth: Holders date of birth.
issue_date: Date the document was issued.
expiry_date: Expiration date, if applicable.
nationality: Nationality of the document holder, if present.
gender: Gender, if specified.
address: Address, if available.
additional_details: Other relevant information, such as vehicle category for driving licenses or student ID numbers.
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY
ENSURE YOU RETURN THE REQUESTED DATA IN JSON FORMAT ONLY

Here is the identification text: ${text}` ,

"Education":`You are an AI document parser. Your task is to extract structured data from educational and certification documents. These may include:

Mark Sheets / Report Cards
Degree Certificates
Admission Letters
Online Course Certificates
Instructions:
Extract only the details present in the document. Do not assume or generate any data.
Maintain the original format for dates, numbers, and text.
Return the extracted data as a valid JSON object only. Do not include any additional text.
If a field is missing, return an empty string ("").
Fields to Extract (If Available):
document_type: Type of document (e.g., "mark_sheet", "degree_certificate", "admission_letter").
full_name: Name of the student or certificate holder.
institution_name: Name of the school, university, or issuing organization.
course_name: Name of the course, program, or degree (if applicable).
grades: List of subjects with corresponding grades (for mark sheets).
completion_date: Date of course completion or graduation.
admission_date: Date of admission (if applicable).
certificate_id: Unique certificate or document number (if available).
additional_details: Other relevant information, such as honors, GPA, or class ranking.

PERCENTAGE : ADD A FIELD WHERE THE TOTAL OVERALL PERCENTAGE OF ALL THE SUBJECTS OF THE STUDENT IS CALCULATED AND DISPLAYED  

Here is the educational text: ${text} ` 

};

    const prompt = prompts[documentType] || "RETURN ONLY A JSON OBJECT NOTHING ELSE Extract structured data from the document in JSON format ONLY.";

    try {
        const response = await axios.post(MISTRAL_URL, {
            model: "mistral-medium",
            messages: [{ role: "user", content: `${prompt}\n\n${text}` }]
        }, { headers: { Authorization: `Bearer ${MISTRAL_API_KEY}`, "Content-Type": "application/json" } });
        let rawText = response.data?.choices?.[0]?.message?.content || "{}";

        // ✅ Step 1: Remove unwanted characters before parsing
        rawText = rawText.trim().replace(/```json|```/g, "").replace(/\\/g, ""); // Remove JSON code block and unnecessary escape characters

        // ✅ Step 2: Parse JSON safely
        let extractedData;
        try {
            extractedData = JSON.parse(rawText);
        } catch (parseError) {
            console.error("❌ Error parsing JSON response:", parseError.message);
            return null;
        }

        return extractedData;

        return extractedData;
    } catch (error) {
        console.error("Mistral Query Error:", error.message);
        return null;
    }
};

module.exports = { queryMistral };
