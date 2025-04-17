import { useEffect, useState } from "react";
import { useStore } from "../Contexts/zus.fileManager";
import PropTypes from "prop-types";
import FileContent from "../FileContent";
import "./FilePreview.css";

const FilePreview = () => {
    const fileId = useStore((state) => state.previewedFile);
    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    // Close preview when clicking overlay or pressing ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closePreview();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const closePreview = () => {
        useStore.getState().setPreviewedFile(null);
    };

    // Fetch file data
    useEffect(() => {
        if (!fileId) return;

        const getFileData = async () => {
            try {
                const response = await fetch(`/api/file/focus/${fileId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setFileData(data.files.originalFile);
                    setFileContent(data.files.files || [data.files.originalFile]);
                }
            } catch (error) {
                console.error(error);
                setFileData({ error });
            }
        };

        getFileData();
    }, [fileId]);

    if (!fileId) return null;

    return (
        <div className="modal-overlay" onClick={closePreview}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="file-info">
                        <h2>{fileData?.name}</h2>
                        <span className="file-type">{fileData?.type}</span>
                    </div>
                    <button className="close-button" onClick={closePreview}>
                        ×
                    </button>
                </div>
                
                <div className="preview-container">
                    {fileContent?.map((file, index) => (
                        <FileContent key={index} file={file} />
                    ))}
                </div>
            </div>
        </div>
    );
};

FileContent.propTypes = {
    file: PropTypes.object.isRequired,
};

export default FilePreview;

