const utils = {
    /**
     * Debounce function to limit the rate at which a function can fire
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Get browser info for analytics
     */
    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            architecture: navigator.architecture
        };
    },

    /**
     * Detect browser from user agent string (fallback)
     */
    detectBrowser(ua) {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    },

    /**
     * Set a cookie
     */
    setCookie(name, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    },

    /**
     * Get a cookie by name
     */
    getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    },

    /**
     * Format date for history items
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(new Date(date));
    },

    /**
     * Generate search URL
     */
    generateSearchUrl(query) {
        const params = new URLSearchParams({
            q: query
        });
        return `${CONFIG.SEARCH_URL}?${params.toString()}`;
    }
};
