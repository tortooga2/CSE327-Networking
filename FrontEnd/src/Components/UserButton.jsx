import { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";

import { FaUserCircle } from "react-icons/fa";

import { useUser } from "../Components/Contexts/ctx.user";
import { useStore } from "./Contexts/ctx.appManager";

const UserButton = ({ username }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [logoutHovered, setLogoutHovered] = useState(false);

    const { user } = useUser();

    return (
        <div
            style={{
                // border: "1px solid black",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                position: "relative",
                overflow: "hidden",
                width: "60%",
            }}
        >
            {/* Username */}
            <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <FaUserCircle size={20} />
                <div>
                    {username}
                </div>
            </div>
            {/* Logout Button */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "0.3rem",
                    borderRadius: "0.3rem",

                    zIndex: 1000,
                    ...(isHovered
                        ? { pointerEvents: "auto", right: "0.3rem" }
                        : { pointerEvents: "none", right: "-2.0rem" }),
                    ...(logoutHovered
                        ? {
                            backgroundColor: "#ffc2c3",
                            color: "#f52727",
                            borderColor: "#f52727",
                        }
                        : {}),
                    transition: "right 0.2s, background-color 0.2s",

                    cursor: "pointer",
                }}
                onMouseEnter={() => {
                    setLogoutHovered(true);
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    setLogoutHovered(false);
                    setIsHovered(false);
                }}
                onClick={() => {
                    user.SignOut();
                }}
            >
                <IoLogOutOutline size={20} />
            </div>
        </div>
    );
};
export default UserButton;
