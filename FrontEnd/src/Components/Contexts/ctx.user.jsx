import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(null);

import { useStore } from "./ctx.appManager";

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

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
                    const response = await fetch(`/api/auth/verify`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    if (response.ok) {
                        setSignedIn(true);
                        const data = await response.json();
                        const { email, settings } = data;
                        useStore.getState().setUserProfile({ email });
                        useStore.getState().setUserSettings(settings);
                    } else {
                        const data = await response.json();
                        setSignedIn(false);
                    }
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                }
            },
            SignIn: async (email, password) => {
                if (!validateEmail(email)) {
                    setSignedIn(false);
                    return false;
                }
                try {
                    const response = await fetch(`/api/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ email, password }),
                    });
                    if (response.ok) {
                        setSignedIn(true);
                        return true;
                    }
                    return null;
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                    return null;
                }
            },
            SignOut: async () => {
                try {
                    const response = await fetch(`/api/auth/logout`, {
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
                    return null;
                }
            },
            SignUp: async (email, password) => {
                if (!validateEmail(email)) {
                    setSignedIn(false);
                    return false;
                }
                try {
                    const response = await fetch(`/api/auth/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            email,
                            password,
                            username: email,
                        }),
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

        const isPublicFileRoute = location.pathname.startsWith("/file");
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
