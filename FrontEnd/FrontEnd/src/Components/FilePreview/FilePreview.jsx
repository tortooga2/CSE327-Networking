import { useEffect, useRef, useState } from "react";
import { useStore } from "../Contexts/ctx.appManager.jsx";
import PropTypes from "prop-types";

import "./FilePreview.css";  

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

    const { user } = useUser();

    const closePreview = () => {
        useStore.getState().setPreviewedFile(null);
    };

    useEffect(() => {
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
                    setFileData(data.files.originalFile);
                    if (data.files.files) {
                        setFileContent(data.files.files);
                    } else {
                        setFileContent([data.files.originalFile]);
                    }
                } else {
                    user.ValidateSession();
                }
            } catch (error) {
                user.ValidateSession();
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

    // Add function to handle background click
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            closePreview();
        }
    };

    return (
        <>
            {/* Desktop view */}
            <VerticalDiv width={width} className="desktop-preview">
                <div
                    className="preview-header"
                    style={{
                        borderBottom: "1px solid var(--special-color)",
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
                                color: "var(--special-color)",
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
                    {fileContent
                        ? fileContent.map((file, index) => (
                              <FileContent key={index} file={file} />
                          ))
                        : null}
                </VerticalDiv>
            </VerticalDiv>

            {/* Mobile modal view */}
            {closedFile && (
                <div className="file-preview-modal" onClick={handleBackgroundClick}>
                    <div className="modal-content">
                        <div
                            className="preview-header"
                            style={{
                                borderBottom: "1px solid var(--special-color)",
                                paddingBottom: "1rem",
                                padding: "1rem",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                            }}
                        ><div
                                style={{
                                    display: "flex",
                                    gap: "1rem",
                                    flexDirection: "column",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "1.5rem",
                                        color: "var(--special-color)",
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

                        <VerticalDiv gap="1rem" style={{ padding: "1rem" }}>
                            {fileContent
                                ? fileContent.map((file, index) => (
                                      <FileContent key={index} file={file} />
                                  ))
                                : null}
                        </VerticalDiv>
                    </div>
                </div>
            )}
        </>
    );
};

FileContent.propTypes = {
    file: PropTypes.object.isRequired,
};

export default FilePreview;