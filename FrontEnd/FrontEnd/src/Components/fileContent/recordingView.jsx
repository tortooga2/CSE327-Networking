import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { useStore } from "../Contexts/ctx.appManager";

const RecordingView = ({ src }) => {
    const [loaded, setLoaded] = useState(false);
    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });
    const fileSrc = src;

    const videoRef = useRef(null);

    const beforeLoad = {
        opacity: 0,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    const afterLoad = {
        opacity: 1,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    useEffect(() => {
        if (!closedFile) {
            videoRef.current?.pause();
        }
    }, [closedFile]);

    return (
        <div
            style={{
                height: "100%",
            }}
        >
            <video
                ref={videoRef}
                className={"content" + (loaded ? " loaded" : "")}
                style={{
                    ...(loaded && closedFile ? afterLoad : beforeLoad),
                    margin: "0 auto",
                    // maxWidth: "30vw",
                    // width: "30vw",
                    // minHeight: "40vh",
                    // maxHeight: "100%",
                    opacity: "1",
                    borderRadius: "0.5rem",
                }}
                controls
                src={fileSrc}
            />
        </div>
    );
};

RecordingView.propTypes = {
    src: PropTypes.string.isRequired,
};

export default RecordingView;