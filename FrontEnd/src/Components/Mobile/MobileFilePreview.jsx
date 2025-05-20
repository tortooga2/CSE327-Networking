import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useStore } from "../Contexts/ctx.appManager";
import FileContent from "../fileContent/FileContent";
import { useUser } from "../Contexts/ctx.user";
import "./MobileFilePreview.css";

const MobileFilePreview = () => {
    const fileId = useStore((state) => state.previewedFile);
    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const getFileData = async () => {
            if (!fileId) return;
            
            setIsLoading(true);
            setError(null);
            
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
                    throw new Error(response.statusText || 'Failed to load file');
                }
            } catch (error) {
                console.error("Error fetching file:", error);
                setError(error.message);
                user.ValidateSession();
            } finally {
                setIsLoading(false);
            }
        };

        getFileData();
    }, [fileId, user]);

    if (!fileId) {
        return null;
    }

    const isVisible = Boolean(fileId);

    return (
        <div className={`mobile-preview-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="mobile-preview-header">
                <h2 className="mobile-preview-title">File Preview</h2>
                <div 
                    className="mobile-preview-close"
                    onClick={() => useStore.getState().setPreviewedFile(null)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            useStore.getState().setPreviewedFile(null);
                        }
                    }}
                >
                    <X />
                </div>
            </div>
            <div className="mobile-preview-content">
                {isLoading ? (
                    <div className="mobile-preview-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading file...</p>
                    </div>
                ) : error ? (                <div className="mobile-preview-error">
                        <p>Error loading file: {error}</p>
                        <div 
                            className="retry-button"
                            onClick={() => {
                                setFileContent(null);
                                setFileData(null);
                                setError(null);
                                setIsLoading(true);
                            }}
                        >
                            Retry
                        </div>
                    </div>
                ) : fileContent ? (
                    fileContent.map((file, index) => (
                        <FileContent key={index} file={file} />
                    ))
                ) : null}
            </div>
        </div>
    );
};

export default MobileFilePreview;
