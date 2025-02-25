const speedDial = {
    modal: null,
    form: null,
    editingIndex: -1,
    MAX_ITEMS: 15,

    /**
     * Initialize speed dial
     */
    init() {
        this.loadSpeedDial();
        this.setupModal();
        this.setupEventListeners();
    },

    /**
     * Set up modal elements and form
     */
    setupModal() {
        this.modal = document.getElementById('speedDialModal');
        this.form = document.getElementById('speedDialForm');

        // Close modal on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Close button handler
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideModal();
        });

        // Cancel button handler
        document.getElementById('cancelSpeedDial').addEventListener('click', () => {
            this.hideModal();
        });

        // Form submission handler
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    },

    /**
     * Set up other event listeners
     */
    setupEventListeners() {
        // Add button handler
        const addButton = document.getElementById('addSpeedDial');
        if (addButton) {
            addButton.addEventListener('click', () => {
                this.showModal();
            });
        }

        // Handle right-click on speed dial items
        document.getElementById('speedDialContainer').addEventListener('contextmenu', (e) => {
            const item = e.target.closest('.speed-dial-item');
            if (item) {
                e.preventDefault();
                const index = Array.from(item.parentNode.children).indexOf(item);
            }
        });

        // Close context menu on click outside
        document.addEventListener('click', () => {
            const menu = document.querySelector('.context-menu');
            if (menu) {
                menu.remove();
            }
        });
    },

    /**
     * Load and display speed dial items
     */
    loadSpeedDial() {
        const items = storage.getSpeedDial();
        const container = document.getElementById('speedDialContainer');
        const addButton = document.getElementById('addSpeedDial');

        // Clear container but keep the add button div
        const addItemDiv = container.querySelector('.add-item');
        container.innerHTML = '';

        // Add speed dial items
        items.forEach((item, index) => {
            container.appendChild(this.createSpeedDialItem(item, index));
        });

        // Add back the add button div
        container.appendChild(addItemDiv);

        // Update add button state
        if (addButton) {
            addButton.disabled = items.length >= this.MAX_ITEMS;
            addButton.title = items.length >= this.MAX_ITEMS ?
                'Maximum number of speed dials reached (15)' :
                'Add new speed dial';
        }
    },

    /**
     * Create a speed dial item element
     */
    createSpeedDialItem(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'speed-dial-item';
        itemElement.dataset.index = index;

        const hostname = new URL(item.url).hostname;
        itemElement.innerHTML = `
            <a href="${item.url}" title="${item.name}" target="_blank">
                <div class="speed-dial-icon">
                    <img src="https://icons.duckduckgo.com/ip3/${hostname}.ico" alt="${item.name}">
                </div>
                <span class="speed-dial-name">${item.name}</span>
            </a>
            <div class="speed-dial-actions">
                <button class="speed-dial-action-btn edit" title="Edit">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                        <path d="m14.06 9.02.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"></path>
                    </svg>
                </button>
                <button class="speed-dial-action-btn remove" title="Remove"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>
            </div>`;

        // Add event listeners
        itemElement.querySelector('.edit').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.editSpeedDialItem(index);
        });

        itemElement.querySelector('.remove').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.deleteSpeedDialItem(index);
        });

        return itemElement;
    },

    /**
     * Show modal for adding/editing speed dial
     */
    showModal(editItem = null) {
        const items = storage.getSpeedDial();
        if (!editItem && items.length >= this.MAX_ITEMS) {
            alert('Maximum number of speed dials reached (15). Please remove some items before adding new ones.');
            return;
        }

        const titleElement = document.getElementById('modalTitle');
        const nameInput = document.getElementById('siteName');
        const urlInput = document.getElementById('siteUrl');
        const indexInput = document.getElementById('editIndex');

        if (editItem) {
            titleElement.textContent = 'Edit Speed Dial';
            nameInput.value = editItem.name;
            urlInput.value = editItem.url;
            indexInput.value = this.editingIndex;
        } else {
            titleElement.textContent = 'Add Speed Dial';
            this.form.reset();
            indexInput.value = '';
            this.editingIndex = -1;
        }

        this.modal.classList.remove('hidden');
    },

    /**
     * Hide modal
     */
    hideModal() {
        this.modal.classList.add('hidden');
        this.form.reset();
        this.editingIndex = -1;
    },

    /**
     * Handle form submission
     */
    handleFormSubmit() {
        const nameInput = document.getElementById('siteName');
        const urlInput = document.getElementById('siteUrl');
        const indexInput = document.getElementById('editIndex');
    
        const name = nameInput.value.trim();
        let url = urlInput.value.trim();
    
        // Check if URL is empty after trimming
        if (!url) {
            alert('Please enter a URL.');
            return;
        }
    
        // Add protocol if missing, default to https://
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
    
        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d-]+(\/.*)?$/i;
        if (!urlPattern.test(url)) {
            alert('Please enter a valid URL (e.g., www.example.com).');
            return;
        }
    
        const items = storage.getSpeedDial();
        const newItem = { name, url };
    
        if (indexInput.value !== '') {
            // Edit existing item
            items[parseInt(indexInput.value)] = newItem;
        } else {
            // Add new item
            items.push(newItem);
        }
    
        storage.saveSpeedDial(items);
        this.loadSpeedDial();
        this.hideModal();
    },

    /**
     * Edit speed dial item
     */
    editSpeedDialItem(index) {
        const items = storage.getSpeedDial();
        this.editingIndex = index;
        this.showModal(items[index]);
    },

    /**
     * Delete speed dial item
     */
    deleteSpeedDialItem(index) {
        if (confirm('Are you sure you want to delete this speed dial?')) {
            const items = storage.getSpeedDial();
            items.splice(index, 1);
            storage.saveSpeedDial(items);
            this.loadSpeedDial();
        }
    }
};
