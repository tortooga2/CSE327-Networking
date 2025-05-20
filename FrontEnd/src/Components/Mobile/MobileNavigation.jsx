import { Menu, Search, X } from "lucide-react";
import { useMobile } from "../Contexts/ctx.mobile";
import { useStore } from "../Contexts/ctx.appManager";
import { useUser } from "../Contexts/ctx.user";
import "./MobileNavigation.css";

const MobileNavigation = () => {
    const { isMobileMenuOpen, setIsMobileMenuOpen, isSearchOpen, setIsSearchOpen } = useMobile();
    const { user } = useUser();
    const userProfile = useStore((state) => state.userProfile);

    const handleMenuToggle = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
        if (isSearchOpen) setIsSearchOpen(false);
    };

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="mobile-nav">
                <button className="mobile-nav-btn" onClick={handleMenuToggle}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
                
                <h1 className="mobile-nav-title">
                    <span className="text-purple-300">connect</span>
                    <span className="text-white">work</span>
                </h1>
                
                <button className="mobile-nav-btn" onClick={handleSearchToggle}>
                    <Search />
                </button>
            </nav>

            {/* Mobile Menu Panel */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <div className="mobile-user-info">
                        <div className="mobile-avatar">
                            {userProfile?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="mobile-user-details">
                            <p className="mobile-username">{userProfile?.email || 'User'}</p>
                        </div>
                    </div>
                </div>

                <div className="mobile-menu-actions">
                    <button className="mobile-action-btn" onClick={() => useStore.getState().setLayoutState(2)}>
                        Create Note
                    </button>
                    <button className="mobile-action-btn" onClick={() => useStore.getState().setLayoutState(4)}>
                        Upload Files
                    </button>
                    <button className="mobile-action-btn" onClick={useStore.getState().connectFiles}>
                        Connect Files
                    </button>
                </div>

                <div className="mobile-menu-footer">
                    <button className="mobile-settings-btn" onClick={() => useStore.getState().setLayoutState(3)}>
                        Settings
                    </button>
                    <button className="mobile-signout-btn" onClick={() => user.SignOut()}>
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default MobileNavigation;
