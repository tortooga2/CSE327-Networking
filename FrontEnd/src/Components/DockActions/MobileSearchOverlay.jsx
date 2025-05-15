import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useStore } from '../Contexts/ctx.appManager';
import './MobileSearchOverlay.css';

const MobileSearchOverlay = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);
    const store = useStore();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        store.setSearchTerm(value);
    };    const handleClose = () => {
        setSearchTerm('');
        store.setSearchTerm('');
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
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search files, notes..."
                        className="mobile-search-input"
                    />
                    {searchTerm && (
                        <FaTimes
                            className="clear-button"
                            size={16}
                            onClick={() => {
                                setSearchTerm('');
                                store.setSearchTerm('');
                                inputRef.current?.focus();
                            }}
                        />
                    )}
                </div>                <div 
                    className="close-search-button" 
                    onClick={handleClose}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleClose();
                        }
                    }}
                >
                    Cancel
                </div>
            </div>
        </div>
    );
};

MobileSearchOverlay.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default MobileSearchOverlay;