import { useState, useRef, useEffect } from "react";

import "./MainApp.css";

import FileViewer from "../../Components/Fileviewer/Fileviewer.jsx";

import Dashboard from "../../Components/Dashboard.jsx";
import Sidebar from "../../Components/Sidebar.jsx";

import { useUser } from "../../Components/Contexts/ctx.user.jsx";
import { useStore } from "../../Components/Contexts/zus.fileManager.jsx";

import DebugSidebar from "../../Components/SideBar.jsx";

import FilePreview from "../../Components/FilePreview/FilePreview.jsx";
import NewPage from "../../Components/UILayout/NewPage.jsx";
import HorizontalDiv from "../../Components/UILayout/HorizontalDiv.jsx";
import VerticalDiv from "../../Components/UILayout/VerticalDiv.jsx";
import Header from "../../Components/header.jsx";

const MainApp = () => {
    const { user } = useUser();

    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });

    useEffect(() => {
        user.ValidateSession();
    }, [user]);

    return (
        <NewPage>
            <HorizontalDiv>
                <VerticalDiv width="400px" padding="0rem">
                    <Header />
                    <DebugSidebar />
                    <VerticalDiv height="70%"></VerticalDiv>
                </VerticalDiv>
                <HorizontalDiv
                    padding="0rem"
                    gap="0rem"
                    style={{ alignItems: "flex-start" }}
                >
                    <FileViewer width="100%" />
                    <FilePreview />
                </HorizontalDiv>
            </HorizontalDiv>
        </NewPage>
    );
};

export default MainApp;
