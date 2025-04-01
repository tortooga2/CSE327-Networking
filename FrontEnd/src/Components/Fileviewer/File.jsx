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
        console.log("Checkbox changed:", e.target.checked);
        setIsSelected(fileContent[0].id, !isSelected);
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
                            navigate(`/file/owner_id/${fileContent[0].id}`);
                        }}
                    >
                        view
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
                                    <span className={"file-button-text"}>
                                        expand
                                    </span>
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
