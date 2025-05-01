import { FaSearch } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useState } from 'react';
import MobileSearchOverlay from './MobileSearchOverlay';
import './SearchButton.css';

const SearchButton = ({ minimal }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearchClick = () => {
        setIsSearchOpen(true);
    };

    if (minimal) {
        return (
            <>
                <div 
                    onClick={handleSearchClick}
                    className="search-icon"
                    style={{ 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <FaSearch size={20} />
                </div>
                <MobileSearchOverlay 
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                />
            </>
        );
    }

    return (
        <div className="search-button-container search-icon">
            <FaSearch size={24} />
            <span>Search</span>
        </div>
    );
};

SearchButton.propTypes = {
    minimal: PropTypes.bool
};

SearchButton.defaultProps = {
    minimal: false
};

export default SearchButton;