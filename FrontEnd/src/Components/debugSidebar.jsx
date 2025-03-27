import { useEffect, useState } from "react";
import { useFileManager } from "./Contexts/ctx.file_manager";

import { useStore } from "./Contexts/zus.fileManager";

const DebugSidebar = () => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);

    return (
        <div className="debug-sidebar">
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
            </div>
        </div>
    );
};

export default DebugSidebar;
