import { create } from "zustand";

const useStore = create((set) => ({
    files: new Map(),
    selectedFiles: new Set(),
    previewedFile: null,
    setPreviewedFile: (fileID) => {
        set({ previewedFile: fileID });
    },
    loading: false,
    getFiles: (paramaters) => {
        return Array.from(useStore.getState().files.values()).sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    },
    getFileById: (fileID) => {
        const file = useStore.getState().files.get(fileID);
        if (file) {
            return file;
        }
        return null;
    },
    setFiles: (files) => set({ files }),
    selectFile: (fileID, selectionState) => {
        set((state) => {
            const newSelectedFiles = new Set(state.selectedFiles);
            if (selectionState) {
                newSelectedFiles.add(fileID);
            } else {
                newSelectedFiles.delete(fileID);
            }
            console.log(newSelectedFiles);
            return { selectedFiles: newSelectedFiles };
        });
    },
    unSelectAll: () => {
        set((state) => {
            return { selectedFiles: new Set() };
        });
    },
    loadFiles: async () => {
        set({ loading: true });
        try {
            const response = await fetch("/api/file/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                const filesArray = data.data;

                set((state) => {
                    const newFiles = new Map(state.files);
                    for (const file of filesArray) {
                        newFiles.set(file.id, file);
                    }
                    return { files: newFiles };
                });
                set({ loading: false });
            }
        } catch (error) {
            console.error(error);
        }
    },
    updateFiles: (data) => {
        set((state) => {
            const filesMap = new Map(state.files);
            data.forEach((file) => filesMap.set(file.id, file));
            return { files: filesMap };
        });
    },
    connectFiles: async () => {
        try {
            const response = await fetch("/api/file/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    file_ids: Array.from(useStore.getState().selectedFiles),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Data from RTCPeerConnection", data);
                useStore.getState().updateFiles(data.data);
                useStore.getState().unSelectAll();
            }
        } catch (error) {
            console.error(error);
        }
    },
    uploadFiles: async (file) => {
        try {
            console.log("FILE NAME: ", file.name);

            const { url, key } = await fetch("/api/bin/getuploadpath", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .catch((err) => {
                    console.error("Error fetching upload path:", err);
                });

            await fetch(url, {
                method: "PUT",
                headers: {
                    ContentType: file.type,
                },
                body: file,
            });

            await fetch("/api/file/upload", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    fileName: file.name,
                    fileType: file.type,
                    key: key,
                },
            });
        } catch (err) {
            console.log(err);
        }
    },
    deleteFiles: async () => {
        try {
            const response = fetch("/api/file/delete/", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_ids: Array.from(useStore.getState().selectedFiles),
                }),
            });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    },
}));

export { useStore };
