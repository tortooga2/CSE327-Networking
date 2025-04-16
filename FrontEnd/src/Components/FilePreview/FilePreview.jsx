import { useEffect, useState } from "react";
import { useStore } from "../Contexts/zus.fileManager";
import PropTypes from "prop-types";

import FileContent from "../FileContent";

import VerticalDiv from "../UILayout/VerticalDiv";

const FilePreview = () => {
    const fileId = useStore((state) => state.previewedFile);
    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });
    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    const copyLink = (e, fileId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileId}`
        );
        alert("Link copied to clipboard");
    };

    const closePreview = () => {
        useStore.getState().setPreviewedFile(null);
        console.log("Preview is", closedFile);
    };

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
        <VerticalDiv
            before={{
                marginLeft: "0rem",
                width: "0%",
                borderWidth: "0rem",

                transition:
                    "width 0.3s ease-in-out 0.1s, border-width 0.1s ease-in-out 0.1s, margin-left 0.1s ease-in-out 0.1s",
            }}
            after={{
                marginLeft: "1rem",
                width: "75%",
                borderWidth: "0rem",

                transition:
                    "width 0.3s ease-in-out, border-width 0.2s ease-in-out 0.2s, margin-left 0.1s ease-in-out 0.2s",
            }}
            playAnimation={closedFile}
        >
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
                    scrollbarWidth: "thin",
                    scrollbarColor: "#1E0B33 #F8F6FD",
                    overflowY: "auto",
                    borderRadius: "1rem",
                }}
            >
                {fileContent
                    ? fileContent.map((file, index) => (
                          <FileContent file={file} key={index} />
                      ))
                    : null}
            </div>
        </VerticalDiv>
    );
};

FileContent.propTypes = {
    file: PropTypes.object.isRequired,
};

export default FilePreview;
