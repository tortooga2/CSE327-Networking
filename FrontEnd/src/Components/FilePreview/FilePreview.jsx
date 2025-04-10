import { useEffect, useState } from "react";
import { useStore } from "../Contexts/zus.fileManager";
import PropTypes from "prop-types";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileContent = ({ file }) => {
    const getFileType = (mimeType, filename) => {
        const ext = filename.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
        if (["mp4", "webm", "ogg"].includes(ext)) return "video";
        if (ext === "pdf") return "pdf";
        if (["doc", "docx"].includes(ext)) return "word";
        if (["xls", "xlsx"].includes(ext)) return "excel";
        if (["txt", "text", "md"].includes(ext)) return "plain";
        return ext;
    };

    const renderContent = () => {
        const fileType = getFileType(file.type, file.name);

        switch (fileType) {
            case "image":
                return (
                    <img
                        src={file.metadata.url}
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                            display: "block",
                        }}
                        alt={file.name}
                    />
                );
            case "video":
                return (
                    <video
                        controls
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            backgroundColor: "black",
                        }}
                    >
                        <source src={file.metadata.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                );
            case "pdf":
            case "word":
            case "excel":
                return (
                    <DocViewer
                        documents={[
                            {
                                uri: file.metadata.url,
                                fileType: fileType,
                                fileName: file.name,
                            },
                        ]}
                        pluginRenderers={DocViewerRenderers}
                        style={{
                            width: "100%",
                            height: "800px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                        }}
                        config={{
                            header: {
                                disableHeader: true,
                                disableFileName: true,
                            },
                        }}
                    />
                );
            case "plain":
            case "txt":
            case "md":
                return (
                    <iframe
                        src={file.metadata.url}
                        style={{
                            width: "100%",
                            height: "400px",
                            border: "1px solid #E0E0E0",
                            borderRadius: "8px",
                            backgroundColor: "white",
                        }}
                        title={file.name}
                    />
                );
            default:
                return (
                    <div
                        style={{
                            padding: "2rem",
                            textAlign: "center",
                            backgroundColor: "white",
                            borderRadius: "8px",
                        }}
                    >
                        <p>Preview not available for .{fileType} files</p>
                        <a
                            href={file.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#1E0B33",
                                textDecoration: "underline",
                                marginTop: "1rem",
                                display: "inline-block",
                            }}
                        >
                            Download File
                        </a>
                    </div>
                );
        }
    };

    return <div style={{ padding: "16px" }}>{renderContent()}</div>;
};

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
            });
        } else {
            setStyle({
                width: "100%",
                backgroundColor: "#FFFFFF",
                height: "100vh",
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
                    padding: "24px",
                    borderBottom: "1px solid #E0E0E0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    overflowY: "auto",
                }}
            >
                {fileContent
                    ? fileContent.map((file, index) => (
                          <div
                              key={index}
                              style={{
                                  backgroundColor: "#F8F6FD",
                                  borderRadius: "12px",
                                  overflow: "hidden",
                              }}
                          >
                              <div
                                  style={{
                                      padding: "16px",
                                      width: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                      alignItems: "left",
                                      borderBottom: "1px solid #E0E0E0",
                                      gap: "8px",
                                  }}
                              >
                                  <p
                                      style={{
                                          fontSize: "16px",
                                          fontWeight: "500",
                                      }}
                                  >
                                      {file.name}
                                  </p>
                                  <div
                                      style={{
                                          display: "flex",
                                          flexDirection: "row",
                                          width: "100%",
                                          justifyContent: "space-between",
                                          alignItems: "flex-start",
                                      }}
                                  >
                                      <p
                                          style={{
                                              fontSize: "14px",
                                              color: "#666",
                                          }}
                                      >
                                          Created by {file.creator_username}
                                      </p>

                                      <button
                                          onClick={(e) => copyLink(e, file.id)}
                                          style={{
                                              padding: "8px 16px",
                                              border: "1px solid #1E0B33",
                                              borderRadius: "6px",
                                              backgroundColor: "transparent",
                                              color: "#1E0B33",
                                              cursor: "pointer",
                                          }}
                                      >
                                          Copy Link
                                      </button>
                                  </div>
                              </div>
                              <div
                                  style={{
                                      padding: "16px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                  }}
                              >
                                  <FileContent file={file} />
                              </div>
                          </div>
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
