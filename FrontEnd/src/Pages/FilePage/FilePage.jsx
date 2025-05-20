import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../Components/Contexts/ctx.appManager.jsx";

import FileContent from "../../Components/fileContent/FileContent.jsx";
import VerticalDiv from "../../Components/UILayout/VerticalDiv.jsx";
import NewPage from "../../Components/UILayout/NewPage.jsx";
import ErrorPopup from "../../Components/ErrorPopup.jsx";
import getFileType from "../../Components/scripts/getFileType.js";
import NotesView from "../../Components/fileContent/NotesView.jsx";
import { useUser } from "../../Components/Contexts/ctx.user.jsx";

import { FileType } from "../../Components/Tags";
import { getFileUrl } from "../../Components/scripts/fileUrlFuncs.js";
import Button from "../../Components/Button/Button.jsx";

const FilePage = () => {
    const { fileId } = useParams();

    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    const setPreviewedFile = useStore((state) => state.setPreviewedFile);
    const { user } = useUser();

    useEffect(() => {
        const getFileData = async () => {
            await user.ValidateSession();
            try {
                const response = await fetch(`/api/file/focus/${fileId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();

                    setFileData(data.files.originalFile);
                    if (data.files.files) {
                        setFileContent(data.files.files);
                    } else {
                        setFileContent([data.files.originalFile]);
                    }
                } else {
                    await user.ValidateSession();
                }
            } catch (error) {
                console.log("Error", error);
                await user.ValidateSession();
            }
        };

        getFileData().then(() => setPreviewedFile(fileId));
    }, [fileId]);

    const [isNote, setIsNote] = useState(false);
    const [isBundle, setIsBundle] = useState(false);
    const fileIds = [];

    useEffect(() => {
        if (!fileData) {
            return;
        }

        if (getFileType(fileData.type) === "Note") {
            setIsNote(true);
        }
        if (getFileType(fileData.name) === "Bundle") {
            setIsBundle(true);
        }
    }, [fileData]);

    return (
        <NewPage center>
            <VerticalDiv style={{ alignItems: "center", padding: "3rem" }}>
                {isBundle ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: " 0.5rem",
                            width: "30%",
                            padding: "0rem 10rem",
                            left: "0",
                            position: "fixed",
                        }}
                    >
                        <h1
                            style={{
                                color: "var(--bundle-color-2)",
                                fontSize: "3rem",
                                fontWeight: "bold",
                            }}
                        >
                            ConnectWork
                        </h1>

                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                            }}
                        >
                            {fileData ? FileType(fileData.name) : ""}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                            }}
                        >
                            <p>Name:</p> {fileData ? fileData.name : ""}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                            }}
                        >
                            <p>Create At:</p>
                            {fileData
                                ? (() => {
                                      return new Date(
                                          fileData.createdAt
                                      ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                      });
                                  })()
                                : ""}
                        </div>
                        <p>
                            Creator: {fileData ? fileData.creator_username : ""}
                        </p>
                        <div>
                            Bundle Content Ids:{" "}
                            {Array.from(fileContent).map((file) => {
                                fileIds.push(file.id);
                                return (
                                    <a
                                        href={getFileUrl(file.id)}
                                        key={file.id}
                                        target="_blank"
                                    >
                                        {getFileUrl(file.id)}{" "}
                                    </a>
                                );
                            })}
                        </div>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                let clip = "";
                                for (let id in fileIds) {
                                    clip += `<file>${fileIds[id]}</file>\n`;
                                }
                                navigator.clipboard.writeText(clip);
                            }}
                        >
                            Copy Note Embedings
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                let clip = "";
                                for (let id in fileIds) {
                                    clip += `${getFileUrl(fileIds[id])}\n`;
                                }
                                navigator.clipboard.writeText(clip);
                            }}
                        >
                            Copy Urls
                        </Button>
                    </div>
                ) : null}
                <VerticalDiv
                    width={"50%"}
                    padding="4rem"
                    style={{ borderRadius: "1rem" }}
                    height="100%"
                >
                    {fileContent && !isNote
                        ? fileContent.map((file, index) => {
                              return <FileContent key={index} file={file} />;
                          })
                        : null}
                    {isNote ? (
                        <NotesView
                            src={fileData.metadata.url}
                            maxHeight="100vh"
                        />
                    ) : null}
                </VerticalDiv>
            </VerticalDiv>
            <ErrorPopup />
        </NewPage>
    );
};

export default FilePage;
