import PropTypes from "prop-types";
import VerticalDiv from "../UILayout/VerticalDiv";
import { FileType } from "../Tags";
import { getFileUrl } from "../scripts/fileUrlFuncs";
import { useState } from "react";

import { useStore } from "../Contexts/ctx.appManager.jsx";

const BundleView = ({ children }) => {
    return (
        <VerticalDiv>
            {Array.isArray(children)
                ? children.map((child, index) => {
                      return (
                          <div
                              key={child.id}
                              style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  padding: "1rem 0.5rem",
                                  borderRadius: "0.5rem",
                              }}
                              className="hover-thing"
                              onClick={() => {
                                  useStore
                                      .getState()
                                      .setPreviewedFile(child.id);
                              }}
                          >
                              <p>{child.id}</p>
                              {FileType(child.name, () => {})}
                              <a href={getFileUrl(child.id)}>
                                  {getFileUrl(child.id)}
                              </a>
                              <p>{child.createdAt}</p>
                          </div>
                      );
                  })
                : null}
        </VerticalDiv>
    );
};

export default BundleView;
