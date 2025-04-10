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

    const copyLink = (e, fileId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileId}`
        );
        alert("Link copied to clipboard");
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
                        <button
                            href={file.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#1E0B33",
                                textDecoration: "underline",
                                marginTop: "1rem",
                                display: "inline-block",
                                borderRadius: "6px",
                            }}
                        >
                            Download File
                        </button>
                    </div>
                );
        }
    };

    return (
        <div
            style={{
                backgroundColor: "rgb(236, 202, 255)",
                borderRadius: "12px",
                width: "100%",
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
                    margin: "auto",
                }}
            >
                <div style={{ padding: "16px" }}>{renderContent()}</div>
            </div>
        </div>
    );
};

export default FileContent;
