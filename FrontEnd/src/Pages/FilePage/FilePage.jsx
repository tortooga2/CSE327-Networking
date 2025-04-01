import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        <div>
            <h1>File Page</h1>
            <p>Owner ID: {ownerId}</p>
            <p>File ID: {fileId}</p>
            <p>-----------------</p>
            <p>-----------------</p>
            {fileContent
                ? fileContent.map((file, index) => {
                      return (
                          <div key={index}>
                              <p>{file.name}</p>
                              <img src={file.metadata.url} />
                          </div>
                      );
                  })
                : null}
        </div>
    );
};

export default FilePage;
