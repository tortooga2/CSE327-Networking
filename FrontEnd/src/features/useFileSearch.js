import { create } from 'zustand';
import debounce from 'lodash/debounce';

const useFileSearch = create((set, get) => ({
    searchQuery: '',
    searchResults: [],
    isSearching: false,
    
    setSearchQuery: (query) => {
        set({ searchQuery: query });
        if (query.length >= 2) {
            get().debouncedSearch(query);
        } else {
            set({ searchResults: [] });
        }
    },

    debouncedSearch: debounce(async (query) => {
        set({ isSearching: true });
        try {
            const response = await fetch(`/api/file/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Search results:', data); // Added for debugging
                set({ 
                    searchResults: data.files || [],
                    isSearching: false 
                });
            } else {
                console.error('Search failed:', response.statusText);
                set({ 
                    searchResults: [],
                    isSearching: false 
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            set({ 
                searchResults: [],
                isSearching: false 
            });
        }
    }, 300),
    
    clearSearch: () => set({ 
        searchQuery: '', 
        searchResults: [], 
        isSearching: false 
    })
}));

export { useFileSearch };