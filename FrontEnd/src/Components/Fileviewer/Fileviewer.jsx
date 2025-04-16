import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import "./FileViewer.css";
import File from "./File";
import { useStore } from "../Contexts/zus.fileManager";

import VerticalDiv from "../UILayout/VerticalDiv";

const FileViewer = ({ width }) => {
    const [sortConfig, setSortConfig] = useState({
        key: "createdAt",
        direction: "desc",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [notes, setNotes] = useState({}); // State to store notes for each file

    const files = useStore((state) => state.files);
    const updateFile = useStore((state) => state.updateFiles); // Assuming you have an updateFile action

    useEffect(() => {
        const loadFiles = async () => {
            await useStore.getState().loadFiles();
        };
        loadFiles();
    }, []);

    useEffect(() => {
        if (files && files.length > 0) {
            const initialNotes = {};
            files.forEach((file) => {
                initialNotes[file.id] = file.note || "";
            });
            setNotes(initialNotes);
        }
    }, [files]);

    const handleNoteChange = (fileId, event) => {
        const newNotes = { ...notes, [fileId]: event.target.value };
        setNotes(newNotes);
        const updatedFiles = files.map((file) =>
            file.id === fileId ? { ...file, note: event.target.value } : file
        );
        useStore.getState().setFiles(updatedFiles);
        if (updateFile) {
            updateFile(fileId, { note: event.target.value });
        } else {
            console.warn("updateFile action not available in Zustand store.");
        }
    };

    const fuseOptions = {
        keys: [
            { name: "name", weight: 2 },
            { name: "type", weight: 1 },
            { name: "creator_username", weight: 1 },
        ],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 1,
        shouldSort: true,
        findAllMatches: true,
        ignoreLocation: false,
        includeScore: true,
        location: 0,
        maxPatternLength: 32,
    };

    const fuse = useMemo(() => {
        const currentFiles = useStore.getState().getFiles();
        return new Fuse(currentFiles, fuseOptions);
    }, [files]);

    const sortData = (data, key, direction) => {
        return [...data].sort((a, b) => {
            if (key === "createdAt") {
                return direction === "asc"
                    ? new Date(a[key]) - new Date(b[key])
                    : new Date(b[key]) - new Date(a[key]);
            }
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return "↓";
        }
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    const filteredAndSortedFiles = () => {
        let resultFiles = useStore.getState().getFiles();

        if (searchTerm) {
            const searchResults = fuse.search(searchTerm);
            searchResults.sort((a, b) => a.score - b.score);
            resultFiles = searchResults.map((result) => result.item);
            return resultFiles;
        }

        return sortData(resultFiles, sortConfig.key, sortConfig.direction);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <VerticalDiv
            gap="0rem"
            width={width}
            padding="0rem"
            style={{ borderRadius: "1rem" }}
        >
            <div
                className="table-header-row"
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "50px 180px 120px 150px 1fr 200px 120px",
                    padding: "16px 24px",
                    backgroundColor: "#1E0B33",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "14px",
                }}
            >
                <div
                    onClick={() => handleSort("id")}
                    style={{ cursor: "pointer" }}
                >
                    ID {getSortIcon("id")}
                </div>
                <div
                    onClick={() => handleSort("createdAt")}
                    style={{ cursor: "pointer" }}
                >
                    Date {getSortIcon("createdAt")}
                </div>
                <div
                    onClick={() => handleSort("type")}
                    style={{ cursor: "pointer" }}
                >
                    Type {getSortIcon("type")}
                </div>
                <div
                    onClick={() => handleSort("creator_username")}
                    style={{ cursor: "pointer" }}
                >
                    Owner {getSortIcon("creator_username")}
                </div>
                <div
                    onClick={() => handleSort("name")}
                    style={{
                        cursor: "pointer",
                        minWidth: "100px",
                        textWrap: "nowrap",
                        overflowX: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    Name {getSortIcon("name")}
                </div>
                {/* <div style={{ textAlign: "right" }}>Actions</div> */}
            </div>
            <VerticalDiv gap="0rem" padding="0rem">
                {filteredAndSortedFiles().map((file) => (
                    <File key={file.id} fileData={file} />
                ))}
            </VerticalDiv>
        </VerticalDiv>
    );
};

export default FileViewer;
