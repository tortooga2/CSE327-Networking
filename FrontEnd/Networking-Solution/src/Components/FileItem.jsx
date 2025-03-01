import React from "react";
import propTypes from "prop-types";

import "./FileItem.css";
import menuIcon from "../assets/Icons/menu.svg";
import plusIcon from "../assets/Icons/plus.svg";

const FileItem = ({
  file = { date: "n/a", name: "n/a", size: "n/a", type: "n/a" },
}) => {
  return (
    <div className={"file-item"}>
      <p>Date: {file.date}</p>
      <p>Name: {file.name}</p>
      <p>Type: {file.type}</p>
      <div className="item-options">
        <div className="menu"> {">"}</div>
      </div>
    </div>
  );
};

FileItem.propTypes = {
  file: propTypes.shape({
    date: propTypes.string,
    name: propTypes.string,
    size: propTypes.string,
    type: propTypes.string,
  }),
};

export default FileItem;
