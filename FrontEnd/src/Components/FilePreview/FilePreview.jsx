import { useEffect, useState } from "react";

import { useStore } from "../Contexts/zus.fileManager";

const FilePreview = () => {
    const fileId = useStore((state) => state.previewedFile);
    const closedFile = useStore((state) => {
        return state.previewedFile === null;
    });
    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    const [style, setStyle] = useState({
        width: 0,
    });

    const copyLink = (e, fileId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileId}`
        );
        alert("Link copied to clipboard");
    };

    const closePreview = () => {
        useStore.getState().setPreviewedFile(null);
    };

    useEffect(() => {
        if (closedFile) {
            setStyle({
                width: "0",
                overflow: "hidden",
                transition: "width 400ms ease-in",
            });
        } else {
            setStyle({
                width: "100%",

                transition: "width 400ms cubic-bezier(.47,1.64,.41,.8)",
            });
        }
    }, [closedFile]);

    useEffect(() => {
        console.log(`File ID: ${fileId}`);

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
    }, [fileId]);

    return (
        <div style={style}>
            <h1>File Page</h1>
            <p>File ID: {fileId}</p>
            <button onClick={closePreview}>Close</button>
            <div style={{ marginBottom: "2rem" }}></div>

            <div
                className="content"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "100px",
                    overflowY: "auto",
                    maxHeight: "80vh",
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

export default FilePreview;
