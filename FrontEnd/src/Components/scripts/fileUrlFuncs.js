import { useStore } from "../Contexts/ctx.appManager";

export const getFileUrl = (id) => {
    return `${window.location.origin}/file/${id}`;
};

export const copyFileUrl = (e, fileId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getFileUrl(fileId));
    useStore.getState().setError("Link Copied", "good");
};
