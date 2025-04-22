import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import "./File.css";

import { useStore } from "../../Contexts/zus.fileManager";

const File = ({ fileData }) => {
    const fileContent = useState(fileData);

    const checkboxRef = useRef(null);

    const isSelected = useStore((state) =>
        state.selectedFiles.has(fileContent[0].id)
    );
    const setIsSelected = useStore((state) => state.selectFile);

    useEffect(() => {
        checkboxRef.current.checked = isSelected;
    }, [isSelected]);

    const handleChange = (e) => {
        e.stopPropagation();
        console.log("Checkbox changed:", e.target.checked);
        setIsSelected(fileContent[0].id, !isSelected);
    };

    const copyLink = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileContent[0].id}`
        );
        alert("Link copied to clipboard");
    };

    const getTypePillClass = (type) => {
        return {
            backgroundColor: "#1E0B33",
            color: "#FFFFFF",
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "500",
            display: "inline-block",
            transition: "opacity 0.2s",
        };
    };

    const getFileType = (mimeType, filename) => {
        const ext = filename.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
        if (["mp4", "webm", "ogg"].includes(ext)) return "video";
        if (ext === "pdf") return "pdf";
        if (["doc", "docx"].includes(ext)) return "word";
        if (["xls", "xlsx"].includes(ext)) return "excel";
        if (["txt", "text", "md"].includes(ext)) return "note";
        return ext;
    };

    const fileType = getFileType(fileContent[0].type, fileContent[0].name);

    return (
        <div
            className={isSelected ? "file-row selected" : "file-row"}
            onClick={() => checkboxRef.current.click()}
            style={{
                display: "grid",
                gridTemplateColumns: "50px 180px 120px 150px 1fr 200px",
                padding: "16px 24px",
                backgroundColor: isSelected ? "#F0EBFF" : "white",
                transition: "background-color 0.2s",
                cursor: "pointer",
                alignItems: "center",
            }}
        >
            <div>{fileContent[0].id}</div>
            <div>
                {new Date(fileContent[0].createdAt).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }
                )}
            </div>
            <div>
                <span style={getTypePillClass(fileType)}>
                    {fileType === "bundle" ? "bundle" : fileType}
                </span>
            </div>
            <div>{fileContent[0].creator_username}</div>
            <div
                style={{
                    fontWeight: "500",
                    minWidth: "100px",

                    textWrap: "nowrap",
                    overflowX: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {fileContent[0].name}
            </div>
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <input
                    type="checkbox"
                    ref={checkboxRef}
                    onChange={handleChange}
                    checked={isSelected}
                    style={{ marginRight: "1rem" }}
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        useStore.getState().setPreviewedFile(fileContent[0].id);
                    }}
                >
                    view
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();

                        copyLink(e);
                    }}
                    className={"copy-link"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        className="bi bi-files"
                        viewBox="0 0 16 16"
                        id="Files--Streamline-Bootstrap"
                        height={16}
                        width={16}
                    >
                        <desc>
                            {"Files Streamline Icon: https://streamlinehq.com"}
                        </desc>
                        <path
                            d="M13 0H6a2 2 0 0 0 -2 2 2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2 2 2 0 0 0 2 -2V2a2 2 0 0 0 -2 -2m0 13V4a2 2 0 0 0 -2 -2H5a1 1 0 0 1 1 -1h7a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1M3 4a1 1 0 0 1 1 -1h7a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1H4a1 1 0 0 1 -1 -1z"
                            strokeWidth={1}
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

File.propTypes = {
    fileData: propTypes.object,
};

export default File;
