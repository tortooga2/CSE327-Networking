import { useState } from "react";
import propTypes from "prop-types";
import "./File.css";

const File = ({ fileData }) => {
    const fileContent = useState(fileData);

    return (
        <div>
            <div className="file-item">
                <p>id: {fileContent[0].id}</p>
                <p>
                    Date:{" "}
                    {(() => {
                        const date = fileContent[0].createdAt;

                        return date;
                    })()}
                </p>

                <p>Type: {fileContent[0].type}</p>
                <p>Owner: {fileContent[0].owner_id}</p>
                <p>File: {fileContent[0].name}</p>
            </div>
        </div>
    );
};

File.propTypes = {
    fileData: propTypes.object,
};

export default File;
