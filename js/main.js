document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    suggestions.init();
    voiceSearch.init();
    speedDial.init();

    // Track browser info
    const browserInfo = utils.getBrowserInfo();
    console.log(JSON.stringify(browserInfo));
    utils.setCookie('browser_info', JSON.stringify(browserInfo));

    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-icon-btn');
    const historyDropdown = document.getElementById('search-history-dropdown');
    let currentIndex = -1; // Track currently selected history item

    // Clear search input on page load
    searchInput.value = '';

    function renderSearchHistory() {
        const query = searchInput.value.trim();
        if (query) {
            suggestions.fetch(query);
            hideSearchHistory();
            return;
        }

        const historyList = storage.getSearchHistory();
        if (!historyList || historyList.length === 0) {
            hideSearchHistory();
            // historyDropdown.innerHTML = '<div class="no-history">No search history</div>';
            // showSearchHistory();
            return;
        }

        historyDropdown.innerHTML = historyList.map((item, index) => `
            <div class="history-item" data-index="${index}" tabindex="${index + 1}">
                <svg class="history-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"></path>
                </svg>
                <span>${item.query}</span>
                <button class="delete-history" title="Remove from history">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="15px" width="15px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
                </button>
            </div>
        `).join('');

        currentIndex = -1; // Reset selection
        showSearchHistory();
    }

    historyDropdown.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-history');
        if (deleteBtn) {
            e.stopPropagation();
            const historyItem = deleteBtn.closest('.history-item');
            const query = historyItem.querySelector('span').textContent;
            storage.removeFromSearchHistory(query);
            renderSearchHistory();
            searchInput.focus(); // Keep focus on input to maintain dropdown visibility
            return;
        }

        const historyItem = e.target.closest('.history-item');
        if (historyItem) {
            const query = historyItem.querySelector('span').textContent;
            searchInput.value = query;
            performSearch();
            searchInput.focus(); // Keep focus on input after selection
        }
    });

    function hideSearchHistory() {
        historyDropdown.classList.add('hidden');
        currentIndex = -1;
    }

    function showSearchHistory() {
        historyDropdown.classList.remove('hidden');
    }

    function selectHistoryItem(index) {
        const items = historyDropdown.querySelectorAll('.history-item');
        items.forEach(item => item.classList.remove('selected'));

        if (index >= 0 && index < items.length) {
            items[index].classList.add('selected');
            searchInput.value = items[index].querySelector('span').textContent;
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    searchInput.addEventListener('focus', () => {
        renderSearchHistory();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query) {
            suggestions.fetch(query);
            hideSearchHistory();
        } else {
            suggestions.clearSuggestions();
            renderSearchHistory();
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        const query = searchInput.value.trim();
        const historyVisible = !historyDropdown.classList.contains('hidden');
        const items = historyDropdown.querySelectorAll('.history-item');
        const totalItems = items.length;

        if (historyVisible && totalItems > 0 && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape')) {
            e.preventDefault();

            if (e.key === 'ArrowDown') {
                currentIndex = (currentIndex + 1) % totalItems;
                selectHistoryItem(currentIndex);
            } else if (e.key === 'ArrowUp') {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                selectHistoryItem(currentIndex);
            } else if (e.key === 'Enter' && currentIndex >= 0) {
                performSearch();
            } else if (e.key === 'Escape') {
                hideSearchHistory();
                searchInput.value = ''; // Clear input on escape
            }
            return;
        }

        if (e.key === 'Enter' && query) {
            e.preventDefault();
            performSearch();
            return;
        }

        if (query) {
            suggestions.handleKeyboardNavigation(e);
        }
    });

    // Handle focus loss from both input and dropdown
    function handleFocusLoss(event) {
        const relatedTarget = event.relatedTarget; // Element gaining focus
        setTimeout(() => { // Use timeout to ensure focus has fully shifted
            if (!searchInput.contains(document.activeElement) &&
                !historyDropdown.contains(document.activeElement)) {
                hideSearchHistory();
                // console.log("handleFocusLoss");
                suggestions.clearSuggestions();
            }
        }, 0);
    }

    searchInput.addEventListener('focusout', handleFocusLoss);
    historyDropdown.addEventListener('focusout', handleFocusLoss);

    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        storage.addToSearchHistory(query);
        const fs = Date.now();
        const searchUrl = utils.generateSearchUrl(query) + `&fs=${fs}`;

        setTimeout(() => {
            const rs = Date.now();
            window.location.href = searchUrl + `&rs=${rs}`;
        }, 100);
    }

    const voiceSearchButton = document.getElementById('voiceSearch');
    voiceSearchButton.addEventListener('click', () => {
        voiceSearch.toggle();
    });

    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch();
    });

    const servicesDropdown = document.getElementById('servicesDropdown');
    const servicesMenu = document.querySelector('.services-menu');

    servicesDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        servicesMenu.classList.toggle('hidden');
    });
});