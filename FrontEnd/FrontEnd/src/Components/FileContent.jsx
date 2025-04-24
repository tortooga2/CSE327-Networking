import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileContent = ({ file }) => {
    const getFileType = (mimeType, filename) => {
        const ext = filename.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
        if (["mp4", "webm", "ogg"].includes(ext)) return "video";
        if (ext === "pdf") return "pdf";
        if (["doc", "docx"].includes(ext)) return "word";
        if (["xls", "xlsx"].includes(ext)) return "excel";
        if (["txt", "text", "md"].includes(ext)) return "plain";
        return ext;
    };

    const copyLink = (e, fileId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/local/${fileId}`
        );
        alert("Link copied to clipboard");
    };

    const renderContent = () => {
        const fileType = getFileType(file.type, file.name);

        switch (fileType) {
            case "image":
                return (
                    <div className="relative w-full aspect-video bg-black/5 rounded-lg overflow-hidden">
                        <img
                            src={file.metadata.url}
                            className="absolute inset-0 w-full h-full object-contain"
                            alt={file.name}
                        />
                    </div>
                );
            case "video":
                return (
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                            controls
                            className="absolute inset-0 w-full h-full"
                        >
                            <source src={file.metadata.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );
            case "pdf":
            case "word":
            case "excel":
                return (
                    <div className="w-full h-[70vh] bg-white rounded-lg shadow-sm">
                        <DocViewer
                            documents={[
                                {
                                    uri: file.metadata.url,
                                    fileType: fileType,
                                    fileName: file.name,
                                },
                            ]}
                            pluginRenderers={DocViewerRenderers}
                            className="w-full h-full"
                            config={{
                                header: {
                                    disableHeader: true,
                                    disableFileName: true,
                                },
                            }}
                        />
                    </div>
                );
            case "plain":
            case "txt":
            case "md":
                return (
                    <iframe
                        src={file.metadata.url}
                        className="w-full h-[400px] border border-gray-200 rounded-lg bg-white"
                        title={file.name}
                    />
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg">
                        <p className="text-gray-600 mb-4">Preview not available for .{fileType} files</p>
                        <a
                            href={file.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#1E0B33] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Download File
                        </a>
                    </div>
                );
        }
    };

    return (
        <div className="bg-[#F8F6FD] rounded-lg overflow-hidden">
            <div className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-[#1E0B33] truncate">
                            {file.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Created by {file.creator_username}
                        </p>
                    </div>
                    <button
                        onClick={(e) => copyLink(e, file.id)}
                        className="px-4 py-2 border border-[#1E0B33] text-[#1E0B33] rounded-full hover:bg-[#1E0B33] hover:text-white transition-colors"
                    >
                        Copy Link
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default FileContent;
