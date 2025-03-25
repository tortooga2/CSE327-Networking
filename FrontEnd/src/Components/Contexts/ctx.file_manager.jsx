import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';


const FileManagerContext = createContext(null);

export const FileManagerProvider = ({ children }) => {

    const fileManager = useMemo(() => ({}), []);


    return (
        <FileManagerContext.Provider value={{ fileManager }}>
            {children}
        </FileManagerContext.Provider>
    )
}


FileManagerProvider.propTypes = {
    children: PropTypes.node.isRequired
};



export const useFileManager = () => {
    const { fileManager } = useContext(FileManagerContext);
    return { fileManager };
};
