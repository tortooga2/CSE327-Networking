import { FaUpload } from "react-icons/fa";
import { useRef } from "react";
import { useStore } from "../Contexts/ctx.appManager";

const UploadFilesButton = ({ minimal }) => {
    const uploadFile = useStore((state) => state.uploadFiles);
    const formRef = useRef(null);

    if (minimal) {
        return (
            <label title="Upload File" style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <FaUpload size={20} />
                <input
                    type="file"
                    style={{ display: "none" }}
                    multiple
                    onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        try {
                            await uploadFile(files);
                            e.target.value = "";
                        } catch {}
                    }}
                />
            </label>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fileInput = e.target.querySelector('input[type="file"]');
        const files = fileInput.files;
        if (!files || files.length === 0) {
            alert("No files selected");
            return;
        }
        try {
            await uploadFile(files);
            fileInput.value = "";
            alert("Files uploaded successfully!");
        } catch (error) {
            alert("Error uploading files. Please try again.");
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} style={{ width: "100%" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4A5568", fontSize: "0.9rem" }}>
                <FaUpload /> Upload File
            </label>
            <input
                type="file"
                style={{
                    padding: "0.75rem",
                    border: "1px solid #CBD5E0",
                    borderRadius: "6px",
                    width: "100%",
                    fontSize: "0.9rem",
                    backgroundColor: "#F7FAFC",
                    marginBottom: "1rem",
                }}
                multiple
            />
            <button
                type="submit"
                style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "#8BFFB0",
                    color: "#1E0B33",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "0.9rem",
                }}
            >
                Upload
            </button>
        </form>
    );
};

export default UploadFilesButton;