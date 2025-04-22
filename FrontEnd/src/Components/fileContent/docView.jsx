import PropTypes from "prop-types";
import { useState } from "react";
import { useStore } from "../Contexts/zus.fileManager";

const docView = ({ src }) => {
    const [loaded, setLoaded] = useState(false);
    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });
    const fileSrc = src + "#view=FitH";

    const beforeLoad = {
        opacity: 0,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    const afterLoad = {
        opacity: 1,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    return (
        <div>
            <object
                className={"content" + (loaded ? " loaded" : "")}
                style={{
                    width: "80%",
                    aspectRatio: "1/1.3",
                    maxWidth: "1000px",
                    ...(loaded && closedFile ? afterLoad : beforeLoad),
                    borderRadius: "1rem",
                    margin: "0 auto",
                }}
                onLoad={() => setLoaded(true)}
                data={fileSrc}
            >
                <p>
                    {"Your browser doesn't support PDF viewing."}
                    <a href={fileSrc}>Download instead</a>
                </p>{" "}
            </object>
        </div>
    );
};

docView.propTypes = {
    src: PropTypes.string.isRequired,
};

export default docView;
