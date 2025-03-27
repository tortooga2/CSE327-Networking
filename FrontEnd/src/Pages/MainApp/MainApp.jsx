import { useState, useRef, useEffect } from "react";

import "./MainApp.css";

import {
    FileManagerProvider,
    useFileManager,
} from "../../Components/Contexts/ctx.file_manager.jsx";

import FileViewer from "../../Components/Fileviewer/Fileviewer.jsx";

import Dashboard from "../../Components/Dashboard.jsx";
import Sidebar from "../../Components/Sidebar.jsx";

import DebugSidebar from "../../Components/debugSidebar.jsx";

import { useStore } from "../../Components/Contexts/zus.fileManager";

const MainApp = () => {
    return (
        <FileManagerProvider>
            <div style={{ display: "flex" }}>
                <DebugSidebar />
                <FileViewer />
            </div>
        </FileManagerProvider>
    );
};

export default MainApp;
