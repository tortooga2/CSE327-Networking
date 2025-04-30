import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../Components/Contexts/ctx.appManager.jsx";

import FileContent from "../../Components/fileContent/FileContent.jsx";
import VerticalDiv from "../../Components/UILayout/VerticalDiv.jsx";
import NewPage from "../../Components/UILayout/NewPage.jsx";

const FilePage = () => {
    const { fileId } = useParams();

    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    const setPreviewedFile = useStore((state) => state.setPreviewedFile);

    useEffect(() => {


        const getFileData = async () => {
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
                    console.log(data);
                    setFileData(data.files.originalFile);
                    if (data.files.files) {
                        setFileContent(data.files.files);
                    } else {
                        setFileContent([data.files.originalFile]);
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
            }
        };

        getFileData();

        setPreviewedFile(fileId);
    }, [fileId]);

    return (
        <NewPage center>
            <VerticalDiv style={{ alignItems: "center" }}>


                <VerticalDiv
                    width={"50%"}
                    padding="0rem"
                    style={{ borderRadius: "1rem" }}
                >
                    {fileContent
                        ? fileContent.map((file, index) => {
                            return <FileContent key={index} file={file} />;
                        })
                        : null}
                </VerticalDiv>
            </VerticalDiv>
        </NewPage>
    );
};

export default FilePage;
