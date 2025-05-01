export const getFileUrl = (id) => {
    return `${window.location.origin}/file/${id}`;
};

export const copyFileUrl = (e, fileId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getFileUrl(fileId));
    alert("Link copied to clipboard");
};
