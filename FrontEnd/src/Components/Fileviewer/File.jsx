import { useState, useRef, useEffect } from "react";
import propTypes from "prop-types";
import "./File.css";

import { useStore } from "../Contexts/zus.fileManager";

const File = ({ fileData }) => {
    const fileContent = useState(fileData);
    const checkboxRef = useRef(null);
    const isSelected = useStore((state) =>
        state.selectedFiles.has(fileContent[0].id)
    );
    const setIsSelected = useStore((state) => state.selectFile);

    useEffect(() => {
        checkboxRef.current.checked = isSelected;
    }, [isSelected]);

    const handleChange = (e) => {
        setIsSelected(fileContent[0].id, e.target.checked);
    };

    const className = isSelected ? "file-item selected" : "file-item";

    return (
        <tr
            className={className}
            onClick={() => {
                checkboxRef.current.checked = !checkboxRef.current.checked;
                handleChange({
                    target: { checked: checkboxRef.current.checked },
                });
            }}
        >
            <td className="id-column">{fileContent[0].id}</td>
            <td>
                {" "}
                {(() => {
                    const date = fileContent[0].createdAt;

                    const dateObj = new Date(date);
                    const month = dateObj.getMonth() + 1;
                    const day = dateObj.getDate();
                    const year = dateObj.getFullYear();
                    const hour = dateObj.getHours();
                    const minute = dateObj.getMinutes();

                    return `${month}-${day}-${year} ${hour}:${minute}`;
                })()}
            </td>

            <td className="type-column">
                <div className={`${fileContent[0].type}`}>
                    {fileContent[0].type}
                </div>
            </td>
            <td className="owner-column">{fileContent[0].creator_username}</td>
            <td>{fileContent[0].name}</td>
            <td className="checkbox-column">
                <input
                    type="checkbox"
                    ref={checkboxRef}
                    onChange={handleChange}
                />
            </td>
        </tr>
    );
};

File.propTypes = {
    fileData: propTypes.object,
};

export default File;
