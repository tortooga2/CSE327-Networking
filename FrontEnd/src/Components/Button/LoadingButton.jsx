import PropTypes from "prop-types";
import "../shared/loading.css";

const LoadingButton = ({
    children,
    onClick,
    isLoading = false,
    disabled = false,
    className = "",
    spinnerSize = "sm"
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`loading-button ${isLoading ? 'loading' : ''} ${className}`}
        >
            {children}
            {isLoading && <div className={`loading-spinner ${spinnerSize}`} />}
        </button>
    );
};

LoadingButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    spinnerSize: PropTypes.oneOf(["sm", "md", "lg"])
};

export default LoadingButton;