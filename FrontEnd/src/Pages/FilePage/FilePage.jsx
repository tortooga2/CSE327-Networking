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

    useEffect(() => {
        if (!fileData) {
            return;
        }

        if (getFileType(fileData.type) === "Note") {
            setIsNote(true);
        }
    }, [fileData]);

    return (
        <NewPage center>
            <VerticalDiv style={{ alignItems: "center" }}>
                <VerticalDiv
                    width={"50%"}
                    padding="0rem"
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
