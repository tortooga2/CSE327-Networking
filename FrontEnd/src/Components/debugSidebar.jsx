import { useEffect, useState, useRef } from "react";
import { useFileManager } from "./Contexts/ctx.file_manager";

import { useStore } from "./Contexts/zus.fileManager";

const DebugSidebar = () => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);
    const connectFiles = useStore((state) => state.connectFiles);
    const uploadFile = useStore((state) => state.uploadFiles);

    const formRef = useRef(null);

    useEffect(() => {
        if (!formRef.current) {
            return;
        }
        formRef.current.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Access files from the file input element within the form
            const fileInput = e.target.querySelector('input[type="file"]');
            const files = fileInput.files;
            if (!files || files.length === 0) {
                console.error("No files selected");
                return;
            }
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log("FILE NAME: ", file.name);
                await uploadFile(file);
            }
            // You can also access the file input value if needed
            console.log(files);
        });
    }, []);

    return (
        <div
            className="debug-sidebar"
            style={{ padding: "1rem", height: "90vh" }}
        >
            <h2>Debug Sidebar</h2>
            <p>Debugging information will be displayed here</p>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* <button onClick={() => fileManager.TestFunction()}>
                    Create new file.
                </button>
                <button onClick={() => fileManager.ConnectFiles()}>
                    Connect File(s): {fileManager.selectedFiles.length}
                </button> */}
                <button onClick={UnSelectAll}>
                    Unselect All ({selectedFiles.size})
                </button>
                <button onClick={connectFiles}>Connect Files</button>

                <form id="fileForm" ref={formRef}>
                    <label htmlFor="fileInput">
                        <i>Upload File: </i>
                    </label>
                    <input type="file" />

                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
};

export default DebugSidebar;
