import { useEffect, useRef } from "react";

import { FaUpload, FaLink, FaTimes, FaTrash } from "react-icons/fa";
import { useStore } from "./Contexts/zus.fileManager";

const DebugSidebar = () => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);
    const connectFiles = useStore((state) => state.connectFiles);
    const uploadFile = useStore((state) => state.uploadFiles);
    const refreshFiles = useStore((state) => state.refreshFiles);
    const deleteFiles = useStore((state) => state.deleteFiles);

    const formRef = useRef(null);

    useEffect(() => {
        if (!formRef.current) {
            return;
        }
        formRef.current.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fileInput = e.target.querySelector('input[type="file"]');
            const files = fileInput.files;
            if (!files || files.length === 0) {
                console.error("No files selected");
                return;
            }
            let filesArray = [];
            try {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    console.log("Uploading file:", file.name);
                    const fileResponse = await uploadFile(file);
                    filesArray.push(fileResponse);
                }

                fileInput.value = "";

                alert("Files uploaded successfully!");
            } catch (error) {
                console.error("Error during upload:", error);
                alert("Error uploading files. Please try again.");
            }
        });
    }, [uploadFile]);

    return (
        <div
            className="debug-sidebar"
            style={{
                padding: "1.5rem",
                height: "100%",
                backgroundColor: "#F8F6FD",
                borderLeft: "1px solid #E2E8F0",
                boxShadow: "-2px 0 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
            }}
        >
            <h2
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#1E0B33",
                    marginBottom: "1rem",
                }}
            >
                Debug Console
            </h2>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <div
                    onClick={UnSelectAll}
                    style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "#1E0B33",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <FaTimes /> Unselect All ({selectedFiles.size})
                </div>

                <div
                    onClick={connectFiles}
                    style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "#C8B0FF",
                        color: "#1E0B33",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <FaLink />
                    Connect Files
                </div>
            </div>

            <hr style={{ borderColor: "#E2E8F0", margin: "1rem 0" }} />

            <form
                id="fileForm"
                ref={formRef}
                style={{
                    marginTop: "1rem",
                    padding: "1.5rem",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                }}
            >
                <label
                    htmlFor="fileInput"
                    style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#4A5568",
                        fontSize: "0.9rem",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <FaUpload /> <p>Upload File</p>
                    </div>
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
                        transition: "background-color 0.2s",
                        width: "100%",
                        fontSize: "0.9rem",
                    }}
                >
                    Upload
                </button>
            </form>

            <div
                onClick={deleteFiles}
                style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "#FF8A8A",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                <FaTrash /> <p>Delete Files ({selectedFiles.size})</p>
            </div>
        </div>
    );
};

export default DebugSidebar;
