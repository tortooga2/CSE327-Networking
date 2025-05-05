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

const MainApp = () => {
    const { user } = useUser();

    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });

    const layoutState = useStore((state) => state.layoutState);

    useEffect(() => {
        user.ValidateSession();
    }, [user]);

    const userSettings = useStore((state) => state.userSettings);

    useEffect(() => {
        const root = document.getElementById("root");
        for (let setting in userSettings) {
            switch (setting) {
                case "dark_mode":
                    root.style.setProperty(
                        "--dark-mode",
                        userSettings[setting]
                    );
                    break;

                case "bundle_color":
                    root.style.setProperty(
                        "--bundle-color-2",
                        userSettings[setting]
                    );
                    break;

                case "doc_color":
                    root.style.setProperty(
                        "--document-color-2",
                        userSettings[setting]
                    );
                    break;

                case "note_color":
                    root.style.setProperty(
                        "--note-color-2",
                        userSettings[setting]
                    );
                    break;

                case "rec_color":
                    root.style.setProperty(
                        "--video-color-2",
                        userSettings[setting]
                    );
                    break;

                case "img_color":
                    root.style.setProperty(
                        "--img-color-2",
                        userSettings[setting]
                    );
                    break;

                case "font_size":
                    root.style.setProperty(
                        "--font-size",
                        userSettings[setting]
                    );
                    break;

                case "font_family":
                    root.style.setProperty(
                        "--font-family",
                        userSettings[setting]
                    );
                    break;

                default:
                    console.warn(`Unknown setting “${setting}”`);
            }
        }
    }, [userSettings]);

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
                    >
                        <h1>This is a placeholder</h1>
                    </VerticalDiv>
                    <HorizontalDiv width="100%"></HorizontalDiv>
                    <FilePreview width="93%" />
                </HorizontalDiv>
                <HorizontalDiv
                    width="60%"
                    padding="1rem"
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
                        <Sidebar />
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
