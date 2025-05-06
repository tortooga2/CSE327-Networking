import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useStore } from "./Contexts/ctx.appManager";
import VerticalDiv from "./UILayout/VerticalDiv";
import Button from "./Button/Button";
import NoteCreation from "./NoteCreation";
import { Note } from "./Tags";
import {
    FaDownload,
    FaTrash,
    FaEdit,
    FaTimes,
    FaStickyNote,
    FaFile,
} from "react-icons/fa";

const Menu = () => {
    const layoutState = useStore((state) => state.layoutState);

    const isSettings = useStore((state) => {
        return state.layoutState === 3;
    });
    const isFileMenu = useStore((state) => {
        return state.layoutState === 4;
    });
    const isNotes = useStore((state) => {
        return state.layoutState === 2;
    });

    const deleteFiles = useStore((state) => state.deleteFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);
    const selectedFiles = useStore((state) => state.selectedFiles);

    const [menu, setMenu] = useState("notes");

    useEffect(() => {
        if (useStore.getState().layoutState === 0) {
            return;
        }

        if (isFileMenu) {
            setMenu("file");
        }
        if (isSettings) {
            setMenu("settings");
        }
        if (isNotes) {
            setMenu("notes");
        }
    }, [isFileMenu, isSettings, isNotes]);

    const handleClose = () => {
        useStore.getState().setLayoutState(0);
    };

    return (
        <VerticalDiv>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    ...(isFileMenu || isSettings
                        ? { width: "45%" }
                        : { width: "100%" }),
                }}
            >
                <div
                    style={{
                        fontSize: "x-large",
                    }}
                >
                    {menu === "settings" ? "Settings" : ""}
                    {menu === "file" ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                            }}
                        >
                            <FaFile />
                            File
                        </div>
                    ) : (
                        ""
                    )}
                    {menu === "notes" ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                color: "var(--note-color-2)",
                            }}
                        >
                            <FaStickyNote />
                            New Note
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <Button onClick={handleClose}>Close</Button>
            </div>
            {(() => {
                switch (menu) {
                    case "notes":
                        return <NoteCreation />;
                    case "settings":
                        return <div>Work in Progress...</div>;
                    case "file":
                        return (
                            <div>
                                <Button style={{ color: "var(--img-color-2)" }}>
                                    {" "}
                                    <FaDownload /> Download File(s)
                                </Button>
                                <Button
                                    style={{
                                        color: "#ff9999",
                                        backgroundColor: "#ff9999",
                                    }}
                                    onClick={deleteFiles}
                                >
                                    <FaTrash /> Delete File(s) (
                                    {selectedFiles.size})
                                </Button>
                                <Button>
                                    <FaEdit /> Edit File Name
                                </Button>
                            </div>
                        );
                }
            })()}
        </VerticalDiv>
    );
};

export default Menu;
