import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FilePage = () => {
    const { fileId, ownerId } = useParams();

    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    const copyLink = (e, fileId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileId}`
        );
        alert("Link copied to clipboard");
    };

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
                          return (
                              <div
                                  key={index}
                                  style={{
                                      display: "flex",
                                      flexDirection: "row",

                                      borderTop: "2px solid black",
                                  }}
                              >
                                  <div
                                      style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          width: "20rem",
                                          alignItems: "center",
                                          padding: "1rem",
                                          gap: "1rem",
                                      }}
                                  >
                                      <p>{file.id}</p>
                                      <p>{file.creator_username}</p>
                                      <p>{file.name}</p>
                                      <p>{file.type}</p>
                                      <button
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              copyLink(e, file.id);
                                          }}
                                      >
                                          Copy Link
                                      </button>
                                  </div>
                                  <div>
                                      <img
                                          src={file.metadata.url}
                                          style={{
                                              width: "100%",
                                          }}
                                      />
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>
        </div>
    );
};

export default FilePage;
