# Document Parser  

## Overview  
This project is a **Document Parsing Application** that allows users to upload a document (PDF or image) and specify its type. The system extracts text using **LLMWhisperer**, processes it with **Mistral LLM**, and generates a structured JSON output that can be downloaded.  

## Features  
- Upload documents (PDFs or images).  
- Select the type of document for better text processing.  
- Convert documents to plain text using **LLMWhisperer**.  
- Process extracted text with **Mistral LLM** using an appropriate prompt.  
- Receive a structured **JSON output** for easy data handling.  

## Tech Stack  

### Backend  
- **Node.js & Express.js** – API handling.  
- **LLMWhisperer** – Converts documents to text.  
- **Mistral LLM** – Extracts structured data from text.  

### Frontend  
- **React.js** – User-friendly interface for document upload and result display.  

## Installation  

### 1. Clone the Repository  
```sh
git clone https://github.com/arrush-das/document-parser.git
cd document-parser

#Backend Setup  
cd backend
npm install
#Start the server
node server.js
#Frontend Setup
cd ../frontend
npm install
npm start
#This will start the frontend on http://localhost:3000.
```

## Usage
- Open the web app.
- Upload a document (PDF or image).
- Select the document type.
- Click submit to start processing.
- Download the structured JSON output.