import { useState, useRef, useEffect } from "react";

import "./MainApp.css";

import {
    FileManagerProvider,
    useFileManager,
} from "../../Components/Contexts/ctx.file_manager.jsx";

import FileViewer from "../../Components/Fileviewer/Fileviewer.jsx";

import Dashboard from "../../Components/Dashboard.jsx";
import Sidebar from "../../Components/Sidebar.jsx";

import { useUser } from "../../Components/Contexts/ctx.user.jsx";

import DebugSidebar from "../../Components/debugSidebar.jsx";

import { useStore } from "../../Components/Contexts/zus.fileManager";
import FilePreview from "../../Components/FilePreview/FilePreview.jsx";
import NewPage from "../../Components/UILayout/NewPage.jsx";
import HorizontalDiv from "../../Components/UILayout/HorizontalDiv.jsx";
import VerticalDiv from "../../Components/UILayout/VerticalDiv.jsx";


const MainApp = () => {
    const { user } = useUser();

    useEffect(() => {
        user.ValidateSession();
    }, [user]);

    return (
        <NewPage>
            <HorizontalDiv>

                <DebugSidebar />
                <HorizontalDiv padding="0rem" gap="0rem">
                    <FileViewer width="100%" />
                    <FilePreview />
                </HorizontalDiv>
            </HorizontalDiv>
        </NewPage>
    );
};

export default MainApp;
