import { useState } from "react";
import VerticalDiv from "./UILayout/VerticalDiv";
import Button from "./Button/Button";
import UserButton from "./UserButton";
import HorizontalDiv from "./UILayout/HorizontalDiv";

import { FaCog, FaLink } from "react-icons/fa";

import { FaFile } from "react-icons/fa";
import { useStore } from "./Contexts/ctx.appManager";
import { useUser } from "./Contexts/ctx.user";
import UtcClock from "./UTCClock";

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const { email } = useStore((state) => state.userProfile);

    const user = useUser();

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
                // border: "1px solid",
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
                    textAlign: "left",

                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    fontWeight: "900",
                    fontSize: "2rem",
                    backgroundColor: "var(--secondary-color)",
                    color: "var(--bundle-color-2)",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                }}
            >
                <FaLink />
                ConnectWork
            </div>
            <div>
                <UtcClock
                    style={{
                        color: "var(--text-color)",
                        opacity: "0.5",
                        fontSize: "small",
                        marginBottom: "2rem",
                    }}
                />
            </div>
            <div>
                <UserButton username={email} />
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
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        useStore.getState().setLayoutState(3);
                    }}
                >
                    {" "}
                    <FaCog />
                    Settings
                </Button>
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        useStore.getState().setLayoutState(4);
                    }}
                >
                    <FaFile />
                    File
                </Button>
                <Button>Help</Button>
            </div>
        </div>
    );
};

export default Header;
