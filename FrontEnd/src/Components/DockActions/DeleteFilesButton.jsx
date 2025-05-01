import { FaTrash } from "react-icons/fa";
import { useStore } from "../Contexts/ctx.appManager";

const DeleteFilesButton = ({ minimal }) => {
    const deleteFiles = useStore((state) => state.deleteFiles);
    const selectedFiles = useStore((state) => state.selectedFiles);
    if (minimal) {
        return (
            <span title="Delete Files" onClick={deleteFiles} style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: selectedFiles.size === 0 ? 0.5 : 1, pointerEvents: selectedFiles.size === 0 ? 'none' : 'auto' }}>
                <FaTrash size={20} />
            </span>
        );
    }
    return (
        <button
            onClick={deleteFiles}
            style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#FFB0B0",
                color: "#1E0B33",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
            }}
            disabled={selectedFiles.size === 0}
        >
            <FaTrash /> Delete
        </button>
    );
};

export default DeleteFilesButton;