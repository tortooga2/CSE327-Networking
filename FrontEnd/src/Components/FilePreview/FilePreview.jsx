import { useEffect, useState } from "react";
import { useStore } from "../Contexts/zus.fileManager";
import PropTypes from "prop-types";

import FileContent from "../FileContent";

const FilePreview = () => {
    const fileId = useStore((state) => state.previewedFile);
    const closedFile = useStore((state) => {
        return state.previewedFile === null;
    });
    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    const [style, setStyle] = useState({
        width: 0,
        backgroundColor: "#FFFFFF",
        height: "100%",
        position: "relative",
        transition: "width 400ms ease-in",
        padding: "0",
        margin: "0",
    });

    const copyLink = (e, fileId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileId}`
        );
        alert("Link copied to clipboard");
    };

    const closePreview = () => {
        useStore.getState().setPreviewedFile(null);
    };

    useEffect(() => {
        if (closedFile) {
            setStyle({
                width: "0",
                overflow: "hidden",
                transition: "width 400ms ease-in",
                boxSizing: "border-box",
            });
        } else {
            setStyle({
                width: "100%",
                backgroundColor: "#FFFFFF",
                height: "100%",
                position: "relative",
                transition: "width 400ms cubic-bezier(.47,1.64,.41,.8)",
            });
        }
    }, [closedFile]);

    useEffect(() => {
        console.log(`File ID: ${fileId}`);

        console.log("Fetching file data @", `/api/file/user/${fileId}`);
        if (!fileId || fileId === null) {
            console.error("File ID is null");
            return;
        }
        const getFileData = async () => {
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
                    console.log(data);
                    setFileData(data.files.originalFile);
                    if (data.files.files) {
                        setFileContent(data.files.files);
                    } else {
                        setFileContent([data.files.originalFile]);
                    }
                } else {
                    setFileData({
                        error: response.statusText,
                    });
                }
            } catch (error) {
                console.error(error);
                setFileData({
                    error: error,
                });
            }
        };

        getFileData();
    }, [fileId]);

    return (
        <div style={style}>
            <div
                className="preview-header"
                style={{
                    borderBottom: "1px solid #E0E0E0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "1rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "24px",
                            color: "#1E0B33",
                            fontWeight: "900",
                        }}
                    >
                        {"File Preview"}
                    </div>
                    <span
                        style={{
                            padding: "4px 12px",
                            borderRadius: "16px",
                            backgroundColor: "#F8F6FD",
                            fontSize: "14px",
                        }}
                    >
                        {fileData?.type || ""}
                    </span>
                </div>
                <button
                    onClick={closePreview}
                    style={{
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "#1E0B33",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    Close
                </button>
            </div>

            <div
                className="preview-content"
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "1rem",

                    height: "100%",
                    scrollbarWidth: "none",
                    overflowY: "auto",
                }}
            >
                {fileContent
                    ? fileContent.map((file, index) => (
                          <FileContent file={file} key={index} />
                      ))
                    : null}
            </div>
        </div>
    );
};

FileContent.propTypes = {
    file: PropTypes.object.isRequired,
};

export default FilePreview;
