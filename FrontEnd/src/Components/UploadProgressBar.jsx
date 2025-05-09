import React from "react";
import PropTypes from "prop-types";
import "./UploadProgressBar.css";

const UploadProgressBar = ({ progress }) => (
    <div className="upload-progress-bar">
        <div
            className="upload-progress-bar__fill"
            style={{ width: `${progress}%` }}
        />
        <span className="upload-progress-bar__text">{progress}%</span>
    </div>
);

UploadProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
};

export default UploadProgressBar;
