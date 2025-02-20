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
     * Safely encode URL parameters
     */
    encodeSearchQuery(query) {
        return encodeURIComponent(query.trim());
    },

    /**
     * Get browser info for analytics
     */
    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform
        };
    },

    /**
     * Create a DOM element with attributes and children
     */
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    },

    /**
     * Get detailed browser and platform information
     * Uses navigator.userAgentData.getHighEntropyValues for detailed platform info
     */
    async getDetailedBrowserInfo() {
        const ua = navigator.userAgent;
        const uaData = navigator.userAgentData;

        try {
            const highEntropyValues = await uaData?.getHighEntropyValues([
                'platformVersion',
                'architecture',
                'model',
                'uaFullVersion'
            ]);

            const info = {
                browser: uaData ? uaData.brands[0].brand : this.detectBrowser(ua),
                platform: uaData ? uaData.platform : navigator.platform,
                mobile: uaData ? uaData.mobile : /Mobile|Android|iPhone/i.test(ua),
                timestamp: new Date().toISOString(),
                ...(highEntropyValues || {})
            };

            // Store the information in cookies
            this.setCookie('browserInfo', JSON.stringify(info));

            return info;
        } catch (error) {
            console.error('Failed to get high entropy values:', error);
            return {
                browser: uaData ? uaData.brands[0].brand : this.detectBrowser(ua),
                platform: uaData ? uaData.platform : navigator.platform,
                mobile: uaData ? uaData.mobile : /Mobile|Android|iPhone/i.test(ua),
                timestamp: new Date().toISOString()
            };
        }
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
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    },

    /**
     * Get a cookie by name
     */
    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
            if (cookieName === name) return cookieValue;
        }
        return '';
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
     * Get favicon URL for a given website URL
     */
    getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
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
