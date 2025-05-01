import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { useFileSearch } from '../../features/useFileSearch';
import './MobileSearchOverlay.css';

const MobileSearchOverlay = ({ isOpen, onClose }) => {
    const { searchQuery, setSearchQuery, clearSearch, isSearching } = useFileSearch();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleClose = () => {
        clearSearch();
        onClose();
    };

    return (
        <div className={`mobile-search-overlay ${isOpen ? 'visible' : ''}`}>
            <div className="mobile-search-container">
                <div className="mobile-search-input-wrapper">
                    <FaSearch className="search-icon" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search files..."
                        className="mobile-search-input"
                    />
                    {isSearching ? (
                        <FaSpinner className="search-spinner" size={16} />
                    ) : searchQuery && (
                        <FaTimes
                            className="clear-button"
                            size={16}
                            onClick={() => {
                                clearSearch();
                                inputRef.current?.focus();
                            }}
                        />
                    )}
                </div>
                <button className="close-search-button" onClick={handleClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

MobileSearchOverlay.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default MobileSearchOverlay;