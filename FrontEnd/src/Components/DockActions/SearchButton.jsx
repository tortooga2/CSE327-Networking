import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useFileSearch } from '../../features/useFileSearch';
import './SearchButton.css';

const SearchButton = ({ minimal }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { searchQuery, setSearchQuery, clearSearch, isSearching } = useFileSearch();
    const inputRef = useRef(null);

    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            clearSearch();
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    if (minimal) {
        return (
            <div style={{ position: 'relative' }}>
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
                {isSearchOpen && (
                    <div className="search-popup" style={{
                        position: 'absolute',
                        bottom: '100%',
                        right: 0,
                        marginBottom: '10px',
                        background: 'var(--secondary-color)',
                        padding: '10px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        width: '280px',
                        zIndex: 1000,
                    }}>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search files..."
                                className="search-input"
                                style={{
                                    width: '100%',
                                    padding: '8px 32px 8px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--primary-color)',
                                    color: 'var(--text-color)',
                                    fontSize: '14px'
                                }}
                            />
                            {isSearching ? (
                                <FaSpinner 
                                    size={16} 
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                    }}
                                />
                            ) : searchQuery && (
                                <FaTimes
                                    size={16}
                                    className="clear-button"
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearSearch();
                                        inputRef.current?.focus();
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
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