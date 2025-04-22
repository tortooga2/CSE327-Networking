import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../Components/Contexts/zus.fileManager.jsx";

import FileContent from "../../Components/fileContent/FileContent.jsx";
import VerticalDiv from "../../Components/UILayout/VerticalDiv.jsx";

const FilePage = () => {
    const { fileId, ownerId } = useParams();

    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    const setPreviewedFile = useStore((state) => state.setPreviewedFile);

    useEffect(() => {
        console.log(`File ID: ${fileId}`);
        console.log(`Owner ID: ${ownerId}`);

        console.log("Fetching file data @", `/api/file/user/${fileId}`);

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
    }, [fileId, ownerId]);

    return (
        <div style={{ margin: "6rem 10rem" }}>
            <h1>File Page</h1>
            <p>Owner Id: {ownerId}</p>
            <p>File ID: {fileId}</p>
            <div style={{ marginBottom: "2rem" }}></div>

            <VerticalDiv className="content">
                {fileContent
                    ? fileContent.map((file, index) => {
                          return <FileContent key={index} file={file} />;
                      })
                    : null}
            </VerticalDiv>
        </div>
    );
};

export default FilePage;
