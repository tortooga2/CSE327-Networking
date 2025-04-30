import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import "./File.css";
import { FaCopy } from "react-icons/fa";

import { FileType } from "../../Tags";
import Button from "../../Button/Button";

import { useStore } from "../../Contexts/ctx.appManager";

const File = ({ fileData }) => {
    const fileContent = useState(fileData);

    const checkboxRef = useRef(null);

    const isSelected = useStore((state) =>
        state.selectedFiles.has(fileContent[0].id)
    );
    const setIsSelected = useStore((state) => state.selectFile);

    const isLayout = useStore((state) => {
        return state.layoutState === 0;
    });

    const ViewFile = (fileId) => (e) => {
        e.stopPropagation();
        useStore.getState().setPreviewedFile(fileId);
    };

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
            `${window.location.origin}/file/${fileContent[0].id}`
        );
        alert("Link copied to clipboard");
    };

    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className={isSelected ? "file-row selected" : "file-row"}
            onClick={ViewFile(fileContent[0].id)}
            style={{
                display: "flex",
                justifyContent: "space-evenly",
                padding: !isHover ? "1rem 0.5rem" : "1rem 1rem",
                backgroundColor: isSelected ? "#f2e9e1" : "#ffffff00",
                transition: "background-color 0.2s, padding 0.2s ease-in-out",
                cursor: "pointer",
                alignItems: "center",
                gap: "min(10rem, 3rem)",
                minWidth: "30vw",
            }}
            onMouseEnter={() => {
                setIsHover(true);
            }}
            onMouseLeave={() => {
                setIsHover(false);
            }}
        >
            <input
                type="checkbox"
                ref={checkboxRef}
                onChange={handleChange}
                checked={isSelected}
            />

            <div
                style={{
                    flexShrink: "0",
                }}
            >
                {fileContent[0].createdAt}
            </div>
            <div
                style={{
                    minWidth: isLayout ? "5rem" : "2rem",
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {FileType(fileContent[0].name, isLayout)}
            </div>
            {isLayout ? (
                <div
                    style={{
                        maxWidth: "10rem",
                    }}
                >
                    {fileContent[0].creator_username}
                </div>
            ) : null}
            {isLayout ? (
                <div
                    style={{
                        textWrap: "nowrap",
                        minWidth: "15rem",
                        maxWidth: "15rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {fileContent[0].name}
                </div>
            ) : null}
            <div
                style={{
                    minWidth: "3rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {`${window.location.origin}/file/${fileContent[0].id}`}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "0.1rem",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "fit-content",
                }}
            >
                {isLayout && (
                    <Button onClick={ViewFile(fileContent[0].id)}>view</Button>
                )}
                <Button
                    onClick={(e) => {
                        e.stopPropagation();

                        copyLink(e);
                    }}
                    className={"copy-link"}
                >
                    <FaCopy />
                </Button>
            </div>
        </div>
    );
};

File.propTypes = {
    fileData: propTypes.object,
};

export default File;
