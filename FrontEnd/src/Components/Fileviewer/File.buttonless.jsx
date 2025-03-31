import { useState, useRef, useEffect } from "react";
import propTypes from "prop-types";
import "./File.css";

import { useStore } from "../Contexts/zus.fileManager";

const FileButtonLess = ({ fileData }) => {
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
        setIsSelected(fileContent[0].id, !isSelected);
    };

    const className = isSelected ? "file-item selected" : "file-item";
    const dropDownClass = isExpanded
        ? dropDownClassName + " open"
        : dropDownClassName;
    return (
        <div className={className} onClick={() => checkboxRef.current.click()}>
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
            </div>
        </div>
    );
};

FileButtonLess.propTypes = {
    fileData: propTypes.object,
};

export default FileButtonLess;
