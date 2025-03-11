export async function uploadFile(file, documentType) {
    try {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", documentType);

        const response = await fetch("http://localhost:5000/uploads", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to upload file womp womp");
        }

        return await response.json(); // Return parsed JSON response

    } catch (error) {
        console.error("Upload Error:", error);
        return null;
    }
}
