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

    return (
        <div
            style={{
                backgroundColor: "rgb(236, 202, 255)",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                maxHeight: "100%",
                padding: "1rem",
                gap: "1rem",
            }}
        >
            <div>
                <p>{file.name}</p>
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
                            padding: "0.5rem",
                            border: "1px solid #1E0B33",
                            borderRadius: "0.5rem",
                            backgroundColor: "transparent",
                            color: "#1E0B33",
                            cursor: "pointer",
                        }}
                    >
                        Copy Link
                    </button>
                </div>
            </div>

            {!fileTypeImage(file.type) ? (
                <DocView src={file.metadata.url} />
            ) : (
                <ImageView src={file.metadata.url} name={file.name} />
            )}
        </div>
    );
};

export default FileContent;
