import { useState, useEffect, useRef } from "react";

import "./FileViewer.css";

import File from "./File";
import { useStore } from "../Contexts/zus.fileManager";

const FileViewer = () => {
    const files = useStore((state) => {
        return state.files;
    });

    // const loading = useStore((state) => state.loading);

    useEffect(() => {
        const loadFiles = async () => {
            await useStore.getState().loadFiles();
        };
        loadFiles();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "fit-content",
                overflowY: "auto",
            }}
        >
            <h1>File Viewer</h1>
            <div className={"content-body"}>
                <div className={"file-table file-header file-item"}>
                    <div className={"id-column"}>ID</div>
                    <div className={"date-column"}>Date</div>
                    <div className={"type-column"}>Type</div>
                    <div className={"owner-column"}>Owner</div>
                    <div className={"name-column"}>Name</div>
                    <div className={"button-column"}></div>
                </div>
                <div className={"file-table file-list"}>
                    {useStore
                        .getState()
                        .getFiles()
                        .map((file) => {
                            return <File key={file.id} fileData={file} />;
                        })}
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
