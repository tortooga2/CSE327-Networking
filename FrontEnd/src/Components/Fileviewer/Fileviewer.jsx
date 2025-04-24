import { useState, useEffect, useMemo } from "react";

import File from "./File/File.jsx";
import { useStore } from "../Contexts/ctx.appManager.jsx";
import { CompareFuncs } from "../scripts/compareFuncs.js"; //Object that includes function prototypes for our compare functions.

import VerticalDiv from "../UILayout/VerticalDiv";

const FileViewer = ({ width }) => {
    const files = useStore((state) => state.files);
    const sortOrder = useStore((state) => state.sortOrder); //sortOrder is a json object that includes the field, as well as the order.

    useEffect(() => {
        const loadFiles = async () => {
            await useStore.getState().loadFiles();
        };
        loadFiles();
    }, []);

    //Get files and sort then when ever the state of our files updates.
    const fileEntries = useMemo(() => {
        const fileArray = Array.from(files.values());

        fileArray.sort(CompareFuncs[sortOrder.field](sortOrder)); //will be replaced once we update the endpoint, but for right now it works.
        //see we get the function protype using the field as a key, then we pass along the sortOrder itself to contruct the final (a, b) => {} function.

        return fileArray;
    }, [files, sortOrder]);

    return (
        <VerticalDiv gap="0rem" width={width} padding="0rem">
            {fileEntries.map(
                (
                    fileData,
                    index //map app files to a file component.
                ) => (
                    <File key={index} fileData={fileData} />
                )
            )}
        </VerticalDiv>
    );
};

export default FileViewer;
