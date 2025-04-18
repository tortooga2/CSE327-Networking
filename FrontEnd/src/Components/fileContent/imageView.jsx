import PropTypes from "prop-types";

const ImageView = ({ src, name }) => {
    return (
        <img
            src={src}
            style={{
                width: "100%",
                height: "auto",
                maxWidth: "1000px",
                borderRadius: "8px",
                display: "block",
            }}
            alt={name}
        />
    );
};

ImageView.propTypes = {
    src: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default ImageView;
