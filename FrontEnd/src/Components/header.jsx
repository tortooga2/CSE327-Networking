import { useState } from "react";

export const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div
                className="table-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                }}
            >
                <h1
                    style={{
                        color: "#1E0B33",
                        fontSize: "24px",
                        fontWeight: "600",
                        margin: 0,
                    }}
                >
                    Files
                </h1>
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid #E2E8F0",
                        width: "240px",
                        fontSize: "14px",
                    }}
                />
            </div>
        </>
    );
};
