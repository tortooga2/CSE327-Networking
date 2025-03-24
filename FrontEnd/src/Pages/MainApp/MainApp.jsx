import { useState, useRef, useEffect, use } from "react";

import "./MainApp.css";

import FileViewer from "../../Components/Fileviewer/Fileviewer.jsx";

import Dashboard from "../../Components/Dashboard.jsx";
import Sidebar from "../../Components/Sidebar.jsx";

const MainApp = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    const fileInputRef = useRef(null);

    const openDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFiles([...files, file]);
            setIsMenuOpen(false);
            console.log("Click here to upload file:", file);
        }
    };

    const handleNoteChange = (event) => {
        setNewNote(event.target.value);
    };

    const handleAddNote = () => {
        if (newNote.trim !== "") {
            setNotes([...notes, newNote]);
            setNewNote("");
        }
    };

    return (
        <>
            {/* <h2> Here is the place to upload your files!</h2>
            <input
                ref={fileInputRef}
                id="fileid"
                type="file"
                hidden
                onChange={handleFileChange}
            />

            <input
                id="buttonid"
                type="button"
                value="Upload MB"
                onClick={openDialog}
            />

            <div id="file-menu" onClick={handleMenuClick}>
                ☰
            </div>

            <div
                id="file-upload-container"
                style={{ display: isMenuOpen ? "block" : "none" }}
            >
                <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                />
            </div>

            <div id="notes-container">
                <h2> Here are the Notes and Files</h2>
                <textarea
                    id="new-note"
                    placeholder="Enter your note here"
                    value={newNote}
                    onChange={handleNoteChange}
                />
                <button onClick={handleAddNote}>Add Note</button> */}
            <Dashboard />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    position: "relative",
                    height: "calc(100vh - 3rem)",
                    width: "100%",
                }}
            >
                <div>
                    <Sidebar />
                </div>
                <div style={{ flex: 1, overflowY: "auto", height: "100%" }}>
                    <FileViewer />
                </div>
            </div>
            {/* </div> */}
        </>
    );
};

export default MainApp;
