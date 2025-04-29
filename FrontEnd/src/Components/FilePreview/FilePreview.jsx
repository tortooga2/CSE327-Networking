import { useEffect, useRef, useState } from "react";
import { useStore } from "../Contexts/ctx.appManager.jsx";
import PropTypes from "prop-types";

import getFileType from "../scripts/getFileType.js";
import { FileType } from "../Tags";
import Button from "../Button/Button.jsx";

import FileContent from "../fileContent/FileContent.jsx";

import VerticalDiv from "../UILayout/VerticalDiv";

const FilePreview = ({ width }) => {
    const fileId = useStore((state) => state.previewedFile);
    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });
    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const scrollableRef = useRef(null);

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
        if (!fileId) {
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

    const [isBundle, setIsBundle] = useState(false);

    useEffect(() => {
        if (fileData) {
            setIsBundle(getFileType(fileData.name) === "Bundle");
        }
    }, [fileData]);

    return (
        <VerticalDiv width={width}>
            <div
                className="preview-header"
                style={{
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: "1rem",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            fontSize: "2rem",
                            color: "var(--text-color)",
                            fontWeight: "400",
                        }}
                    >
                        {"File Preview"}
                    </div>
                    {isBundle && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: " 0.5rem",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    alignItems: "center",
                                }}
                            >
                                {fileData ? FileType(fileData.name) : ""}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    alignItems: "center",
                                }}
                            >
                                <p>Name:</p> {fileData ? fileData.name : ""}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    alignItems: "center",
                                }}
                            >
                                <p>Create At:</p>
                                {fileData
                                    ? (() => {
                                          return new Date(
                                              fileData.createdAt
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                          });
                                      })()
                                    : ""}
                            </div>
                            <p>
                                Creator:{" "}
                                {fileData ? fileData.creator_username : ""}
                            </p>
                        </div>
                    )}
                </div>

                <Button onClick={closePreview}>Close</Button>
            </div>

            <VerticalDiv gap="1rem">
                {fileContent && closedFile
                    ? fileContent.map((file, index) => (
                          <FileContent key={index} file={file} />
                      ))
                    : null}
            </VerticalDiv>
        </VerticalDiv>
    );
};

FileContent.propTypes = {
    file: PropTypes.object.isRequired,
};

export default FilePreview;
