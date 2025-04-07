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
        const fileDataArray = [];
        try {
            //Get an array of urls and keys for our files
            const { urls, keys } = await fetch("/api/bin/getuploadpath", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileCount: files.length })
            })
                .then((res) => res.json())
                .catch((err) => {
                    console.error("Error fetching upload paths:", err);
            });

            if (!urls || !keys || urls.length !== files.length || keys.length !== files.length) {
                throw new Error("Mismatch between number of files and S3 upload paths.");
            }            

            //Push file data to fileDataArray for bulk insert to Postgres
            for (let file = 0; file < files.length; file++) {
                try {
                    fileDataArray.push({
                        name: files[file].name,
                        type: (files[file].type).split("/")[1],
                        metadata: {
                            key: keys[file],
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to upload file: ${response.statusText}`);
                    }
                } catch (err) {
                    console.log(err);
                };
            }

            //Upload each individual file to s3
            for (let index = 0; index < files.length; index++) {
                await fetch(urls[index], {
                    method: "PUT",
                    headers: {
                        "Content-Type": files[index].type,
                    },
                    body: files[index],
                });
            }

            //Actually bulk create in our database
            await fetch("/api/file/upload", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileDataArray: fileDataArray}),
            });
        } catch (err) {
            console.log(err);
        };
    },
    deleteFiles: async () => {
        if (Array.from(useStore.getState().selectedFiles).length > 0) {
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
        }
    },
}));

export { useStore };
