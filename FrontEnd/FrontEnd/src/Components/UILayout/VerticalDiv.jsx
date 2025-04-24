import { useEffect, useState } from "react";

const VerticalDiv = ({
    width = "100%",
    height = "100%",
    color = "rgba(0, 0, 0, 0)",
    padding = "1rem",
    gap = "1rem",
    style = {},
    children,
    playAnimation = false,
    before = {},
    after = {},
}) => {
    const mainStyle = {
        flexShrink: width.includes("px") ? 0 : 1, // Don't shrink fixed-width divs
        width,
        minWidth: width.includes("px") ? width : "auto", // Ensure fixed widths are respected
        height,
        minHeight: height.includes("px") ? width : "auto", // Ensure fixed widths are respected
        display: "flex",
        flexDirection: "column",
        backgroundColor: color,
        overflowY: "auto",
        scrollbarWidth: "none", // padding: "1rem",
        boxSizing: "border-box",
        gap: gap,
        border: `${padding} solid ${color}`,
        ...style,
    };
    const [styleState, setStyleState] = useState({
        ...mainStyle,
        ...before,
    });
    const [isTransitioning, setIsTransitioning] = useState(playAnimation);

    useEffect(() => {
        setIsTransitioning(playAnimation);
    }, [playAnimation]);

    useEffect(() => {
        if (isTransitioning) {
            setStyleState({
                ...mainStyle,
                ...after,
            });
        } else {
            setStyleState({
                ...mainStyle,
                ...before,
            });
        }
    }, [isTransitioning]);

    return (
        <div
            style={{
                ...styleState,
            }}
        >
            {children}
        </div>
    );
};

export default VerticalDiv;
