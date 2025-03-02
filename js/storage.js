const storage = {
    /**
     * Get item from localStorage with error handling
     */
    getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting ${key} from localStorage:`, error);
            return null;
        }
    },

    /**
     * Set item in localStorage with error handling
     */
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key} in localStorage:`, error);
            return false;
        }
    },

    /**
 * Get item from localStorage with error handling
 */
    getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting ${key} from localStorage:`, error);
            return null;
        }
    },

    /**
     * Set item in localStorage with error handling
     */
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key} in localStorage:`, error);
            return false;
        }
    },

    /**
     * Get speed dial items
     */
    getSpeedDial() {
        const stored = this.getLocalStorage(CONFIG.STORAGE_KEYS.SPEED_DIAL);
        return stored || CONFIG.DEFAULT_SPEED_DIAL;
    },

    /**
     * Save speed dial items
     */
    saveSpeedDial(items) {
        return this.setLocalStorage(CONFIG.STORAGE_KEYS.SPEED_DIAL, items);
    },

    /**
 * Get search history
 */
    getSearchHistory() {
        return this.getLocalStorage(CONFIG.STORAGE_KEYS.SEARCH_HISTORY) || [];
    },

    /**
     * Add item to search history
     */
    addToSearchHistory(query) {
        const history = this.getSearchHistory();
        const newItem = {
            query,
            timestamp: new Date().toISOString()
        };

        // Remove duplicate if exists
        const uniqueHistory = history.filter(item => item.query !== query);

        // Add new item at the beginning
        uniqueHistory.unshift(newItem);

        // Limit history size
        if (uniqueHistory.length > CONFIG.MAX_HISTORY_ITEMS) {
            uniqueHistory.pop();
        }

        return this.setLocalStorage(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, uniqueHistory);
    },
    
    /**
     * Remove specific item from search history
     */
    removeFromSearchHistory(query) {
        const history = this.getSearchHistory();
        const updatedHistory = history.filter(item => item.query !== query);
        return this.setLocalStorage(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
    },
};
