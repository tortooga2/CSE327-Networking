import { useEffect, useState } from "react";
import { useStore } from "./Contexts/ctx.appManager";

const ErrorPopup = () => {
    const error = useStore((state) => state.Error);

    const styleHidden = {
        bottom: "-6rem",
    };

    const styleShow = {
        bottom: "1.5rem",
    };

    const [style, setStyle] = useState(styleHidden);

    useEffect(() => {
        if (!error.errorType) {
            return;
        }
        let newStyle = { ...styleShow };
        if (error.errorType == "bad") {
            newStyle = {
                ...newStyle,
                color: "red",
                backgroundColor: "rgb(255, 163, 163)",
            };
        }
        if (error.errorType == "good") {
            newStyle = {
                ...newStyle,
                color: "green",
                backgroundColor: "rgb(199, 255, 193)",
            };
        }
        setStyle(newStyle);
        //wait some time
        const timer = setTimeout(() => {
            setStyle({ ...newStyle, ...styleHidden });
        }, 2000); // wait 2 seconds (or whatever duration you want)

        return () => clearTimeout(timer);
    }, [error]);

    return (
        <div
            style={{
                position: "absolute",
                left: "1.5rem",
                zIndex: "10000",
                padding: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                border: "1px solid var(--border-color)",
                maxWidth: "350px",
                overflowX: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                borderRadius: "0.5rem",
                ...style,
                transition: "bottom 0.2s ease-in-out",
            }}
        >
            {error.message}
        </div>
    );
};

export default ErrorPopup;
