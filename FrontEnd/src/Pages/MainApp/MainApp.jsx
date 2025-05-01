import { useState, useRef, useEffect } from "react";

import "./MainApp.css";

import FileViewer from "../../Components/Fileviewer/Fileviewer.jsx";

import { useUser } from "../../Components/Contexts/ctx.user.jsx";
import { useStore } from "../../Components/Contexts/ctx.appManager.jsx";

import Sidebar from "../../Components/Sidebar.jsx";

import FilePreview from "../../Components/FilePreview/FilePreview.jsx";
import NewPage from "../../Components/UILayout/NewPage.jsx";
import HorizontalDiv from "../../Components/UILayout/HorizontalDiv.jsx";
import VerticalDiv from "../../Components/UILayout/VerticalDiv.jsx";
import Header from "../../Components/header.jsx";
import Dock from "../../Components/Dock/Dock.jsx";
import { FaHome, FaFile, FaSearch, FaCog } from "react-icons/fa";

const MainApp = () => {
    const { user } = useUser();
    const closedFile = useStore((state) => state.previewedFile !== null);
    const layoutState = useStore((state) => state.layoutState);
    const [currentView, setCurrentView] = useState('files');

    const dockItems = [
        {
            icon: <FaHome size={24} />,
            label: 'Home',
            onClick: () => setCurrentView('home')
        },
        {
            icon: <FaFile size={24} />,
            label: 'Files',
            onClick: () => setCurrentView('files')
        },
        {
            icon: <FaSearch size={24} />,
            label: 'Search',
            onClick: () => setCurrentView('search')
        },
        {
            icon: <FaCog size={24} />,
            label: 'Settings',
            onClick: () => setCurrentView('settings')
        }
    ];

    useEffect(() => {
        user.ValidateSession();
    }, [user]);

    return (
        <NewPage>
            <VerticalDiv
                padding="1rem"
                style={{
                    position: "relative",
                    backgroundColor: "var(--secondary-color)",
                }}
            >
                <HorizontalDiv>
                    <VerticalDiv
                        width="42.5%"
                        style={{ backgroundColor: "white" }}
                        className="mobile-hide"
                    >
                        <h1>This is a placeholder</h1>
                    </VerticalDiv>
                    <HorizontalDiv width="100%"></HorizontalDiv>
                    {}
                    {closedFile && <FilePreview width="93%" />}
                </HorizontalDiv>
                <HorizontalDiv
                    width="60%"
                    padding="1rem"
                    className="main-content"
                    style={{
                        position: "absolute",
                        borderRadius: "var(--border-radius)",
                        border: "1px solid var(--border-color)",
                        padding: "1rem",
                        background:
                            "linear-gradient(var(--primary-color), var(--grad-color))",
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
                    <div className="sidebar-wrapper">
                        <VerticalDiv width="350px" padding="0rem" className="sidebar">
                            <Header />
                            <Sidebar />
                            <VerticalDiv height="100%"></VerticalDiv>
                        </VerticalDiv>
                    </div>
                    <HorizontalDiv
                        padding="0rem"
                        gap="0rem"
                        style={{ alignItems: "flex-start" }}
                    >
                        <FileViewer width="100%" />
                    </HorizontalDiv>
                </HorizontalDiv>
                <Dock items={dockItems} />
            </VerticalDiv>
        </NewPage>
    );
};

export default MainApp;
