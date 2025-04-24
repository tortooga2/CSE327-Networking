import { create } from "zustand";

const useStore = create((set, get) => ({
    files: new Map(),
    selectedFiles: new Set(),
    previewedFile: null,
    setPreviewedFile: (fileID) => {
        set({ previewedFile: fileID });
    },
    loading: false,
    getFiles: () => {
        return Array.from(get().files.values()).sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    },
    getFileById: (fileID) => {
        const file = get().files.get(fileID);
        if (file) {
            return file;
        }
        return null;
    },
    setFiles: (files) => {
        set({ files: new Map(files.map(file => [file.id, file])) });
        // Save to localStorage
        localStorage.setItem('files', JSON.stringify(Array.from(files.entries())));
    },
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
    loadFiles: async () => {
        set({ loading: true });
        // Load from localStorage
        const savedFiles = localStorage.getItem('files');
        if (savedFiles) {
            const filesArray = JSON.parse(savedFiles);
            set({ files: new Map(filesArray) });
        }
        set({ loading: false });
    },
    updateFiles: (data) => {
        set((state) => {
            const filesMap = new Map(state.files);
            data.forEach((file) => filesMap.set(file.id, file));
            // Save to localStorage
            localStorage.setItem('files', JSON.stringify(Array.from(filesMap.entries())));
            return { files: filesMap };
        });
    },
    connectFiles: async () => {
        const selectedFiles = Array.from(get().selectedFiles);
        // Create a bundle locally
        const bundleFile = {
            id: 'bundle-' + Date.now(),
            name: 'Bundle ' + new Date().toLocaleDateString(),
            type: 'bundle',
            createdAt: new Date().toISOString(),
            creator_username: 'local-user',
            files: selectedFiles.map(id => get().files.get(id))
        };
        get().updateFiles([bundleFile]);
        get().unSelectAll();
    },
    uploadFiles: async (files) => {
        const uploadedFiles = [];
        for (let file of files) {
            const reader = new FileReader();
            await new Promise((resolve) => {
                reader.onload = () => {
                    const fileData = {
                        id: 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                        name: file.name,
                        type: file.type || file.name.split('.').pop(),
                        createdAt: new Date().toISOString(),
                        creator_username: 'local-user',
                        metadata: {
                            url: reader.result
                        }
                    };
                    uploadedFiles.push(fileData);
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        }
        get().updateFiles(uploadedFiles);
    },
    deleteFiles: () => {
        set((state) => {
            const filesMap = new Map(state.files);
            state.selectedFiles.forEach((id) => {
                filesMap.delete(id);
            });
            // Save to localStorage
            localStorage.setItem('files', JSON.stringify(Array.from(filesMap.entries())));
            return { files: filesMap, selectedFiles: new Set() };
        });
    },
}));

export { useStore };
