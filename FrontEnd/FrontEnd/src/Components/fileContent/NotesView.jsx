import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useStore } from "../Contexts/ctx.appManager";
import MDEditor from "@uiw/react-md-editor";
import VerticalDiv from "../UILayout/VerticalDiv";
import MarkdownPreview from "react-markdown";
import rehypeRaw from "rehype-raw";
import FileContent from "./FileContent.jsx";

const NotesView = ({ src, maxHeight = "60vh" }) => {
    const [loaded, setLoaded] = useState(false);
    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });
    const fileSrc = src;

    const beforeLoad = {
        opacity: 0,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    const afterLoad = {
        opacity: 1,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    const [text, setText] = useState("");

    useEffect(() => {
        const getText = async () => {
            try {
                const response = await fetch(src);
                if (!response.ok) {
                    return "Failed to fetch note";
                }
                const text = await response.text();
                return text;
            } catch (err) {
                return err;
            }
        };
        getText().then((newText) => setText(newText));
    }, [src]);

    return (
        <div
            style={{
                height: "100%",
            }}
        >
            <VerticalDiv
                height={"100%"}
                style={{ maxHeight: maxHeight, padding: "0 4rem" }}
            >
                <div className="markdown">
                    <MarkdownPreview
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            file: ({ children }) => {
                                const fileid = children;
                                const [fileData, setFileData] = useState(null);
                                const [fileContent, setFileContent] =
                                    useState(null);
                                const [loading, setLoading] = useState(true);

                                useEffect(() => {
                                    console.log(`File ID: ${children}`);
                                    console.log(
                                        "Fetching file data @",
                                        `/api/file/user/${fileid}`
                                    );
                                    if (!fileid) {
                                        setLoading(false);
                                        return;
                                    }

                                    const getFileData = async () => {
                                        try {
                                            const response = await fetch(
                                                `/api/file/focus/${fileid}`,
                                                {
                                                    method: "GET",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                    },
                                                    credentials: "include",
                                                }
                                            );
                                            if (response.ok) {
                                                const data =
                                                    await response.json();
                                                console.log(data);
                                                setFileData(
                                                    data.files.originalFile
                                                );
                                                if (data.files.files) {
                                                    setFileContent(
                                                        data.files.files
                                                    );
                                                } else {
                                                    setFileContent([
                                                        data.files.originalFile,
                                                    ]);
                                                }
                                            } else {
                                                setFileData({
                                                    error: response.statusText,
                                                });
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            setFileData({
                                                error: error,
                                            });
                                        } finally {
                                            setLoading(false);
                                        }
                                    };

                                    getFileData();
                                }, [fileid]);

                                return (
                                    <div
                                        style={{
                                            maxWidth: "40vw",
                                            margin: "0 auto",
                                        }}
                                    >
                                        {loading ? (
                                            <div>Loading file...</div>
                                        ) : !fileData ? (
                                            <div>No file data found</div>
                                        ) : fileData.error ? (
                                            <div>
                                                Error:{" "}
                                                {fileData.error.toString()}
                                            </div>
                                        ) : (
                                            <FileContent file={fileData} />
                                        )}
                                    </div>
                                );
                            },
                        }}
                    >
                        {text}
                    </MarkdownPreview>
                </div>
            </VerticalDiv>
        </div>
    );
};

NotesView.propTypes = {
    src: PropTypes.string.isRequired,
};

export default NotesView;