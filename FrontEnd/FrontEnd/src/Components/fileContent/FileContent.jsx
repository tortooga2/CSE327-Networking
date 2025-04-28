import React, { useState, useEffect } from "react";
import ImageView from "./imageView";
import DocView from "./docView";
import Button from "../Button/Button";
import getFileType from "../scripts/getFileType";
import { FileType } from "../Tags";

const FileContent = ({ file }) => {
    const copyLink = (fileId) => (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileId}`
        );
        alert("Link copied to clipboard");
    };

    return (
        <div
            style={{
                // background: "linear-gradient(var(--special-color), #ffffff)",
                borderRadius: "1rem",
                border: "1px solid var(--special-color)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "100%",
                padding: "1rem",
                gap: "1rem",
                backgroundColor: "var(--special-color)",
            }}
        >
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
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                        }}
                    >
                        {file ? FileType(file.name) : ""}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                        }}
                    >
                        <p>Name:</p> {file ? file.name : ""}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                        }}
                    >
                        <p>Create At:</p>
                        {file
                            ? (() => {
                                  return new Date(
                                      file.createdAt
                                  ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                  });
                              })()
                            : ""}
                    </div>
                    <p>Creator: {file ? file.creator_username : ""}</p>
                </div>

                <Button onClick={copyLink(file.id)}>Copy Link</Button>
            </div>

            {getFileType(file.name) !== "Image" ? (
                <DocView src={file.metadata.url} />
            ) : (
                <ImageView src={file.metadata.url} name={file.name} />
            )}
        </div>
    );
};

export default FileContent;
