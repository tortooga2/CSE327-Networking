import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import File from "./File";

const FileViewer = () => {
    const [files, setFiles] = useState(null);

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("FileViewer mounted");
        (async () => {
            try {
                const files = await fetch(
                    "http://localhost:3000/api/file/all",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );
                if (!files) {
                    console.log("No files found");
                    return;
                }

                const data = await files.json();

                if (data.error) {
                    console.error(data.error);
                    navigate("/");
                    return;
                }

                if (Array.isArray(data.data)) {
                    setFiles(data.data);
                    console.log("Files found:", data.data);
                }
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        })();

        return () => {
            console.log("FileViewer unmounted");
        };
    }, []);

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
