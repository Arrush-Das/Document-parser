import React, { useState } from "react";

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [docType, setDocType] = useState("travel ticket");
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadFile = async () => {
        if (!selectedFile) {
            alert("❌ Please select a file first!");
            return;
        }

        let formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("documentType", docType);

        try {
            setLoading(true);
            let response = await fetch("http://localhost:5000/uploads", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let result = await response.json();
            console.log("✅ Uploaded File Details:", result);
            setOutput(result);
        } catch (error) {
            console.error("❌ Upload Error:", error);
            alert("Failed to upload file! Check console.");
        } finally {
            setLoading(false);
        }
    };

    const downloadJSON = () => {
        if (!output || !selectedFile) return;

        // Extract original filename (without extension)
        const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");

        // Generate JSON file name dynamically
        const jsonFileName = `${fileNameWithoutExt}-parsed.json`;

        const jsonString = JSON.stringify(output, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = jsonFileName;
        link.click();
    };

    return (
        <div style={styles.container}>
            <h1>📄 Document Parser</h1>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            
            <select value={docType} onChange={(e) => setDocType(e.target.value)} style={styles.select}>
                <option value="travel ticket">✈️ Travel Ticket</option>
                <option value="invoice">📄 Invoice</option>
                <option value="identification">🪪 ID</option>
                <option value="education">🎓 Education</option>


            </select>

            <button onClick={uploadFile} style={styles.uploadBtn} disabled={loading}>
                {loading ? "Uploading..." : "📤 Upload"}
            </button>

            {output && (
                <div style={styles.outputContainer}>
                    <h2>✅ Parsed JSON:</h2>
                    <pre style={styles.jsonDisplay}>{JSON.stringify(output, null, 2)}</pre>
                    
                    <button onClick={downloadJSON} style={styles.downloadBtn}>⬇️ Download JSON</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
    },
    select: {
        margin: "10px",
        padding: "8px",
    },
    uploadBtn: {
        backgroundColor: "#007BFF",
        color: "white",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    outputContainer: {
        marginTop: "20px",
        textAlign: "left",
    },
    jsonDisplay: {
        backgroundColor: "#f4f4f4",
        padding: "10px",
        borderRadius: "5px",
        maxHeight: "300px",
        overflowY: "auto",
    },
    downloadBtn: {
        backgroundColor: "#28A745",
        color: "white",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "10px",
    },
};

export default App;
