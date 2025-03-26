import { useEffect, useState } from "react";
import { useFileManager } from "./Contexts/ctx.file_manager";

const DebugSidebar = () => {
    const { fileManager } = useFileManager();

    return (
        <div className="debug-sidebar">
            <h1>Debug Sidebar</h1>
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
                <button onClick={() => fileManager.TestFunction()}>
                    Create new file.
                </button>
                <button onClick={() => fileManager.ConnectFiles()}>
                    Connect File(s): {fileManager.selectedFiles.length}
                </button>
            </div>
        </div>
    );
};

export default DebugSidebar;
