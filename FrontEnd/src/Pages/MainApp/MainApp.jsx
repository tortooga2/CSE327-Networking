import { useState, useRef, useEffect } from "react";
import { FaUpload, FaLink, FaPlus, FaCog } from "react-icons/fa";
import "./MainApp.css";

import FileViewer from "../../Components/Fileviewer/Fileviewer.jsx";

import Dashboard from "../../Components/Dashboard.jsx";
import Sidebar from "../../Components/Sidebar.jsx";

import { useUser } from "../../Components/Contexts/ctx.user.jsx";
import { useStore } from "../../Components/Contexts/ctx.appManager.jsx";

import DebugSidebar from "../../Components/debugSideBar.jsx";

import FilePreview from "../../Components/FilePreview/FilePreview.jsx";
import NewPage from "../../Components/UILayout/NewPage.jsx";
import HorizontalDiv from "../../Components/UILayout/HorizontalDiv.jsx";
import VerticalDiv from "../../Components/UILayout/VerticalDiv.jsx";
import Header from "../../Components/Header.jsx";

const MobileDock = () => {
  return (
    <div className="mobile-dock">
      <button className="mobile-dock-button">
        <FaUpload className="mobile-dock-icon" />
        <span>Upload</span>
      </button>
      <button className="mobile-dock-button">
        <FaLink className="mobile-dock-icon" />
        <span>Connect</span>
      </button>
      <button className="mobile-dock-button">
        <FaPlus className="mobile-dock-icon" />
        <span>Create</span>
      </button>
      <button className="mobile-dock-button">
        <FaCog className="mobile-dock-icon" />
        <span>Settings</span>
      </button>
    </div>
  );
};

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
            <VerticalDiv padding="0.5rem" style={{ position: "relative", backgroundColor: "var(--secondary-color)" }}>
                <HorizontalDiv>
                    <VerticalDiv
                        width="42.5%"
                        style={{ backgroundColor: "white" }}
                        className="desktop-sidebar"
                    >
                        <h1>This is a placeholder</h1>
                    </VerticalDiv>
                    <HorizontalDiv width="100%" className="mobile-fileviewer">
                        <FileViewer width="100%" />
                    </HorizontalDiv>
                    <FilePreview width="93%" />
                </HorizontalDiv>
                
                {/* Desktop sidebar */}
                <HorizontalDiv
                    width="60%"
                    padding="0rem"
                    className="desktop-sidebar"
                    style={{
                        position: "absolute",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        background: "linear-gradient(var(--special-color), var(--grad-color))",
                        transition: "all 0.3s cubic-bezier(.47,1.64,.41,.8)",
                    }}
                    state={[
                        {
                            width: "100%",
                            left: "0",
                        },
                        {
                            width: "60%",
                            left: "0",
                        },
                        {
                            width: "80%",
                            left: "20%",
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

                {/* Mobile dock */}
                <MobileDock />
            </VerticalDiv>
        </NewPage>
    );
};

export default MainApp;

