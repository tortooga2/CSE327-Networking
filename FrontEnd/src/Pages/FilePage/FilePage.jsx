import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileContent from "../../Components/FileContent";

const FilePage = () => {
    const { fileId, ownerId } = useParams();
    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    useEffect(() => {
        // Load file from localStorage
        const savedFiles = localStorage.getItem('files');
        if (savedFiles) {
            try {
                const filesMap = new Map(JSON.parse(savedFiles));
                const file = filesMap.get(fileId);
                if (file) {
                    setFileData(file);
                    if (file.files) {
                        setFileContent(file.files);
                    } else {
                        setFileContent([file]);
                    }
                }
            } catch (error) {
                console.error('Error loading file:', error);
                setFileData({ error: 'Failed to load file' });
            }
        }
    }, [fileId, ownerId]);

    return (
        <div style={{ margin: "6rem 10rem" }}>
            <h1>File Page</h1>
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
