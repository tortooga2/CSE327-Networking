import { useState, useEffect } from "react";
import "./FileViewer.css";
import File from "./File";
import { useStore } from "../Contexts/zus.fileManager";

const FileViewer = () => {
    const files = useStore((state) => {
        return state.files;
    });

    useEffect(() => {
        const loadFiles = async () => {
            await useStore.getState().loadFiles();
        };
        loadFiles();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100vh",
                backgroundColor: "#FFFFFF",
            }}
        >
            <div className="table-container" style={{
                padding: "24px",
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}>
                <div className="table-header" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px"
                }}>
                    <h1 style={{
                        color: "#1E0B33",
                        fontSize: "24px",
                        fontWeight: "600",
                        margin: 0
                    }}>
                        Files
                    </h1>
                    <div className="table-actions" style={{
                        display: "flex",
                        gap: "12px"
                    }}>
                        <input
                            type="text"
                            placeholder="Search files..."
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "1px solid #E2E8F0",
                                width: "240px"
                            }}
                        />
                        <select style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #E2E8F0",
                            backgroundColor: "white"
                        }}>
                            <option value="date">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                            <option value="type">Sort by Type</option>
                        </select>
                    </div>
                </div>

                <div className="table-wrapper" style={{
                    backgroundColor: "#F8F6FD",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                }}>
                    <div className="table-header-row" style={{
                        display: "grid",
                        gridTemplateColumns: "50px 180px 120px 150px 1fr 120px",
                        padding: "16px 24px",
                        backgroundColor: "#1E0B33",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "14px"
                    }}>
                        <div>ID</div>
                        <div>Date</div>
                        <div>Type</div>
                        <div>Owner</div>
                        <div>Name</div>
                        <div style={{ textAlign: "right" }}>Actions</div>
                    </div>

                    <div className="table-body" style={{
                        height: "calc(100% - 52px)",
                        overflowY: "auto"
                    }}>
                        {useStore.getState().getFiles().map((file) => (
                            <File key={file.id} fileData={file} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileViewer;