import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from "react";
import PropTypes from "prop-types";

const FileManagerContext = createContext(null);

export const FileManagerProvider = ({ children }) => {
    const [files, setFiles] = useState([]);
    const [subscribers, setSubscribers] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);

    const addFile = (file) => {
        const filesArray = selectedFiles;
        if (filesArray.includes(file)) {
            filesArray.splice(filesArray.indexOf(file), 1);
        } else {
            filesArray.push(file);
        }
        setSelectedFiles([...filesArray]);
    };

    useEffect(() => {
        console.log("Selected files", selectedFiles);
    }, [selectedFiles]);

    const getUsersFiles = async () => {
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
                const filesArray = Array.isArray(data.data) ? data.data : [];
                filesArray.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setFiles(filesArray);
                console.log("Files in context", filesArray);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filesRef = useRef(files);
    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const subscribe = useCallback((callback) => {
        setSubscribers((prev) => [...prev, callback]);
        return () => {
            setSubscribers((prev) => prev.filter((cb) => cb !== callback));
        };
    }, []);

    const notifySubscribers = useCallback((newFiles = filesRef.current) => {
        // Use current subscribers directly within the callback
        setSubscribers((currentSubscribers) => {
            currentSubscribers.forEach((cb) => cb(newFiles));
            return currentSubscribers;
        });
    }, []); // No dependencies needed

    const updateFiles = (data) => {
        const filesMap = new Map();
        files.forEach((file) => filesMap.set(file.id, file));
        data.forEach((file) => filesMap.set(file.id, file));
        const filesArray = Array.from(filesMap.values());
        filesArray.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setFiles(filesArray);
        notifySubscribers(filesArray);
    };

    const TestFunction = async () => {
        try {
            const response = await fetch("/api/file/createtest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = (await response.json()).data;
                console.log(data);
                updateFiles([data]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const ConnectFiles = async () => {
        try {
            const response = await fetch("/api/file/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ file_ids: selectedFiles }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                updateFiles(data.data);
                setSelectedFiles([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fileManager = useMemo(
        () => ({
            files,
            setFiles,
            loadFiles: getUsersFiles,
            subscribe,
            notifySubscribers,
            TestFunction,
            addFile,
            selectedFiles,
            ConnectFiles,
        }),
        [files, subscribe, notifySubscribers]
    );

    useEffect(() => {
        getUsersFiles();
    }, []);

    return (
        <FileManagerContext.Provider value={{ fileManager }}>
            {children}
        </FileManagerContext.Provider>
    );
};

FileManagerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useFileManager = () => {
    const { fileManager } = useContext(FileManagerContext);
    return { fileManager };
};
