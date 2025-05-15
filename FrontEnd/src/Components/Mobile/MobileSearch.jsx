import { X } from "lucide-react";
import { useMobile } from "../Contexts/ctx.mobile";
import { useState } from "react";
import "./MobileSearch.css";

const MobileSearch = () => {
    const { isSearchOpen, setIsSearchOpen } = useMobile();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Implement your search logic here
    };

    return (
        <div className={`mobile-search-overlay ${isSearchOpen ? 'open' : ''}`}>
            <div className="mobile-search-header">
                <input
                    type="text"
                    placeholder="Search files, notes..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="mobile-search-input"
                    autoFocus
                />
                <button 
                    className="mobile-search-close"
                    onClick={() => setIsSearchOpen(false)}
                >
                    <X />
                </button>
            </div>
            
            <div className="mobile-search-results">
                {/* Add your search results here */}
            </div>
        </div>
    );
};

export default MobileSearch;
