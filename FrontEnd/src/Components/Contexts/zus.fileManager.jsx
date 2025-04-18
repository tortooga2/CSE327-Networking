import { create } from "zustand";

const LOCAL_STORAGE_KEY = 'myGlobalMarkdownNote';

const useStore = create((set, get) => ({
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
    updateFile: async (fileId, newData) => {
        set((state) => {
            const updatedFiles = new Map(state.files);
            const existingFiles = updatedFiles.get(fileId);
            if (existingFiles) {
                updatedFiles.set(fileId, { ...existingFiles, ...newData });
            }
            // const filesMap = new Map(state.files);
            // data.forEach((file) => filesMap.set(file.id, file));
            return { files: updatedFiles };
        });
        try {
            const response = await fetch(`/api/file/user/${fileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ note: newData.note }),
            });
            if (!response.ok) {
                console.error('Fail to save note to backend:', response.status);
                return false;
            } else {
                console.log('Note saved to backend successfully');
                const updatedFileData = await response.json();

                set((state) => {
                    const updatedFiles = new Map(state.files);
                    const existingFile = updatedFiles.get(fileId);
                    if (exisitingFile && updatedFileData.data) {
                        updatedFiles.set(fileId, updatedFileData.data);
                    }
                    return { files: updatedFiles };
                });
                return true;
            }
        } catch (error) {
          console.error('Error save note to backend:', error);
          return false;
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
                useStore.getState().updateFile(data.data);
                useStore.getState().unSelectAll();
            }
        } catch (error) {
            console.error(error);
        }
    },
    uploadFiles: async (files) => {
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
                    fileNames: fileNames,
                }),
            });

            const { urls, data } = await response.json();

            for (let index = 0; index < files.length; index++) {
                await fetch(urls[index], {
                    method: "PUT",
                    body: files[index],
                });
            }

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
            // if (response.ok) {
            //     const data = await response.json();
            //     console.log("Data from upload", data);
            //     useStore.getState().updateFile([data.data]);
            //     useStore.getState().unSelectAll();
            // }
        } catch (err) {
            console.log(err);
        }
    },
    deleteFiles: async () => {
        try {
            const response = await fetch("/api/file/delete/", {
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
    globalNote: localStorage.getItem(LOCAL_STORAGE_KEY) || '',

    updateGlobalNote: (newNote) => {
        set({ globalNote: newNote });
        localStorage.setItem(LOCAL_STORAGE_KEY, newNote);
        return true;
    },
    //     try {
    //         const response = await fetch('/api/global-note', {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type' : 'application/json',
    //             },
    //             body: JSON.stringify({ note: newNote}),
    //         });

    //         if (!response.ok) {
    //             console.error('Not bieng able to save the note:', response.status);
    //             return false;
    //         } else {
    //             console.log('Note has been saved!');
    //             const updatedData = await response.json();
    //             set({ globalNote: updatedData.note || newNote });
    //             return true;
    //         }
    //     } catch (error) {
    //         console.error('Error save global note to backend:', error);
    //         return false;
    //     }
    // },

    loadGlobalNote: () => {
        const savedNote = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
        set({ globalNote: savedNote});
    },
}));

export { useStore };