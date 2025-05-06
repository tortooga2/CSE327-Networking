import { useEffect, useRef } from "react";

import {
    FaUpload,
    FaLink,
    FaTimes,
    FaTrash,
    FaStickyNote,
    FaSearch,
    FaSort,
    FaFilter,
} from "react-icons/fa";
import { useStore } from "./Contexts/ctx.appManager";

// import NoteCreation from "./NoteCreation";
import VerticalDiv from "./UILayout/VerticalDiv";

import NoteCreation from "./NoteCreation";
import Button from "./Button/Button";

const SearchArea = () => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);
    const connectFiles = useStore((state) => state.connectFiles);
    const uploadFile = useStore((state) => state.uploadFiles);

    const deleteFiles = useStore((state) => state.deleteFiles);

    const formRef = useRef(null);

    useEffect(() => {
        if (!formRef.current) {
            return;
        }
        formRef.current.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fileInput = e.target.querySelector('input[type="file"]');
            const files = fileInput.files;
            if (!files || files.length === 0) {
                console.error("No files selected");
                return;
            }

            try {
                await uploadFile(files);
                //             let filesArray = [];
                //             try {
                //                 for (let i = 0; i < files.length; i++) {
                //                     const file = files[i];
                //                     console.log("Uploading file:", file.name);
                //                     const fileResponse = await uploadFile(file);
                //                     filesArray.push(fileResponse);
                //                 }

                fileInput.value = "";

                alert("Files uploaded successfully!");
            } catch (error) {
                console.error("Error during upload:", error);
                alert("Error uploading files. Please try again.");
            }
        });
    }, [uploadFile]);

    return (
        <div
            style={{
                // border: "1px solid",
                // borderRadius: "1rem",
                // borderImageSlice: 1,
                // borderImageSource:
                //     "linear-gradient(130deg, #FFEEDB 60%, #dd614a)",
                padding: "1rem",

                gap: "1rem",
                flexDirection: "column",
                justifyContent: "space-between",
                display: "flex",
            }}
        >
            <div
                style={{
                    padding: "0.5rem",
                    // border: "1px solid var(--text-color)",
                    // borderRadius: "0.5rem",
                    borderBottom: "1px solid var(--text-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                <Button>
                    <FaSearch />
                </Button>
                <input
                    type="search"
                    placeholder="Search by name"
                    style={{ width: "100%", outline: "none" }}
                />
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                <Button onClick={UnSelectAll} style={{}}>
                    <FaTimes /> Unselect All ({selectedFiles.size})
                </Button>
                <Button>
                    <FaSort /> Sort
                </Button>
                <Button>
                    <FaFilter /> Filter
                </Button>
            </div>
            {/* <form
                id="fileForm"
                ref={formRef}
                style={{
                    padding: "1.5rem",
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    border: "1px solid black",
                }}
            >
                <input
                    type="file"
                    style={{
                        padding: "0.75rem",
                        border: "1px solid black",
                        borderRadius: "6px",
                        width: "100%",
                        fontSize: "0.9rem",
                        backgroundColor: "#F7FAFC",
                        marginBottom: "1rem",
                    }}
                    multiple
                />
                <button
                    type="submit"
                    style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "#8BFFB0",
                        color: "#1E0B33",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        width: "100%",
                        fontSize: "0.9rem",
                    }}
                >
                    Upload
                </button>
            </form> */}
        </div>
    );
};

export default SearchArea;
