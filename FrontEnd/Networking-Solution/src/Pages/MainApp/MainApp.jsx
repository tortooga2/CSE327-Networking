import react, { useState, useRef } from "react";
import "./MainApp.css";

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
        <header>
            <h1>MainApp</h1>
            <p>This is where our main app will go!</p>
        </header>
            <h2> Here is the place to upload your files!</h2>
            <input
            ref = {fileInputRef}
            id="fileid"
            type="file"
            hidden
            onChange={handleFileChange}
            />

            <input id = "buttonid" type="button" value="Upload MB" onClick = {openDialog} />

            <div id="file-menu" onClick={handleMenuClick}>
                ☰
            </div>

            <div 
            id = "file-upload-container"
            style = {{ display: isMenuOpen ? "block" : "none" }}
            >
                <input type = "file" id = "file-upload" onChange = {handleFileChange} />
            </div>

            <div id = "notes-container">
                <h2> Here are the Notes and Files</h2>
                <textarea
                    id = "new-note"
                    placeholder = "Enter your note here"
                    value = {newNote}
                    onChange = {handleNoteChange}
                />
                <button onClick = {handleAddNote}>Add Note</button>

                <div>
                    {files.map((file, index) => (
                        <div key={index} className="file-item">
                            {`File: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`}
                            </div>
                    ))}
                </div>

                <div>
                    {notes.map((note, index) => (
                        <div key ={index} className = "note">
                            {note}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MainApp;
