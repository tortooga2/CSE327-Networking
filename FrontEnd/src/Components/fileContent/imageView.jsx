import PropTypes from "prop-types";

const ImageView = ({ src, name }) => {
    return (
        <img
            src={src}
            style={{
                width: "100%",


                borderRadius: "var(--border-radius)",
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
