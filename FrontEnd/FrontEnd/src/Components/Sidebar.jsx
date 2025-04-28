import { useEffect, useRef } from "react";

import { FaUpload, FaLink, FaTimes, FaTrash } from "react-icons/fa";
import { useStore } from "./Contexts/ctx.appManager";

// import NoteCreation from "./NoteCreation";
import VerticalDiv from "./UILayout/VerticalDiv";

import NoteCreation from "./NoteCreation";

const DebugSidebar = () => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);
    const connectFiles = useStore((state) => state.connectFiles);
    const uploadFile = useStore((state) => state.uploadFiles);

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

            try {
                await uploadFile(files);
                //             let filesArray = [];
                //             try {
                //                 for (let i = 0; i < files.length; i++) {
                //                     const file = files[i];
                //                     console.log("Uploading file:", file.name);
                //                     const fileResponse = await uploadFile(file);
                //                     filesArray.push(fileResponse);
                //                 }

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
            style={{
                // border: "1px solid",
                // borderRadius: "1rem",
                // borderImageSlice: 1,
                // borderImageSource:
                //     "linear-gradient(130deg, #FFEEDB 60%, #dd614a)",
                padding: "1rem",

                gap: "1rem",
                flexDirection: "column",
                justifyContent: "space-between",
                display: "flex",
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

            <form
                id="fileForm"
                ref={formRef}
                style={{
                    padding: "1.5rem",
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    border: "1px solid black",
                }}
            >
                <input
                    type="file"
                    style={{
                        padding: "0.75rem",
                        border: "1px solid black",
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
            <NoteCreation />
        </div>
    );
};

export default DebugSidebar;
