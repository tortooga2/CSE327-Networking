import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import "./File.css";

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
            `${window.location.origin}/file/owner_id/${fileContent[0].id}`
        );
        alert("Link copied to clipboard");
    };

    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className={isSelected ? "file-row selected" : "file-row"}
            onClick={() => checkboxRef.current.click()}
            style={{
                display: "flex",
                justifyContent: "space-evenly",
                padding: !isHover ? "1rem 0.5rem" : "1rem 1rem",
                backgroundColor: isSelected ? "#f2e9e1" : "#ffffff00",
                transition: "background-color 0.2s, padding 0.2s ease-in-out",
                cursor: "pointer",
                alignItems: "center",
            }}
            onMouseEnter={() => {
                setIsHover(true);
            }}
            onMouseLeave={() => {
                setIsHover(false);
            }}
        >
            {isLayout && (
                <div
                    style={{
                        minWidth: "3rem",
                    }}
                >
                    {fileContent[0].id}
                </div>
            )}
            <div
                style={{
                    flexShrink: "0",
                    width: "10rem",
                    minWidth: "10rem",
                }}
            >
                {new Date(fileContent[0].createdAt).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }
                )}
            </div>
            <div>{FileType(fileContent[0].name)}</div>
            <div
                style={{
                    maxWidth: "10rem",
                }}
            >
                {fileContent[0].creator_username}
            </div>
            {isLayout && (
                <div
                    style={{
                        fontWeight: "500",
                        textWrap: "nowrap",
                        overflowX: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: "30rem",
                    }}
                >
                    {fileContent[0].name}
                </div>
            )}
            <div
                style={{
                    display: "flex",
                    gap: "0.1rem",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "fit-content",
                }}
            >
                <input
                    type="checkbox"
                    ref={checkboxRef}
                    onChange={handleChange}
                    checked={isSelected}
                />
                <Button onClick={ViewFile(fileContent[0].id)}>view</Button>
                {isLayout && (
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
                )}
            </div>
        </div>
    );
};

File.propTypes = {
    fileData: propTypes.object,
};

export default File;
