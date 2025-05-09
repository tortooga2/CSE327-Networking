import { FaUpload } from "react-icons/fa";
import { useRef, useState } from "react";
import useFileUpload from "../../features/useFileUpload";
import UploadProgressBar from "../UploadProgressBar";
import { useStore } from "../Contexts/ctx.appManager";

const UploadFilesButton = ({ minimal }) => {
    const formRef = useRef(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { uploadFiles, progress, isUploading } = useFileUpload();
    const refreshFiles = useStore((state) => state.loadFiles);
    const getPresignedUrls = async (count) => {
        const response = await fetch(`/api/file/upload-helper?count=${count}`, {
            method: "GET",
            credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to get upload URLs");
        return await response.json();
    };
    const verifyFiles = async (keys, fileNames) => {
        await fetch("/api/file/verify", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys, fileNames }),
        });
    };
    const handleUpload = async (files) => {
        setError("");
        setSuccess("");
        try {
            const fileArr = Array.from(files);
            const fileNames = fileArr.map((f) => f.name);
            const { urls, keys } = await getPresignedUrls(fileArr.length);
            await uploadFiles(fileArr, async () => ({ urls, keys }));
            await verifyFiles(keys, fileNames);
            setSuccess("Files uploaded successfully!");
            if (refreshFiles) await refreshFiles();
        } catch (err) {
            setError("Error uploading files. Please try again.");
        }
    };
    const isMobile = () => window.innerWidth <= 768;
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
                        await handleUpload(files);
                        e.target.value = "";
                    }}
                />
                {isUploading && isMobile() && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}>
                        <div style={{ width: 300, maxWidth: "80vw" }}>
                            <UploadProgressBar progress={progress} />
                        </div>
                    </div>
                )}
            </label>
        );
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fileInput = e.target.querySelector('input[type="file"]');
        const files = fileInput.files;
        if (!files || files.length === 0) {
            setError("No files selected");
            return;
        }
        await handleUpload(files);
        fileInput.value = "";
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
            {isUploading && <UploadProgressBar progress={progress} />}
            {error && <div style={{ color: "red", marginBottom: "0.5rem" }}>{error}</div>}
            {success && <div style={{ color: "green", marginBottom: "0.5rem" }}>{success}</div>}
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
                disabled={isUploading}
            >
                Upload
            </button>
        </form>
    );
};

export default UploadFilesButton;