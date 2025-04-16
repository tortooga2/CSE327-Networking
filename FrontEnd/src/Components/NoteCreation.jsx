// NoteCreation.jsx
import React, { useState, useEffect } from "react";
import { useStore } from "./Contexts/zus.fileManager"; // Adjust the import path as necessary

const NoteCreation = ({ fileId }) => {
    const [noteText, setNoteText] = useState("");
    const updateFile = useStore((state) => state.updateFiles);
    const files = useStore((state) => state.files); // Access the files array

    useEffect(() => {
        // Load initial note from Zustand if it exists
        const file = files.find((f) => f.id === fileId);
        if (file && file.note) {
            setNoteText(file.note);
        }
    }, [fileId, files]); // Depend on 'files' to react to external updates

    const handleNoteChange = (event) => {
        setNoteText(event.target.value);
    };

    const handleSaveNote = () => {
        if (updateFile && fileId) {
            updateFile(fileId, { note: noteText });
            // The 'updateFile' action in Zustand should:
            // 1. Update the 'files' array in the store.
            // 2. Make an API call to your backend to persist the note.
            console.log(`Saving note "${noteText}" for file ID: ${fileId}`);
        } else {
            console.warn("updateFile action or fileId not available.");
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
                type="text"
                value={noteText}
                onChange={handleNoteChange}
                placeholder="Add note"
                style={{
                    flexGrow: 1,
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                }}
            />
            <button
                onClick={handleSaveNote}
                style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Save
            </button>
        </div>
    );
};

export default NoteCreation;

/* <div key={file.id} className="table-row" style={{
                                display: "grid",
                                gridTemplateColumns: "50px 180px 120px 150px 1fr 200px 120px",
                                padding: "16px 24px",
                                borderBottom: "1px solid #E2E8F0",
                                alignItems: "center"
                            }}>
                                <div>{file.id}</div>
                                <div>{new Date(file.createdAt).toLocaleDateString()}</div>
                                <div>{file.type}</div>
                                <div>{file.creator_username}</div>
                                <div>{file.name}</div>
                                <div>
                                    <textarea
                                        id={`note-${file.id}`}
                                        name={`note-${file.id}`}
                                        rows="3"
                                        cols="25"
                                        value={notes[file.id] || ''}
                                        onChange={(event) => handleNoteChange(file.id, event)}
                                        style={{ fontSize: "12px", width: "100%", height: "100%", boxSizing: "border-box" }}
                                    />
                                </div> */

// const NoteCreation = () => {
//     return (
//         <div>
//             <textarea></textarea>
//             <button>Save</button>
//         </div>
//     );
// };
