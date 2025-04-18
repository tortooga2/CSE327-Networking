import PropTypes from "prop-types";
import { useState } from "react";

const docView = ({ src }) => {
    const [loaded, setLoaded] = useState(false);
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
        <object
            className={"content" + (loaded ? " loaded" : "")}
            style={{
                width: "200%",
                aspectRatio: "1/1.3",
                maxWidth: "1000px",
                ...(loaded ? afterLoad : beforeLoad),
                border: "none",
            }}
            onLoad={() => setLoaded(true)}
            data={fileSrc}
        />
    );
};

docView.propTypes = {
    src: PropTypes.string.isRequired,
};

export default docView;
