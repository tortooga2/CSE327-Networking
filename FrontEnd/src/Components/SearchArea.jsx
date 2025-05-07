import { useEffect, useRef, useState } from "react";

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

    const searchFiles = useStore((state) => state.searchFiles);
    const LoadFiles = useStore((state) => state.loadFiles);

    const [searchValue, setSearchValue] = useState("");
    const [filter, setFilter] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {
        if (searchValue == "") {
            LoadFiles();
        } else {
            searchFiles(searchValue);
        }
    }, [searchValue]);

    return (
        <div
            style={{
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
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
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
        </div>
    );
};

export default SearchArea;
