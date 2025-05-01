import { useState } from "react";
import UnselectAllButton from "./UnselectAllButton";
import ConnectFilesButton from "./ConnectFilesButton";
import UploadFilesButton from "./UploadFilesButton";
import DeleteFilesButton from "./DeleteFilesButton";
import NoteCreation from "../NoteCreation";
import { FaStickyNote } from "react-icons/fa";

const dockButtonStyle = {
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    minWidth: "3.5rem",
    justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    transition: "background 0.2s, color 0.2s",
};

const MobileDockActions = () => {
    const [showNoteModal, setShowNoteModal] = useState(false);
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100vw",
                    padding: "0.75rem 0.5rem 1.25rem 0.5rem",
                    background: "#23263a",
                    borderTop: "1.5px solid #393c54",
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    zIndex: 1000,
                    boxShadow: "0 -2px 12px rgba(0,0,0,0.12)",
                }}
            >
                <button style={{ ...dockButtonStyle, background: "#1E0B33", color: "#fff" }}>
                    <UnselectAllButton minimal />
                </button>
                <button style={{ ...dockButtonStyle, background: "#C8B0FF", color: "#1E0B33" }}>
                    <ConnectFilesButton minimal />
                </button>
                <button style={{ ...dockButtonStyle, background: "#F7FAFC", color: "#1E0B33" }}>
                    <UploadFilesButton minimal />
                </button>
                <button style={{ ...dockButtonStyle, background: "#FFB0B0", color: "#1E0B33" }}>
                    <DeleteFilesButton minimal />
                </button>
                <button
                    onClick={() => setShowNoteModal(true)}
                    style={{ ...dockButtonStyle, background: "#FFD966", color: "#1E0B33" }}
                >
                    <FaStickyNote />
                </button>
            </div>
            {showNoteModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2000,
                    }}
                    onClick={() => setShowNoteModal(false)}
                >
                    <div
                        style={{
                            background: "#23263a",
                            borderRadius: "1rem",
                            padding: "2rem 1.5rem",
                            minWidth: "80vw",
                            maxWidth: "95vw",
                            boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <NoteCreation />
                        <button
                            onClick={() => setShowNoteModal(false)}
                            style={{
                                marginTop: "1rem",
                                padding: "0.5rem 1rem",
                                background: "#1E0B33",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                width: "100%",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileDockActions;