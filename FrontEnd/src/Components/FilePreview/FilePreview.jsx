import { useEffect, useState } from "react";
import { useStore } from "../Contexts/zus.fileManager";
import PropTypes from "prop-types";
import FileContent from "../FileContent";
import VerticalDiv from "../UILayout/VerticalDiv";

const FilePreview = () => {
    const fileId = useStore((state) => state.previewedFile);
    const getFileById = useStore((state) => state.getFileById);
    const closedFile = useStore((state) => state.previewedFile !== null);
    const [fileData, setFileData] = useState(null);
    const [fileContent, setFileContent] = useState(null);

    const copyLink = (e, fileId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/local/${fileId}`
        );
        alert("Link copied to clipboard");
    };

    const closePreview = () => {
        useStore.getState().setPreviewedFile(null);
    };

    useEffect(() => {
        if (!fileId) return;
        
        const file = getFileById(fileId);
        if (file) {
            setFileData(file);
            if (file.files) {
                setFileContent(file.files);
            } else {
                setFileContent([file]);
            }
        }
    }, [fileId, getFileById]);

    return (
        <VerticalDiv
            className="lg:h-screen"
            before={{
                marginLeft: "0rem",
                width: "0%",
                height: "0%",
                opacity: "0",
                transition:
                    "all 0.3s ease-in-out",
            }}
            after={{
                marginLeft: "0",
                width: "100%",
                height: "100%",
                opacity: "1",
                transition:
                    "all 0.3s ease-in-out",
            }}
            playAnimation={closedFile}
        >
            <div
                className="preview-header sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-200"
            >
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <h2 className="text-xl font-semibold text-[#1E0B33] truncate">
                            {fileData?.name || "File Preview"}
                        </h2>
                        <span className="px-3 py-1 bg-[#1E0B33] text-white text-sm font-medium rounded-full">
                            {fileData?.type || ""}
                        </span>
                    </div>
                    <button
                        onClick={closePreview}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="preview-content flex-1 overflow-auto p-4">
                {fileContent?.map((file, index) => (
                    <FileContent file={file} key={index} />
                ))}
            </div>
        </VerticalDiv>
    );
};

FileContent.propTypes = {
    file: PropTypes.object.isRequired,
};

export default FilePreview;
