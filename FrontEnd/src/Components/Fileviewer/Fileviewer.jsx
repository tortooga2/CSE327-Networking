import { useState, useEffect, useMemo } from "react";

import File from "./File/File.jsx";
import { useStore } from "../Contexts/zus.fileManager";

import VerticalDiv from "../UILayout/VerticalDiv";

const FileViewer = ({ width }) => {
    const files = useStore((state) => state.files);
    const updateFile = useStore((state) => state.updateFiles); // Assuming you have an updateFile action

    useEffect(() => {
        const loadFiles = async () => {
            await useStore.getState().loadFiles();
        };
        loadFiles();
    }, []);

    const fileEntries = useMemo(() => Array.from(files), [files]);

    return (
        <VerticalDiv gap="0rem" width={width} padding="0rem">
            {fileEntries.map(([key, fileData]) => (
                <File key={key} fileData={fileData} />
            ))}
        </VerticalDiv>
    );
};

export default FileViewer;
