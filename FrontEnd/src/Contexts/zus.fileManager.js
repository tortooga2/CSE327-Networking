import { create } from 'zustand';

const useStore = create((set, get) => ({
  files: [], // Initial file state
  selectedFiles: new Set(),
  // ... other actions ...

  // Action to fetch and update the file list
  refreshFiles: async () => {
    try {
      const response = await fetch('/api/files'); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      set({ files: data }); // Update the files state with the fetched data
    } catch (error) {
      console.error("Failed to refresh files:", error);
    }
  },
  uploadFiles: async (file) => {
    // ... existing uploadFiles implementation ...
  }
}));

export { useStore };
