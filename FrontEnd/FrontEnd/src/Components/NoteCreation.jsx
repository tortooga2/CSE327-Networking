import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "./Contexts/ctx.appManager";
import MDEditor, { commands } from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import Markdown from "@uiw/react-md-editor";
import SimpleMDE from "react-simplemde-editor";
import "simplemde/dist/simplemde.min.css";
import { FaHeading, FaListUl, FaListOl } from "react-icons/fa";
import Button from "./Button/Button";

import "./NoteCreation.css";

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

    // const visibleCommandsConfig = [
    //     // { name: 'bold', command: commands.bold, icon: <FaBold />, title: 'Bold'},
    //     // { name: 'italic', command: commands.italic, icon: <FaItalic />, title: 'Italic' },
    //     // { name: 'strikethrough', command: commands.strikethrough, icon: <FaStrikethrough />, title: 'Strikethrough' },
    //     {
    //         name: "h1",
    //         command: commands.h1,
    //         icon: <FaHeading />,
    //         title: "Heading 1",
    //     },
    //     {
    //         name: "ulist",
    //         command: commands.ulist,
    //         icon: <FaListUl />,
    //         title: "Unordered List",
    //     },
    //     {
    //         name: "olist",
    //         command: commands.olist,
    //         icon: <FaListOl />,
    //         title: "Ordered List",
    //     },
    //     { command: commands.hr },
    //     { command: commands.link },
    //     // { command: commands.quote },
    //     { command: commands.table },
    //     { command: commands.undo },
    //     { command: commands.redo },
    //     { command: commands.fullscreen },
    //     { command: commands.help },
    //     // Removed commands.preview here
    // ];
    
    const onChange = useCallback((value) => {
        setNoteText(value);
    }, []);

    eturn (
        <div>
            {saveStatus === "saving" && <div>Saving note...</div>}
            {saveStatus === "saved" && <div>Note saved!</div>}
            {saveStatus === "error" && <div>Failed to save note.</div>}

            {/* <MDEditor
                preview="edit"
                value={noteText}
                onChange={handleNoteChange}
                commandsFilter={(cmd) => {
                    return cmd &&
                        /(strikethrough|quote|link|divider|image|checked-list|help|edit|live|preview|comment)/.test(
                            cmd.name
                        )
                        ? false
                        : cmd;
                }}
            /> */}
            <SimpleMDE value={noteText} onChange={onChange} />

            <Button
                onClick={handleSaveNote}
                style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    color: "var(--note-color-2)",
                    // backgroundColor: "#007bff",
                    // color: "white",
                    // border: "none",
                    // cursor: "pointer",
                    // alignSelf: "flex-end", // Align button to the right (optional)
                }}
            >
                <FaSave /> Save Note
            </Button>
        </div>
    );
};

export default NoteCreation;