import PropTypes from "prop-types";
import VerticalDiv from "../UILayout/VerticalDiv";
import { FileType } from "../Tags";
import { getFileUrl } from "../scripts/fileUrlFuncs";

const BundleView = ({ children }) => {
    console.log("BundleView", children);

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
