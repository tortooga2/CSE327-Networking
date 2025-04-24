const getFileType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "Image";
    if (["mp4", "webm", "ogg"].includes(ext)) return "Video";
    if (["pdf", "doc", "docx", "xls", "xlsx"].includes(ext)) return "Document";
    if (["txt", "text", "md"].includes(ext)) return "Note";
    return "Bundle";
};

export default getFileType;
