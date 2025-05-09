import { FaTimes } from "react-icons/fa";
import { useStore } from "../Contexts/ctx.appManager";

const UnselectAllButton = ({ minimal }) => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);
    if (minimal) {
        return (
            <span title="Unselect All" onClick={UnSelectAll} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaTimes size={20} />
            </span>
        );
    }
    return (
        <button
            onClick={UnSelectAll}
            style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#1E0B33",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
            }}
        >
            <FaTimes /> Unselect All ({selectedFiles.size})
        </button>
    );
};

export default UnselectAllButton;