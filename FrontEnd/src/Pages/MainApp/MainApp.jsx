import { useState, useRef, useEffect } from "react";

import "./MainApp.css";

import FileViewer from "../../Components/Fileviewer/Fileviewer.jsx";

import Dashboard from "../../Components/Dashboard.jsx";
import Sidebar from "../../Components/Sidebar.jsx";

import { useUser } from "../../Components/Contexts/ctx.user.jsx";
import { useStore } from "../../Components/Contexts/ctx.appManager.jsx";

import DebugSidebar from "../../Components/SideBar.jsx";

import FilePreview from "../../Components/FilePreview/FilePreview.jsx";
import NewPage from "../../Components/UILayout/NewPage.jsx";
import HorizontalDiv from "../../Components/UILayout/HorizontalDiv.jsx";
import VerticalDiv from "../../Components/UILayout/VerticalDiv.jsx";
import Header from "../../Components/Header.jsx";

const MainApp = () => {
    const { user } = useUser();

    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });

    const layoutState = useStore((state) => state.layoutState);

    useEffect(() => {
        user.ValidateSession();
    }, [user]);

    return (
        <NewPage>
            <VerticalDiv padding="0.5rem" style={{ position: "relative" }}>
                <HorizontalDiv>
                    <VerticalDiv
                        width="37%"
                        style={{ backgroundColor: "white" }}
                    >
                        <h1>This is a placeholder</h1>
                    </VerticalDiv>
                    <HorizontalDiv width="100%"></HorizontalDiv>
                    <FilePreview width="90%" />
                </HorizontalDiv>
                <HorizontalDiv
                    width="60%"
                    padding="0rem"
                    style={{
                        position: "absolute",
                        borderRadius: "0.5rem",
                        // border: "1px solid black",
                        padding: "1rem",
                        background:
                            "linear-gradient(var(--special-color), var(--grad-color))",
                        transition: "all 0.3s cubic-bezier(.47,1.64,.41,.8)",
                    }}
                    state={[
                        {
                            width: "100%",
                            left: "0",
                            // transition:
                            //     "all 0.3s cubic-bezier(.47,1.64,.41,.8)",
                        },
                        {
                            width: "60%",
                            left: "0",
                            // transition:
                            //     "all 0.3s cubic-bezier(.47,1.64,.41,.8)",
                        },
                        {
                            width: "80%",
                            left: "20%",
                            // transition:
                            //     "all 0.3s cubic-bezier(.47,1.64,.41,.8)",
                        },
                    ]}
                    playAnimation={layoutState}
                >
                    <VerticalDiv width="350px" padding="0rem">
                        <Header />
                        <DebugSidebar />
                        <VerticalDiv height="100%"></VerticalDiv>
                    </VerticalDiv>
                    <HorizontalDiv
                        padding="0rem"
                        gap="0rem"
                        style={{ alignItems: "flex-start" }}
                    >
                        <FileViewer width="100%" />
                    </HorizontalDiv>
                </HorizontalDiv>
            </VerticalDiv>
        </NewPage>
    );
};

export default MainApp;
