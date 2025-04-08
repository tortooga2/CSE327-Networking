import { useState, useEffect, useMemo } from "react";
import Fuse from 'fuse.js';
import "./FileViewer.css";
import File from "./File";
import { useStore } from "../Contexts/zus.fileManager";

const FileViewer = () => {
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });
    const [searchTerm, setSearchTerm] = useState('');

    const files = useStore((state) => {
        return state.files;
    });

    useEffect(() => {
        const loadFiles = async () => {
            await useStore.getState().loadFiles();
        };
        loadFiles();
    }, []);

    const fuseOptions = {
        keys: [
            { name: 'name', weight: 2 }, // name matches are more important
            { name: 'type', weight: 1 },
            { name: 'creator_username', weight: 1 }
        ],
        threshold: 0.3, // Lower means more strict matching
        distance: 100, // How far to extend the fuzzy search
        minMatchCharLength: 1, // Updated to allow single-character search
        shouldSort: true,
        findAllMatches: true,
        ignoreLocation: false, // Changed to false to prioritize matches at start
        includeScore: true,
        location: 0, // Added to force matching from the beginning
        maxPatternLength: 32 // Added to limit the pattern length
    };

    const fuse = useMemo(() => {
        const files = useStore.getState().getFiles();
        return new Fuse(files, fuseOptions);
    }, [files]);

    const sortData = (data, key, direction) => {
        return [...data].sort((a, b) => {
            if (key === 'createdAt') {
                return direction === 'asc' 
                    ? new Date(a[key]) - new Date(b[key])
                    : new Date(b[key]) - new Date(a[key]);
            }
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return "↓";
        }
        return sortConfig.direction === 'asc' ? "↑" : "↓";
    };

    const filteredAndSortedFiles = () => {
        let resultFiles = useStore.getState().getFiles();
        
        if (searchTerm) {
            const searchResults = fuse.search(searchTerm);
            // Sort by score (lower score = better match)
            searchResults.sort((a, b) => a.score - b.score);
            resultFiles = searchResults.map(result => result.item);
            // If there's a search term, return results without additional sorting
            return resultFiles;
        }

        // Only apply sort if there's no search term
        return sortData(resultFiles, sortConfig.key, sortConfig.direction);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", backgroundColor: "#FFFFFF" }}>
            <div className="table-container" style={{
                padding: "24px",
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}>
                <div className="table-header" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px"
                }}>
                    <h1 style={{
                        color: "#1E0B33",
                        fontSize: "24px",
                        fontWeight: "600",
                        margin: 0
                    }}>Files</h1>
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid #E2E8F0",
                            width: "240px",
                            fontSize: "14px"
                        }}
                    />
                </div>

                <div className="table-wrapper" style={{
                    backgroundColor: "#F8F6FD",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                }}>
                    <div className="table-header-row" style={{
                        display: "grid",
                        gridTemplateColumns: "50px 180px 120px 150px 1fr 120px",
                        padding: "16px 24px",
                        backgroundColor: "#1E0B33",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "14px"
                    }}>
                        <div onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                            ID {getSortIcon('id')}
                        </div>
                        <div onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                            Date {getSortIcon('createdAt')}
                        </div>
                        <div onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                            Type {getSortIcon('type')}
                        </div>
                        <div onClick={() => handleSort('creator_username')} style={{ cursor: 'pointer' }}>
                            Owner {getSortIcon('creator_username')}
                        </div>
                        <div onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                            Name {getSortIcon('name')}
                        </div>
                        <div style={{ textAlign: "right" }}>Actions</div>
                    </div>

                    <div className="table-body" style={{
                        height: "calc(100% - 52px)",
                        overflowY: "auto"
                    }}>
                        {filteredAndSortedFiles().map((file) => (
                            <File key={file.id} fileData={file} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileViewer;