import { create } from "zustand";

const useStore = create((set) => ({
    files: new Map(),
    selectedFiles: new Set(),
    previewedFile: 1,
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
    uploadFiles: async (files) => {
        //Separate name and type from each file and put in array
        const fileList = Array.from(files); //Since a FilesList doesn't actually have map, I decided to make a shallow copy to use .map()
        const fileNames = fileList.map(file => file.name);
        const fileTypes = fileList.map(file => file.type);

        try {
            const response = await fetch("/api/file/upload-helper", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileCount: files.length,
                    fileNames: fileNames,
                    fileTypes: fileTypes,
                }),
            });

            const { urls, data } = await response.json();

            // okay now lets push to S3
            for (let index = 0; index < files.length; index++) {
                await fetch(urls[index], {
                    method: "PUT",
                    headers: {
                        "Content-Type": fileTypes[index], 
                    },
                    body: files[index],
                });
            }

            // // Okay now we just check to see if the files were uploaded successfully
            await fetch("/api/file/verify", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: data,
                }),                
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
