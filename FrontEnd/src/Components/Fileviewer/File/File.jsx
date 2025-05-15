import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import "./File.css";
import { FaCopy } from "react-icons/fa";

import { FileType } from "../../Tags";
import Button from "../../Button/Button";

import { useStore } from "../../Contexts/ctx.appManager";

import { copyFileUrl, getFileUrl } from "../../scripts/fileUrlFuncs";

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

    const isPreviewed = useStore((state) => {
        return state.previewedFile === fileContent[0].id;
    });

    const ViewFile = (fileId) => (e) => {
        // e.stopPropagation();
        useStore.getState().setPreviewedFile(fileId);
    };

    useEffect(() => {
        checkboxRef.current.checked = isSelected;
    }, [isSelected]);

    const handleChange = (e) => {
        e.stopPropagation();
        setIsSelected(fileContent[0].id, !isSelected);
    };

    const [isHover, setIsHover] = useState(false);

    const [onEnter, setOnEnter] = useState({ width: "100%" });
    const [onEnter2, setOnEnter2] = useState({ height: "0%" });

    useEffect(() => {
        setOnEnter({ width: "0%" });
        setOnEnter2({ height: "fit-content" });
    }, []);

    return (
        <div
            style={{
                ...onEnter2,
                transition: "height 0.5s ease-in-out",
            }}
        >
            <div
                className={isSelected ? "file-row selected" : "file-row"}
                onClick={ViewFile(fileContent[0].id)}
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    padding: "0.5rem 0.5rem",
                    backgroundColor: isSelected
                        ? "var(--secondary-color)"
                        : "#ffffff00",
                    transition:
                        "background-color 0.2s, padding 0.2s ease-in-out",
                    cursor: "pointer",
                    alignItems: "center",
                    gap: "min(10rem, 3rem)",
                    minWidth: "30vw",
                    position: "relative",
                }}
                onMouseEnter={() => {
                    setIsHover(true);
                }}
                onMouseLeave={() => {
                    setIsHover(false);
                }}
            >
                <div
                    className="cover"
                    style={{
                        position: "absolute",
                        height: "100%",
                        top: "0",
                        right: "0",
                        backgroundColor: "var(--primary-color",
                        ...onEnter,
                        transition: "width 0.5s ease-in-out 0.2s",
                        zIndex: "1000",
                    }}
                ></div>
                <div
                    className={"underbar " + (isPreviewed ? "show" : "hide")}
                    style={{
                        height: "1px",
                        backgroundColor: "var(--text-color)",
                        position: "absolute",

                        bottom: "0%",
                        left: "2.5%",
                    }}
                ></div>
                <div
                    style={{
                        width: "3rem",
                        minWidth: "3rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                    }}
                >
                    <p>{fileData.id}</p>
                    <input
                        type="checkbox"
                        ref={checkboxRef}
                        onChange={handleChange}
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                <div
                    style={{
                        flexShrink: "0",
                        width: "15rem",
                    }}
                >
                    {(() => {
                        const date = new Date(fileContent[0].createdAt);
                        const datePart = date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        });
                        const timePart = date.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                            timeZoneName: "short",
                        });
                        return `${datePart} ${timePart}`;
                    })()}
                </div>
                <div
                    style={{
                        minWidth: "2rem",
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
                            width: "10rem",
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
                            width: "15rem",
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
                        width: "20rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    <a href={getFileUrl(fileContent[0].id)} target="_blank">
                        {getFileUrl(fileContent[0].id)}
                    </a>
                </div>

                <div
                    className="buttons"
                    style={{
                        display: "flex",
                        gap: "0.1rem",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: "5rem",
                        zIndex: "0",
                    }}
                >
                    {isLayout && (
                        <Button onClick={ViewFile(fileContent[0].id)}>
                            view
                        </Button>
                    )}
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            copyFileUrl(e, fileContent[0].id);
                        }}
                        className={"copy-link"}
                    >
                        <FaCopy />
                    </Button>
                </div>
            </div>
        </div>
    );
};

File.propTypes = {
    fileData: propTypes.object,
};

export default File;
