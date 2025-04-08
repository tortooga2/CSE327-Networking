import "./Button.css";
import propTypes from "prop-types";
import { useState } from "react";

const Button = ({
  children,
  onClick = () => {
    console.log("Button clicked");
  },
  style = {
    width: "fit-content",
    color: "var(--secondary-color)",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    transition: "all 0.1s ease-in-out",
  },
  hover = {
    backgroundColor: "var(--secondary-color)",
    color: "var(--primary-color)",
    transition: "all 0.1s ease-in-out",
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
      onClick={onClick}
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
