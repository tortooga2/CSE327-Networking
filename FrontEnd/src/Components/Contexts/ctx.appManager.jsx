import { create } from "zustand";

const useStore = create((set) => ({
    userProfile: {},
    setUserProfile: (state) => set({ userProfile: state }),

    layoutState: 0,
    setLayoutState: (state) => set({ layoutState: state }),

    files: new Map(),
    setFiles: (files) => set({ files }),
    updateFiles: (data) => {
        set((state) => {
            const filesMap = new Map(state.files);
            data.forEach((file) => filesMap.set(file.id, file));
            return { files: filesMap };
        });
    },

    newFiles: new Array(),

    appendNewFiles: (state) => {
        set((prevState) => ({
            newFiles: [...prevState.newFiles, state],
        }));
    },
    popNewFiles: () => {
        set((prevState) => ({
            newFiles: prevState.newFiles.slice(0, -1),
        }));
    },

    sortOrder: { field: "id", order: "desc" },
    setSortOrder: (state) => set({ sortOrder: state }),

    selectedFiles: new Set(),
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
        set({ selectedFiles: new Set() });
    },
    previewedFile: null,
    setPreviewedFile: (fileID) => {
        if (fileID === null) {
            set({ layoutState: 0 });
        } else {
            set({ layoutState: 1 });
        }
        set({ previewedFile: fileID });
    },
    loading: false,

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
        //Separate name from each file
        const fileNames = [];
        for (let index = 0; index < files.length; index++) {
            fileNames.push(files[index].name);
        }

        try {
            const response = await fetch("/api/file/upload-helper", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileCount: files.length,
                }),
            });

            const { urls, keys } = await response.json();

            //Push each file to s3
            for (let index = 0; index < files.length; index++) {
                await fetch(urls[index], {
                    method: "PUT",
                    body: files[index],
                });
            }

            //Now check to see if the files were uploaded successfully and if so, save to db
            const newFileRes = await fetch("/api/file/verify", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    keys: keys,
                    fileNames: fileNames
                }),
            });

            console.log(newFileRes);
            useStore.getState().updateFiles(newFileRes.data);
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
