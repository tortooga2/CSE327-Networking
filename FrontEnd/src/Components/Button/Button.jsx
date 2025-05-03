import "./Button.css";
import propTypes from "prop-types";
import { useState } from "react";

const Button = ({
    children,
    onClick = () => {
        console.log("Button clicked");
    },
    style = {
        // border: "1px solid var(--primary-color)",
        backgroundColor: "transparent",
        borderRadius: "0.5rem",
        padding: "0.5rem",
        position: "relative",
        overflow: "hidden",
        width: "fit-content",
        minWidth: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    },
    hover = {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    click = {},
    disabled = false,
}) => {
    style = {
        ...style,
        userSelect: "none",
        cursor: "pointer",
        width: "fit-content",
    };

    const [styleState, setStyleState] = useState(style);

    const onMouseEnter = () => {
        setStyleState({ ...style, ...hover });
    };

    const onMouseLeave = () => {
        setStyleState(style);
    };

    const onMouseDown = () => {
        setStyleState({ ...style, ...click });
    };

    const onMouseUp = () => {
        setStyleState({ ...style, ...hover });
    };

    return (
        <p
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onClick={(e) => onClick(e)}
            style={styleState}
            disabled={disabled}
        >
            {children}
        </p>
    );
};

Button.propTypes = {
    children: propTypes.node.isRequired,
    onClick: propTypes.func,
    style: propTypes.object,
    hover: propTypes.object,
    click: propTypes.object,
    disabled: propTypes.bool,
};

export default Button;
