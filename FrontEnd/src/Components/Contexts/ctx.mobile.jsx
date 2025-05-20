import { createContext, useContext, useState, useEffect } from "react";

const MobileContext = createContext();

export const MobileProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const value = {
        isMobile,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSearchOpen,
        setIsSearchOpen
    };

    return (
        <MobileContext.Provider value={value}>
            {children}
        </MobileContext.Provider>
    );
};

export const useMobile = () => {
    const context = useContext(MobileContext);
    if (!context) {
        throw new Error('useMobile must be used within a MobileProvider');
    }
    return context;
};
