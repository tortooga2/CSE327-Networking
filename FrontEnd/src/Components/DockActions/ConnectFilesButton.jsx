import { FaLink } from "react-icons/fa";
import { useStore } from "../Contexts/ctx.appManager";

const ConnectFilesButton = ({ minimal }) => {
    const connectFiles = useStore((state) => state.connectFiles);
    if (minimal) {
        return (
            <span title="Connect Files" onClick={connectFiles} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaLink size={20} />
            </span>
        );
    }
    return (
        <button
            onClick={connectFiles}
            style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#C8B0FF",
                color: "#1E0B33",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
            }}
        >
            <FaLink /> Connect Files
        </button>
    );
};

export default ConnectFilesButton;