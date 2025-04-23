import PropTypes from "prop-types";
import { useState } from "react";
import { useStore } from "../Contexts/zus.fileManager";

const docView = ({ src }) => {
    const [loaded, setLoaded] = useState(false);
    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });
    const fileSrc = `https://docs.google.com/gview?url=${encodeURIComponent(
        src
    )}&embedded=true`;

    const beforeLoad = {
        opacity: 0,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    const afterLoad = {
        opacity: 1,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    return (
        <div
            style={{
                height: "100%",
            }}
        >
            <object
                className={"content" + (loaded ? " loaded" : "")}
                style={{
                    ...(loaded && closedFile ? afterLoad : beforeLoad),
                    margin: "0 auto",
                    maxWidth: "30vw",
                    width: "30vw",
                    aspectRatio: "1/1.2",
                    opacity: "1",
                }}
                onLoad={() => setLoaded(true)}
                data={fileSrc}
            />
        </div>
    );
};

docView.propTypes = {
    src: PropTypes.string.isRequired,
};

export default docView;
