const suggestions = {
    currentScript: null,

    /**
     * Initialize suggestions functionality
     */
    init() {
        // Define the callback function for JSONP
        window[CONFIG.SUGGESTIONS_CALLBACK] = this.handleSuggestionsResponse.bind(this);
    },

    /**
     * Fetch suggestions from Google Suggest API
     */
    fetch(query) {
        if (this.currentScript) {
            document.head.removeChild(this.currentScript);
        }

        if (!query.trim()) {
            this.clearSuggestions();
            return;
        }

        const script = document.createElement('script');
        const params = new URLSearchParams({
            client: 'chrome',
            q: query,
            callback: CONFIG.SUGGESTIONS_CALLBACK
        });

        script.src = `${CONFIG.SUGGESTIONS_API}?${params.toString()}`;
        this.currentScript = script;
        document.head.appendChild(script);
    },

    /**
     * Handle the JSONP response from Google Suggest API
     */
    handleSuggestionsResponse(data) {
        if (!Array.isArray(data) || !Array.isArray(data[1])) {
            this.clearSuggestions();
            return;
        }

        const suggestions = data[1].slice(0, CONFIG.MAX_SUGGESTIONS);
        this.displaySuggestions(suggestions);

        // Clean up the script tag
        if (this.currentScript) {
            document.head.removeChild(this.currentScript);
            this.currentScript = null;
        }
    },

    /**
     * Display suggestions in the dropdown
     */
    displaySuggestions(items) {
        const container = document.getElementById('searchSuggestions');
        container.innerHTML = '';

        if (!items.length) {
            container.classList.add('hidden');
            return;
        }

        // Generate anchor tags instead of divs
        container.innerHTML = items.map(suggestion => `
            <a href="#" class="suggestion-item" data-suggestion="${suggestion}">
                <svg class="suggestion-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path></svg>
                <span class="suggestion-text">${suggestion}</span>
            </a>
        `).join('');

        // Add click event listeners to anchor tags
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                const searchInput = document.getElementById('searchInput');
                searchInput.value = item.getAttribute('data-suggestion');
                this.clearSuggestions();
                searchInput.focus();
                // Optionally trigger search immediately
                document.querySelector('.search-icon-btn')?.click(); // Simulate search button click if desired
            });
        });

        container.classList.remove('hidden');
    },

    /**
     * Clear suggestions dropdown
     */
    clearSuggestions() {
        const container = document.getElementById('searchSuggestions');
        container.innerHTML = '';
        container.classList.add('hidden');
    },

    /**
     * Handle keyboard navigation in suggestions
     */
    handleKeyboardNavigation(event) {
        const container = document.getElementById('searchSuggestions');
        if (container.classList.contains('hidden')) return;

        const items = container.querySelectorAll('.suggestion-item');
        const current = container.querySelector('.suggestion-item.selected');
        let index = -1;

        if (current) {
            index = Array.from(items).indexOf(current);
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (index < items.length - 1) {
                    if (current) current.classList.remove('selected');
                    items[index + 1].classList.add('selected');
                    document.getElementById('searchInput').value = items[index + 1].querySelector('.suggestion-text').textContent;
                }
                break;

            case 'ArrowUp':
                event.preventDefault();
                if (index > 0) {
                    if (current) current.classList.remove('selected');
                    items[index - 1].classList.add('selected');
                    document.getElementById('searchInput').value = items[index - 1].querySelector('.suggestion-text').textContent;
                }
                break;

            case 'Escape':
                this.clearSuggestions();
                break;
        }
    }
};