import { create } from "zustand";

import { useUser } from "./ctx.user";

const useStore = create((set) => ({
    userProfile: {},
    setUserProfile: (state) => set({ userProfile: state }),

    userSettings: {},
    setUserSettings: (state) => set({ userSettings: state }),
    updateUserSettings: async (state) => {
        const response = await fetch("api/user/settings/update", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                ...useStore.getState().userSettings,
            }),
        });
        if (response.ok) {
            const { data } = await response.json();
            useStore.getState().setUserSettings(data);
        } else {
            useStore.getState().user.ValidateSession();
            console.error("failed to update settings");
        }
    },
    
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

    SortOrder: {
        DESC: "desc",
        ASC: "asc",
    },

    searchFiles: async (
        searchString = null,
        sortColumn = null,
        sortOrder = null,
        filter
    ) => {
        ///api/file/load?limit=5&chunk=1&order=asc&search=flowers&type=png&sort=createdAt

        let endpoint = `/api/file/load?limit=99999&chunk=1&`;
        if (searchString) {
            endpoint += `search=${searchString}&`;
        }
        if (sortColumn) {
            endpoint += `sort=${sortColumn}&`;
        }
        if (sortOrder) {
            endpoint += `order=${sortOrder}&`;
        }
        if (filter) {
            endpoint += `type=${filter}`;
        }
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const { files } = await response.json();
            const newMap = new Map();
            files.forEach((f) => {
                newMap.set(f.id, f);
            });
            useStore.getState().setFiles(newMap);
        } catch (err) {
            throw new Error("failed to search files", err);
        }
    },

    connectFiles: async () => {
        if (useStore.getState().selectedFiles.size == 0) {
            useStore
                .getState()
                .setError("Oh no, no files to connect :(", "bad");
            return;
        }
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

                useStore.getState().updateFiles(data.data);
                useStore.getState().unSelectAll();
            }
        } catch (error) {
            console.error(error);
        }
    },

    uploadFiles: async (files, onProgress = null) => {
        //Separate name from each file
        const fileNames = [];
        for (let index = 0; index < files.length; index++) {
            fileNames.push(files[index].name);
        }

        try {
            const response = await fetch(
                `/api/file/upload-helper?count=${files.length}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                console.error(
                    "An error occurred when attempting to fetch from upload-helper"
                );
            }

            const { urls, keys } = await response.json();

            //Push each file to s3
            for (let index = 0; index < files.length; index++) {
                await (async () => {
                    return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open("PUT", urls[index]);

                        xhr.onload = async () => {
                            if (xhr.status === 200) {
                                onProgress
                                    ? onProgress(files[index].name, 100)
                                    : null;
                                await (async () => {
                                    const fileVerResponse = await fetch(
                                        "/api/file/verify",
                                        {
                                            method: "POST",
                                            credentials: "include",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({
                                                keys: [keys[index]],
                                                fileNames: [fileNames[index]],
                                            }),
                                        }
                                    );

                                    if (!fileVerResponse.ok) {
                                        throw new Error(
                                            "An error occurred when verifying your files"
                                        );
                                    }

                                    const { data } =
                                        await fileVerResponse.json();
                                    console.log(data);
                                    useStore.getState().updateFiles(data);
                                })();
                                useStore
                                    .getState()
                                    .setError(
                                        `✅ Uploaded File: ${files[index].name}`,
                                        "good"
                                    );
                                resolve(xhr.responseText);
                            } else {
                                useStore
                                    .getState()
                                    .setError(
                                        `❌ Failed to Upload File: ${files[index].name}`,
                                        "bad"
                                    );
                                reject(new Error("Upload failed"));
                            }
                        };

                        xhr.onerror = () => {
                            useStore.getState().user.ValidateSession();
                            reject(new Error("XHR error"));
                        };

                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable && onProgress) {
                                const percent =
                                    (event.loaded / event.total) * 100;

                                onProgress(files[index].name, percent);
                            }
                        };

                        xhr.send(files[index]);
                    });
                })();
            }
        } catch (error) {
            console.error(error);
        }

        //Now check to see if the files were uploaded successfully and if so, save to db
    },
    deleteFiles: async () => {
        const files = useStore.getState().files;
        const selectedFiles = useStore.getState().selectedFiles;
        try {
            const response = await fetch("/api/file/delete/", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_ids: Array.from(selectedFiles),
                }),
            });

            if (!response.ok) {
                throw new Error("failed to delete files");
            }
            const newFiles = new Map(files);
            Array.from(selectedFiles).forEach((key) => {
                console.log(key);
                newFiles.delete(key);
            });
            useStore.getState().setFiles(newFiles);
        } catch (err) {
            console.error(err);
        }
    },

    Error: {},
    setError: (message, errorType) => {
        set({ Error: { message, errorType } });
    },
}));

export { useStore };