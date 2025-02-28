document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    suggestions.init();
    voiceSearch.init();
    speedDial.init();

    // Track browser info
    const browserInfo = utils.getBrowserInfo();
    console.log(JSON.stringify(browserInfo))
    utils.setCookie('browser_info', JSON.stringify(browserInfo));

    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-icon-btn');
    const historyDropdown = document.getElementById('search-history-dropdown');

    function renderSearchHistory() {
        console.log(1);
        const query = searchInput.value.trim();
        if (query) {
            suggestions.fetch(query);
            hideSearchHistory();
            return;
        }

        const historyList = storage.getSearchHistory();
        console.log(2, historyList, historyList.length);
        if (!historyList || historyList?.length === 0) {
            // hideSearchHistory();
            historyDropdown.innerHTML = '<div class="no-history">No search history</div>';
            return;
        }

        historyDropdown.innerHTML = historyList?.map((item, index) => `
            <div class="history-item 1" tabindex="${index + 1}">
                <svg class="history-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"></path>
                </svg>
                <span>${item?.query}</span>
                <button class="delete-history" title="Remove from history">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="15px" width="15px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
                </button>
            </div>
        `).join('');

        // Show history panel
        showSearchHistory();
    }

    historyDropdown.addEventListener('blur', (e) => {
        console.log('historyDropdown blur');
        // hideSearchHistory();
    });
    historyDropdown.addEventListener('focus', (e) => {
        console.log('historyDropdown focus');
        // hideSearchHistory();
    });
    historyDropdown.addEventListener('keydown', (e) => {
        console.log('historyDropdown keydown');
        // hideSearchHistory();
    });

    historyDropdown.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-history');
        if (deleteBtn) {
            e.stopPropagation();
            const historyItem = deleteBtn.closest('.history-item');
            const query = historyItem.querySelector('span').textContent;
            storage.removeFromSearchHistory(query);
            // Refresh the history list without hiding the dropdown
            const history = storage.getSearchHistory();
            if (!history || history.length === 0) {
                hideSearchHistory();
            } else {
                historyDropdown.innerHTML = history.map(item => `
                    <div class="history-item">
                        <svg class="history-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"></path>
                        </svg>
                        <span>${item.query}</span>
                        <button class="delete-history" title="Remove from history">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="15px" width="15px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
                        </button>
                    </div>
                `).join('');
                historyDropdown.classList.remove('hidden');
            }
            return;
        }

        const historyItem = e.target.closest('.history-item');
        if (historyItem) {
            const query = historyItem.querySelector('span').textContent;
            searchInput.value = query;
            hideSearchHistory();
            performSearch();
        }
    });

    function hideSearchHistory() {
        historyDropdown.classList.add('hidden');
    }

    function showSearchHistory() {
        historyDropdown.classList.remove('hidden');
    }

    // searchInput.addEventListener('keydown', renderSearchHistory);
    searchInput.addEventListener('focus', renderSearchHistory);
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

    function handleKeyboardNavigation(event) {
        console.log('handleKeyboardNavigation');
        // const selectedHistory = historyDropdown.querySelector('.history-item.selected span');
        // console.log('selectedHistory ', selectedHistory?.textContent);
        // document.querySelector(".search-text-preview").innerHTML = selectedHistory?.textContent.trim();
        const items = Array.from(historyDropdown.querySelectorAll('.history-item'));
        if (!items.length) return;

        // Find the index of the currently selected item
        let selectedIndex = items.findIndex(item => item.classList.contains('selected'));

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (selectedIndex < items.length - 1) selectedIndex++;
            else selectedIndex = 0; // Loop back to the first item
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (selectedIndex > 0) selectedIndex--;
            else selectedIndex = items.length - 1; // Loop back to the last item
        } else if (event.key === 'Enter' && selectedIndex > -1) {
            event.preventDefault();
            searchInput.value = items[selectedIndex].textContent.trim();
            performSearch();
            hideSearchHistory();
            return; // Exit early since the action is complete
        } else if (event.key === 'Escape') {
            hideSearchHistory();
            return; // Exit early since the dropdown is hidden
        }

        // Remove the 'selected' class from all items
        items.forEach(item => item.classList.remove('selected'));

        // Add the 'selected' class to the newly selected item
        if (selectedIndex > -1) {
            items[selectedIndex].classList.add('selected');
            // Update the search input with the text of the currently highlighted item
            // searchInput.value = items[selectedIndex].textContent.trim();
        }
    }

    searchInput.addEventListener('keydown', (e) => {
        const query = e.target.value.trim();
        const historyVisible = !historyDropdown.classList.contains('hidden');

        // Handle keyboard navigation for history items
        if (historyVisible && !query && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter')) {
            e.preventDefault();
            handleKeyboardNavigation(e);
            return;
        }

        // Handle direct search when Enter is pressed
        if (e.key === 'Enter' && query) {
            e.preventDefault();
            performSearch();
            return;
        }

        if (query) {
            // Let suggestions module handle its own navigation when there's text
            suggestions.handleKeyboardNavigation(e);
        }
    });

    searchInput.addEventListener('blur', () => {
        console.log('searchInput blur');
        // Small delay to allow for clicks on history items
        setTimeout(() => {
            // hideSearchHistory();
            suggestions.clearSuggestions();
        }, 200);
    });

    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Store search in history
        storage.addToSearchHistory(query);

        // Capture fetch start time
        const fs = Date.now();

        // Generate search URL with additional parameters
        const searchUrl = utils.generateSearchUrl(query) + `&fs=${fs}`;

        // Simulate response start time after some delay
        setTimeout(() => {
            const rs = Date.now();
            window.location.href = searchUrl + `&rs=${rs}`;
        }, 100); // Simulate network delay
    }

    // Set up voice search
    const voiceSearchButton = document.getElementById('voiceSearch');
    voiceSearchButton.addEventListener('click', () => {
        voiceSearch.toggle();
    });

    // Add click event for search button
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch();
    });

    // Set up services dropdown
    const servicesDropdown = document.getElementById('servicesDropdown');
    const servicesMenu = document.querySelector('.services-menu');

    servicesDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        servicesMenu.classList.toggle('hidden');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // Close services menu
        if (!servicesDropdown.contains(e.target)) {
            servicesMenu.classList.add('hidden');
        }

        // Close suggestions
        if (!searchInput.contains(e.target)) {
            suggestions.clearSuggestions();
        }
    });
});
