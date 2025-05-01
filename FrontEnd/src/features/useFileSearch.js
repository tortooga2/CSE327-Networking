import { create } from 'zustand';
import debounce from 'lodash/debounce';

const useFileSearch = create((set, get) => ({
    searchQuery: '',
    searchResults: [],
    isSearching: false,
    page: 1,
    limit: 20,
    total: 0,
    
    setSearchQuery: (query) => {
        set({ searchQuery: query, page: 1 }); // Reset page when new search starts
        if (query.length >= 2) {
            get().debouncedSearch(query);
        } else {
            set({ searchResults: [], total: 0 });
        }
    },

    setPage: (newPage) => {
        set({ page: newPage });
        const { searchQuery } = get();
        if (searchQuery.length >= 2) {
            get().debouncedSearch(searchQuery, newPage);
        }
    },

    debouncedSearch: debounce(async (query, page = 1) => {
        set({ isSearching: true });
        try {
            const { limit } = get();
            const response = await fetch(
                `/api/file/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                set({ 
                    searchResults: data.files,
                    total: data.total,
                    isSearching: false,
                    page: data.page
                });
            } else {
                console.error('Search failed:', response.statusText);
                set({ 
                    searchResults: [],
                    isSearching: false,
                    total: 0 
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            set({ 
                searchResults: [],
                isSearching: false,
                total: 0
            });
        }
    }, 300),
    
    clearSearch: () => set({ 
        searchQuery: '', 
        searchResults: [], 
        isSearching: false,
        page: 1,
        total: 0
    })
}));

export { useFileSearch };