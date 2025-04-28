// import { useState, useEffect, useCallback } from "react";
// import { useStore } from "./Contexts/ctx.appManager";
// import MDEditor from "@uiw/react-md-editor";

// const NoteCreation = ({ fileId }) => {
//     // Expect fileId as a prop
//     const uploadFilesAction = useStore((state) => state.uploadFiles);
//     const [noteText, setNoteText] = useState("");
//     const [saveStatus, setSaveStatus] = useState(null);

//     const getFileData = useCallback(async () => {
//         if (!fileId) {
//             setNoteText("");
//             return;
//         }
//         try {
//             // remove the fetch api, where you want to store the Notetext object within the textfile and push the textfile into array, call the upload file into an array
//             const response = await fetch(`/api/file/focus/${fileId}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 credentials: "include",
//             });
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Fetched note data:", data);
//                 if (data && data.note) {
//                     setNoteText(data.note);
//                 } else {
//                     setNoteText("");
//                 }
//             } else {
//                 console.error(
//                     "Failed to fetch note data:",
//                     response.statusText
//                 );
//                 setNoteText("");
//             }
//         } catch (error) {
//             console.error("Error fetching note data:", error);
//             setNoteText("");
//         }
//     }, [fileId, setNoteText]);

//     useEffect(() => {
//         getFileData();
//     }, [getFileData]); // Fetch data whenever getFileData changes (i.e., when fileId changes)

//     const handleNoteChange = (value) => {
//         setNoteText(value);
//         setSaveStatus(null);
//     };

//     const handleSaveNote = async () => {
//         setSaveStatus("saving");
//         const notefile = new File([noteText], "note.md", {
//             type: "text/markdown",
//         });

//         // able to see how the notefile is sent to the array
//         const textFileArr = [notefile];

//         try {
//             await uploadFilesAction(textFileArr); // array is referred by uploadFiles
//             setSaveStatus("saved");
//             console.log("Note is successfully uploaded.");
//             setTimeout(() => setSaveStatus(null), 3000);
//         } catch (err) {
//             console.log("Not being able to save note:", err);
//             setSaveStatus("error");
//             setTimeout(() => setSaveStatus(null), 5000);
//         }
//     };

//     return (
//         <div>
//             {saveStatus === "saving" && <div>Saving note...</div>}
//             {saveStatus === "saved" && <div>Note saved!</div>}
//             {saveStatus === "error" && <div>Failed to save note.</div>}
//             <MDEditor
//                 value={noteText}
//                 onChange={handleNoteChange}
//                 style={{ height: "300px" }}
//             />
//             <button
//                 onClick={handleSaveNote}
//                 style={{
//                     padding: "0.5rem 1rem",
//                     borderRadius: "4px",
//                     backgroundColor: "#4CAF50",
//                     color: "black",
//                     border: "none",
//                     cursor: "pointer",
//                 }}
//             >
//                 Save Note
//             </button>
//             {/* <div style={{ marginTop: '1rem' }}> */}
//             {/* {noteText} Simple preview */}
//             {/* </div> */}
//         </div>
//     );
// };

// export default NoteCreation;

import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "./Contexts/ctx.appManager";
import MDEditor, { commands } from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import Markdown from "@uiw/react-md-editor";
import SimpleMDE from "react-simplemde-editor";
import "simplemde/dist/simplemde.min.css";
import { FaHeading, FaListUl, FaListOl } from "react-icons/fa";

const NoteCreation = ({ fileId }) => {
    const uploadFilesAction = useStore((state) => state.uploadFiles);
    const [noteText, setNoteText] = useState("");
    const [saveStatus, setSaveStatus] = useState(null);

    const getFileData = useCallback(async () => {
        if (fileId && !fileId.startsWith("new-")) {
            try {
                const response = await fetch(`/api/file/focus/${fileId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.note) {
                        setNoteText(data.note);
                    } else {
                        setNoteText("");
                    }
                } else {
                    console.error(
                        "Failed to fetch note data:",
                        response.statusText
                    );
                    setNoteText("");
                }
            } catch (error) {
                console.error("Error fetching note data:", error);
                setNoteText("");
            }
        } else {
            setNoteText("");
        }
    }, [fileId, setNoteText]);

    useEffect(() => {
        getFileData();
    }, [getFileData]);

    const handleNoteChange = (value) => {
        setNoteText(value);
        setSaveStatus(null);
    };

    const handleSaveNote = async () => {
        setSaveStatus("saving");
        const notefile = new File([noteText], "note.md", {
            type: "text/markdown",
        });

        const textFileArr = [notefile];

        try {
            await uploadFilesAction(textFileArr);
            setSaveStatus("saved");
            console.log("Note is successfully uploaded.");
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err) {
            console.log("Not being able to save note:", err);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus(null), 5000);
        }
    };

    const visibleCommandsConfig = [
        // { name: 'bold', command: commands.bold, icon: <FaBold />, title: 'Bold'},
        // { name: 'italic', command: commands.italic, icon: <FaItalic />, title: 'Italic' },
        // { name: 'strikethrough', command: commands.strikethrough, icon: <FaStrikethrough />, title: 'Strikethrough' },
        {
            name: "h1",
            command: commands.h1,
            icon: <FaHeading />,
            title: "Heading 1",
        },
        {
            name: "ulist",
            command: commands.ulist,
            icon: <FaListUl />,
            title: "Unordered List",
        },
        {
            name: "olist",
            command: commands.olist,
            icon: <FaListOl />,
            title: "Ordered List",
        },
        { command: commands.hr },
        { command: commands.link },
        // { command: commands.quote },
        { command: commands.table },
        { command: commands.undo },
        { command: commands.redo },
        { command: commands.fullscreen },
        { command: commands.help },
        // Removed commands.preview here
    ];

    return (
        <div
            style={{
                marginBottom: "1rem",
                border: "1px solid #eee",
                padding: "10px",
                borderRadius: "4px",
            }}
        >
            {saveStatus === "saving" && <div>Saving note...</div>}
            {saveStatus === "saved" && <div>Note saved!</div>}
            {saveStatus === "error" && <div>Failed to save note.</div>}
            <SimpleMDE
                value={noteText}
                onChange={handleNoteChange}
                options={{
                    autofocus: true,
                    spellChecker: false,
                    height: "50px",
                    width: "50%",
                }}
                live={false} // Disable live preview
                // commands={visibleCommandsConfig.map(config => {
                //   if (config.icon && config.command) {
                //     return {
                //       ...config.command,
                //       icon: () => config.icon,
                //       title: config.title,
                //     };
                //   }
                //   if (config.command) {
                //     return config.command;
                //   }
                //   return null;
                // })}
                style={{ height: "450px" }}
            />
            <div style={{ marginTop: "1rem" }}>
                {" "}
                {/* Container for the button */}
                <button
                    onClick={handleSaveNote}
                    style={{
                        padding: "10px 15px",
                        borderRadius: "5px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        alignSelf: "flex-end", // Align button to the right (optional)
                    }}
                >
                    Save Note
                </button>
            </div>
            {/* <div style={{ marginTop: '1rem' }}>
        <h2>/Preview</h2>
        <ReactMarkdown>{noteText}</ReactMarkdown>
      </div> */}
        </div>
    );
};

export default NoteCreation;
