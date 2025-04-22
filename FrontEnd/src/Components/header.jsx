import { useState } from "react";
import VerticalDiv from "./UILayout/VerticalDiv";
import Button from "./Button/Button";
import UserButton from "./UserButton";
import HorizontalDiv from "./UILayout/HorizontalDiv";

import { FaCog } from "react-icons/fa";

import { FaFile } from "react-icons/fa";

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const buttonStyle = {
        border: "1px solid black",
        borderRadius: "0.5rem",
        padding: "0.5rem",
        position: "relative",
        overflow: "hidden",
        width: "80%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    };

    const buttonClickStyle = {
        backgroundColor: "#E2E8F0",
        color: "#000",
    };

    return (
        <div
            style={{
                border: "1px solid black",
                borderRadius: "0.5rem",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                height: "fit-content",
            }}
        >
            <div
                style={{
                    textAlign: "right",
                    width: "100%",
                    padding: "1rem",
                    fontWeight: "900",
                    fontSize: "1.5rem",
                }}
            >
                ConnectWork
            </div>
            <div>
                <UserButton username="John Doe" />
            </div>
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "left",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                }}
            >
                <Button style={buttonStyle} hover={buttonClickStyle}>
                    {" "}
                    <FaCog />
                    Settings
                </Button>
                <Button style={buttonStyle} hover={buttonClickStyle}>
                    <FaFile />
                    File
                </Button>
                <Button style={buttonStyle} hover={buttonClickStyle}>
                    Help
                </Button>
            </div>
        </div>
    );
};

export default Header;
