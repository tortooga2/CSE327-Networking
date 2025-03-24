import { useState, useEffect, useRef } from "react";

import File from "./File";

const FileViewer = () => {
    const [files, setFiles] = useState(null);

    const fileInputRef = useRef(null);

    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            {files ? (
                files.map((file, index) => <File key={index} fileData={file} />)
            ) : (
                <div>No files found</div>
            )}
        </div>
    );
};

export default FileViewer;
