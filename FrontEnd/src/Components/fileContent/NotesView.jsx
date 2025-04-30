import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useStore } from "../Contexts/ctx.appManager";
import MDEditor from "@uiw/react-md-editor";
import VerticalDiv from "../UILayout/VerticalDiv";

const NotesView = ({ src }) => {
    const [loaded, setLoaded] = useState(false);
    const closedFile = useStore((state) => {
        return state.previewedFile !== null;
    });
    const fileSrc = src;

    const beforeLoad = {
        opacity: 0,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    const afterLoad = {
        opacity: 1,
        transition: "opacity 0.5s ease-in-out 0.5s",
    };

    const [text, setText] = useState("");

    useEffect(() => {
        const getText = async () => {
            try {
                const response = await fetch(src);
                if (!response.ok) {
                    return "Failed to fetch note";
                }
                const text = await response.text();
                return text;
            } catch (err) {
                return err;
            }
        };
        getText().then((newText) => setText(newText));
    }, [src]);

    return (
        <div
            style={{
                height: "100%",
            }}
        >
            <VerticalDiv height={"100%"} style={{ maxHeight: "60vh" }}>
                <MDEditor.Markdown
                    source={text}
                    style={{
                        backgroundColor: "#00000000",
                        color: "var(--text-color)",
                    }}
                />
            </VerticalDiv>
        </div>
    );
};

NotesView.propTypes = {
    src: PropTypes.string.isRequired,
};

export default NotesView;
