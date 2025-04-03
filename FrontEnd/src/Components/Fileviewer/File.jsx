import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import "./File.css";

import { useStore } from "../Contexts/zus.fileManager";

import FileButtonLess from "./File.buttonless";

const File = ({ fileData }) => {
    const navigate = useNavigate();
    const fileContent = useState(fileData);
    const buttonSection = useRef(null);
    const checkboxRef = useRef(null);
    const dropDownRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const dropDownClassName = "drop-down";
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

    const className = isSelected ? "file-item selected" : "file-item";
    const dropDownClass = isExpanded
        ? dropDownClassName + " open"
        : dropDownClassName;
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            <div
                className={className}
                onClick={() => checkboxRef.current.click()}
            >
                <div className={"id-column"}>{fileContent[0].id}</div>
                <div className={"date-column"}>
                    {(() => {
                        const date = new Date(fileContent[0].createdAt);
                        const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        };
                        const formattedDate = date.toLocaleDateString(
                            "en-US",
                            options
                        );
                        const formattedTime = date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        return `${formattedDate} ${formattedTime}`;
                    })()}
                </div>
                <div className={"type-column"}>{fileContent[0].type}</div>
                <div className={"owner-column"}>
                    {fileContent[0].creator_username}
                </div>
                <div className={"name-column"}>{fileContent[0].name}</div>
                <div className={"button-column"} ref={buttonSection}>
                    <input
                        type="checkbox"
                        ref={checkboxRef}
                        onChange={handleChange}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            useStore
                                .getState()
                                .setPreviewedFile(fileContent[0].id);
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
                                {
                                    "Files Streamline Icon: https://streamlinehq.com"
                                }
                            </desc>
                            <path
                                d="M13 0H6a2 2 0 0 0 -2 2 2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2 2 2 0 0 0 2 -2V2a2 2 0 0 0 -2 -2m0 13V4a2 2 0 0 0 -2 -2H5a1 1 0 0 1 1 -1h7a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1M3 4a1 1 0 0 1 1 -1h7a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1H4a1 1 0 0 1 -1 -1z"
                                strokeWidth={1}
                            />
                        </svg>
                    </button>
                    {(() => {
                        if (fileContent[0].type === "bundle") {
                            return (
                                <button
                                    className={"file-button"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle bundle view
                                        setIsExpanded(!isExpanded);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#000000"
                                        className={
                                            "bi bi-caret-right" +
                                            (isExpanded ? " expanded" : "")
                                        }
                                        viewBox="0 0 16 16"
                                        id="Caret-Right--Streamline-Bootstrap"
                                        height={16}
                                        width={16}
                                    >
                                        <desc>
                                            {
                                                "Caret Right Streamline Icon: https://streamlinehq.com"
                                            }
                                        </desc>
                                        <path
                                            d="M6 12.796V3.204L11.481 8zm0.659 0.753 5.48 -4.796a1 1 0 0 0 0 -1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659 0.753"
                                            strokeWidth={1}
                                        />
                                    </svg>
                                </button>
                            );
                        }
                        return <div className={"file-button"}></div>;
                    })()}
                </div>
            </div>
            <div
                className="dropDown-container"
                style={{ display: "flex", flexDirection: "row" }}
            >
                <div style={{ width: "100px" }}></div>
                {fileContent[0].type === "bundle" ? (
                    <div className={dropDownClass} ref={dropDownRef}>
                        {fileContent[0].children.item_id.map((child) => {
                            const childFile = useStore
                                .getState()
                                .getFileById(child);
                            if (!childFile) return null; // Skip if file not found
                            return (
                                <FileButtonLess
                                    key={child}
                                    fileData={childFile}
                                />
                            );
                        })}
                        {console.log(fileContent[0].children)}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

File.propTypes = {
    fileData: propTypes.object,
};

export default File;
