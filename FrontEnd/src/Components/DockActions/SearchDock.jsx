import { useEffect } from 'react';
import { useStore } from '../Contexts/ctx.appManager';
import VerticalDiv from '../UILayout/VerticalDiv';
import HorizontalDiv from '../UILayout/HorizontalDiv';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchDock.css';

const SearchDock = ({ isExpanded }) => {
    const searchTerm = useStore(state => state.search.term);
    const setSearchTerm = useStore(state => state.setSearchTerm);
    const updateFiles = useStore(state => state.updateFiles);
    
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.length < 1) {
                await useStore.getState().loadFiles();
                return;
            }

            try {
                const response = await fetch(`/api/file/all?search=${encodeURIComponent(searchTerm)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    updateFiles(data.data);
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        };

        // Debounce search requests
        const timer = setTimeout(() => {
            fetchSearchResults();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, updateFiles]);

    return (
        <VerticalDiv className={`search-dock ${isExpanded ? 'expanded' : ''}`}>
            <HorizontalDiv className="search-input-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search files..."
                    className="search-input"
                />
                {searchTerm && (
                    <FaTimes
                        className="clear-icon"
                        onClick={() => setSearchTerm('')}
                    />
                )}
            </HorizontalDiv>
        </VerticalDiv>
    );
};

export default SearchDock;