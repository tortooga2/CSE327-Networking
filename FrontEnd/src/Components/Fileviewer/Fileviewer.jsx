import { useState, useEffect, useRef } from "react";

import "./FileViewer.css";

import File from "./File";
import { useStore } from "../Contexts/zus.fileManager";

const FileViewer = () => {
    const files = useStore.getState().getFiles();

    useEffect(() => {
        useStore.getState().loadFiles();
    }, []);

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <h1>File Viewer</h1>
            <table className="file-viewer">
                <thead>
                    <tr>
                        <th className="id-column">ID</th>
                        <th className="date-column">Date</th>

                        <th className="type-column">Type</th>
                        <th className="owner-column">Owner</th>
                        <th>Name</th>
                        <th className="checkbox-column">Select</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        let array = Array.from(files);
                        console.log("Files in viewer", array);
                        return array.map((file) => {
                            return <File fileData={file} key={file.id} />;
                        });
                    })()}
                </tbody>
            </table>
        </div>
    );
};

export default FileViewer;
