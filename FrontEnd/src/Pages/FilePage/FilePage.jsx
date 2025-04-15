import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FileContent from "../../Components/FileContent";

const FilePage = () => {
    const { fileId, ownerId } = useParams();

    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

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
    }, [fileId, ownerId]);

    return (
        <div style={{ margin: "6rem 10rem" }}>
            <h1>File Page</h1>
            <p>Owner Id: {ownerId}</p>
            <p>File ID: {fileId}</p>
            <div style={{ marginBottom: "2rem" }}></div>

            <div
                className="content"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "100px",
                }}
            >
                {fileContent
                    ? fileContent.map((file, index) => {
                          return <FileContent key={index} file={file} />;
                      })
                    : null}
            </div>
        </div>
    );
};

export default FilePage;
