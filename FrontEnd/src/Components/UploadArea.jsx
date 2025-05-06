import { FaMinus, FaPlus, FaUpload } from "react-icons/fa";
import Button from "./Button/Button";
import VerticalDiv from "./UILayout/VerticalDiv";
import HorizontalDiv from "./UILayout/HorizontalDiv";
import { useRef, useState, useEffect } from "react";
import { useStore } from "./Contexts/ctx.appManager";

const ListItem = ({ index, name, remove, percentage }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [logoutHovered, setLogoutHovered] = useState(false);
    const setError = useStore((state) => state.setError);

    useEffect(() => {
        console.log(percentage);
    }, [percentage]);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                position: "relative",
                overflowX: "hidden",
                padding: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",

                borderBottom: "1px solid var(--text-color)",
            }}
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "0.5rem",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    zIndex: 1000,

                    ...(isHovered
                        ? { pointerEvents: "auto", left: "0.5rem" }
                        : { pointerEvents: "none", left: "-2.0rem" }),
                    ...(logoutHovered
                        ? {
                              backgroundColor: "#ffc2c3",
                              color: "#f52727",
                              borderColor: "#f52727",
                          }
                        : {}),
                    transition: "left 0.2s, background-color 0.2s",

                    cursor: "pointer",
                }}
                onMouseEnter={() => {
                    setLogoutHovered(true);
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    setLogoutHovered(false);
                    setIsHovered(true);
                }}
                onClick={() => {
                    setError("File Removed", "good");
                    remove(name);
                }}
            >
                -
            </div>{" "}
            <div
                style={{
                    ...(isHovered ? { opacity: "0" } : { opacity: "1" }),
                }}
            >
                {index}
            </div>
            <span
                style={{
                    overflowX: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                }}
            >
                {name}
            </span>
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    width: `${percentage}%`,
                    backgroundColor: "var(--text-color)",
                    opacity: "0.5",
                }}
            ></div>
        </div>
    );
};

const UploadArea = () => {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState([]);
    const uploadFile = useStore((state) => state.uploadFiles);
    const setError = useStore((state) => state.setError);

    const onProgress = (name, percent) => {
        const newList = { ...progress };
        newList[name] = percent;
        setProgress(newList);
    };

    useEffect(() => {
        setFiles(
            files.filter((f) => {
                return progress[f.name] !== 100;
            })
        );
    }, [progress]);

    const removeFile = (index) => {
        setFiles(
            files.filter((f) => {
                return f.name !== index;
            })
        );
    };

    return (
        <div
            style={{
                border: "1px solid var(--secondary-color)",
                borderRadius: "0.5rem",
                padding: "1rem",
            }}
        >
            <div
                style={{
                    paddingBottom: "1rem",
                }}
            >
                File Upload
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                }}
            >
                {Array.from(files).map((f, index) => (
                    <ListItem
                        index={index + 1}
                        name={f.name}
                        key={index}
                        remove={removeFile}
                        percentage={progress[f.name]}
                    />
                ))}
            </div>
            <div
                style={{
                    padding: "0.5rem",
                    border: "1px solid var(--secondary-color)",
                    borderRadius: "0.5rem",
                    marginTop: "0.5rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // padding: "0.5rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <Button
                            onClick={(e) => {
                                if (!fileInputRef) {
                                    setError(true);
                                }
                                fileInputRef.current.click();
                            }}
                        >
                            <FaPlus /> Add
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                style={{
                                    visibility: "hidden",
                                    position: "absolute",
                                }}
                                onChange={(event) => {
                                    const newfiles = event.target.files;
                                    const newList = [...files, ...newfiles];
                                    if (newList.length > 10) {
                                        setError("Hit upload limit :(", "bad");
                                        newList.length = 10;
                                    }
                                    setFiles(newList);

                                    const newProgress = {};

                                    for (let i = 0; i < newList.length; i++) {
                                        newProgress[newList[i].name] = 0;
                                    }

                                    console.log(newProgress);

                                    setProgress(newProgress);
                                }}
                            />
                        </Button>
                        <Button
                            onClick={() => {
                                setFiles([]);
                            }}
                        >
                            <FaMinus />
                            Clear
                        </Button>
                    </div>

                    <div>{files.length}/10</div>
                </div>
                <Button
                    style={
                        {
                            // marginLeft: "0.5rem",
                        }
                    }
                    onClick={async (e) => {
                        e.preventDefault();

                        if (!files || files.length === 0) {
                            console.error("No files selected");
                            return;
                        }

                        try {
                            await uploadFile(files, onProgress);

                            setProgress([]);
                            setFiles([]);
                        } catch (error) {
                            setError(error);
                        }
                    }}
                >
                    <FaUpload /> Upload
                </Button>
            </div>
        </div>
    );
};

export default UploadArea;
