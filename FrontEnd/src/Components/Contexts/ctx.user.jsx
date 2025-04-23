import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(null);

import { useStore } from "./zus.fileManager";

export const UserProvider = ({ children }) => {
    const [signedIn, setSignedIn] = useState(false);
    const navigate = useNavigate();

    const user = useMemo(
        () => ({
            isSignedIn: () => {
                return signedIn;
            },
            setSignedIn,

            ValidateSession: async () => {
                try {
                    const response = await fetch(`api/auth/verify/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    if (response.ok) {
                        setSignedIn(true);
                        const data = await response.json();
                        const { username_base, username_suffix } = data;
                        console.log(data);
                        useStore
                            .getState()
                            .setUserProfile({ username_base, username_suffix });
                    } else {
                        const data = await response.json();
                        console.log(data);
                        setSignedIn(false);
                    }
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                }
            },
            SignIn: async (email, password) => {
                try {
                    const response = await fetch(`api/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ email, password }),
                    });
                    if (response.ok) {
                        setSignedIn(true);
                    }
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                }
            },
            SignOut: async () => {
                try {
                    const response = await fetch(`api/auth/logout`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    if (response.ok) {
                        setSignedIn(false);
                    }
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                }
            },
            SignUp: async (username, email, password) => {
                try {
                    const response = await fetch(`api/auth/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ email, password, username }),
                    });
                    if (response.ok) {
                        user.ValidateSession();
                    }
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                }
            },
        }),
        [signedIn]
    );

    useEffect(() => {
        user.ValidateSession();

        const isPublicFileRoute = location.pathname.startsWith("/file/");
        if (!isPublicFileRoute) {
            if (!signedIn) {
                navigate("/");
            } else {
                navigate("/app");
            }
        }
    }, [signedIn, user, navigate]);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
    children: PropTypes.node,
};

export const useUser = () => {
    const user = useContext(UserContext);
    return { user };
};
