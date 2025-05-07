import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";

import { FaCopy } from "react-icons/fa";

import Button from "../Button/Button";

import { useStore } from "../Contexts/ctx.appManager";

const Header = () => {
    const checkboxRef = useRef(null);

    const isLayout = useStore((state) => {
        return state.layoutState === 0;
    });

    return (
        <div
            className={"file-row"}
            style={{
                display: "flex",
                justifyContent: "space-evenly",
                padding: "0.5rem 0.5rem",
                backgroundColor: "#ffffff00",
                transition: "background-color 0.2s, padding 0.2s ease-in-out",
                cursor: "pointer",
                alignItems: "center",
                gap: "min(10rem, 3rem)",
                minWidth: "30vw",
                borderRadius: "0",
                borderBottom: "1px solid var(--text-color)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    width: "3rem",
                    minWidth: "3rem",
                    height: "100%",
                }}
            ></div>
            <div
                style={{
                    flexShrink: "0",
                    width: "15rem",
                }}
            >
                Created At
            </div>
            <div
                style={{
                    minWidth: "5rem",
                    width: "8rem",
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                Type
            </div>
            {isLayout ? (
                <div
                    style={{
                        width: "10rem",
                        minWidth: "10rem",
                    }}
                >
                    Creator
                </div>
            ) : null}
            {isLayout ? (
                <div
                    style={{
                        textWrap: "nowrap",
                        minWidth: "15rem",
                        width: "15rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    Name
                </div>
            ) : null}
            <div
                style={{
                    width: "19rem",
                }}
            >
                Url
            </div>
            <div
                style={{
                    height: "100%",
                    minWidth: "5rem",
                }}
            ></div>
        </div>
    );
};

Header.propTypes = {
    fileData: propTypes.object,
};

export default Header;