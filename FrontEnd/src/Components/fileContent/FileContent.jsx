import React, { useState } from "react";
import ImageView from "./imageView";
import DocView from "./docView";
const FileContent = ({ file }) => {
    const copyLink = (e, fileId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileId}`
        );
        alert("Link copied to clipboard");
    };

    const fileTypeImage = (type) => {
        const imageTypes = ["jpeg", "png", "gif", "webp", "svg+xml"];
        return imageTypes.includes(type);
    };

    const [loaded, setLoaded] = useState(true);

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
                            borderRadius: "1rem",
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
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflowX: "hidden",
                }}
            >
                {!fileTypeImage(file.type) ? (
                    <DocView src={file.metadata.url} />
                ) : (
                    <ImageView src={file.metadata.url} name={file.name} />
                )}
            </div>
        </div>
    );
};

export default FileContent;
