import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Contexts/ctx.user";

export const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const user = useContext(UserContext);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await user.SignOut();
        navigate("/");
    };

    return (
        <nav style={{
            backgroundColor: "#1E0B33",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
            {/* Logo and Brand */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem"
            }}>
                <h1 style={{
                    fontSize: "1.5rem",
                    margin: 0,
                    fontFamily: "'Playfair Display', serif",
                }}>
                    <span style={{ color: "#cc674b" }}>Bundle</span>
                    <span style={{ fontStyle: "italic" }}>, mio amore</span>
                </h1>
            </div>

            {/* Search Bar */}
            <div style={{
                flex: "0 1 400px"
            }}>
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        width: "100%",
                        fontSize: "0.9rem",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "white",
                        outline: "none"
                    }}
                />
            </div>

            {/* User Menu */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.9rem"
                    }}
                >
                    <span>Menu</span>
                    <span style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                </button>

                {isDropdownOpen && (
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        marginTop: "0.5rem",
                        minWidth: "200px"
                    }}>
                        <div style={{
                            padding: "0.5rem 0",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <button
                                onClick={() => {/* Add settings logic */}}
                                style={{
                                    padding: "0.75rem 1rem",
                                    textAlign: "left",
                                    border: "none",
                                    background: "none",
                                    color: "#1E0B33",
                                    cursor: "pointer",
                                    fontSize: "0.9rem"
                                }}
                            >
                                Settings
                            </button>
                            <button
                                onClick={handleSignOut}
                                style={{
                                    padding: "0.75rem 1rem",
                                    textAlign: "left",
                                    border: "none",
                                    background: "none",
                                    color: "#cc674b",
                                    cursor: "pointer",
                                    fontSize: "0.9rem"
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
