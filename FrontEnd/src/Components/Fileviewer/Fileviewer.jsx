import { useState, useEffect, useRef } from "react";

import File from "./File";
import { useFileManager } from "../Contexts/ctx.file_manager";

const FileViewer = () => {
    const { fileManager } = useFileManager();

    const [files, setFiles] = useState([]);

    const subscribedRef = useRef(false);

    const handleFileUpdate = async (newFiles) => {
        console.log("File update", newFiles);
        setFiles(newFiles);
    };

    useEffect(() => {
        if (fileManager.subscribe && !subscribedRef.current) {
            subscribedRef.current = true;
            console.log("Setting up subscription");
            const unsub = fileManager.subscribe(handleFileUpdate);

            // Initial load if needed
            if (fileManager.files && fileManager.files.length > 0) {
                handleFileUpdate(fileManager.files);
            }

            return () => {
                console.log("Cleaning up subscription");
                subscribedRef.current = false;
                unsub();
            };
        }
    }, []); // Empty dependency array

    useEffect(() => {
        if (
            fileManager.files &&
            fileManager.files.length > 0 &&
            files.length === 0
        ) {
            console.log("Files available but local state empty - updating");
            handleFileUpdate(fileManager.files);
        }
    }, [fileManager.files]);

    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            {files.length > 0 ? (
                files.map((file) => (
                    <File
                        key={
                            file._id ||
                            file.id ||
                            `${file.name}-${Date.parse(file.createdAt)}`
                        }
                        fileData={file}
                        onSelect={fileManager.addFile}
                    />
                ))
            ) : (
                <div>No files found</div>
            )}
        </div>
    );
};

export default FileViewer;
