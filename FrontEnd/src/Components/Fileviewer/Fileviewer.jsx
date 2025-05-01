import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import File from "./File/File.jsx";
import { useStore } from "../Contexts/ctx.appManager.jsx";
import { CompareFuncs } from "../scripts/compareFuncs.js";
import VerticalDiv from "../UILayout/VerticalDiv";
import { useFileSearch } from "../../features/useFileSearch";

const FileViewer = ({ width }) => {
    const files = useStore((state) => state.files);
    const sortOrder = useStore((state) => state.sortOrder);
    const { searchQuery, searchResults, isSearching } = useFileSearch();

    useEffect(() => {
        const loadFiles = async () => {
            await useStore.getState().loadFiles();
        };
        loadFiles();
    }, []);

    const fileEntries = useMemo(() => {
        if (searchQuery && searchQuery.length >= 2) {
            return searchResults;
        }

        let fileArray = Array.from(files.values());
        fileArray.sort(CompareFuncs[sortOrder.field](sortOrder));
        return fileArray;
    }, [files, sortOrder, searchQuery, searchResults]);

    if (isSearching) {
        return (
            <VerticalDiv gap="0rem" width={width} padding="0rem">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    Searching...
                </div>
            </VerticalDiv>
        );
    }

    return (
        <VerticalDiv gap="0rem" width={width} padding="0rem">
            {fileEntries.length > 0 ? (
                fileEntries.map((fileData) => (
                    <File key={fileData.id} fileData={fileData} />
                ))
            ) : (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem',
                    color: 'var(--text-color)'
                }}>
                    {searchQuery ? 'No files found matching your search' : 'No files available'}
                </div>
            )}
        </VerticalDiv>
    );
};

FileViewer.propTypes = {
    width: PropTypes.string
};

export default FileViewer;
