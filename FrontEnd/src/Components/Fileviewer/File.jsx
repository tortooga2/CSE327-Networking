import { useState } from "react";
import propTypes from "prop-types";
import "./File.css";

const File = ({ fileData }) => {
    const fileContent = useState(fileData);

    console.log(fileContent);

    return (
        <div>
            <div className="file-item">
                <p>
                    Date:{" "}
                    {(() => {
                        const date = new Date(fileContent[0].dateCreated);

                        date.toLocaleTimeString();
                        return date.toLocaleDateString();
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
