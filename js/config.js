const CONFIG = {
    // Search settings
    SEARCH_URL: 'https://www.google.com/search',
    SUGGESTIONS_API: 'https://suggestqueries.google.com/complete/search',
    SUGGESTIONS_CALLBACK: 'suggestions_callback',
    MAX_SUGGESTIONS: 10,
    
    // Voice recognition settings
    VOICE_RECOGNITION_LANG: 'en-US',
    VOICE_RECOGNITION_CONFIG: {
        lang: 'en-US',
        maxResults: 10,
        interimResults: true
    },
    
    // Speed dial defaults
    DEFAULT_SPEED_DIAL: [
        {
            name: 'Wikipedia',
            url: 'https://www.wikipedia.org',
            icon: 'https://icons.duckduckgo.com/ip3/www.wikipedia.org.ico'
        },
        {
            name: 'Facebook',
            url: 'https://www.facebook.com',
            icon: 'https://icons.duckduckgo.com/ip3/www.facebook.com.ico'
        },
        {
            name: 'Twitter',
            url: 'https://twitter.com',
            icon: 'https://icons.duckduckgo.com/ip3/twitter.com.ico'
        },
        {
            name: 'Amazon',
            url: 'https://www.amazon.com',
            icon: 'https://icons.duckduckgo.com/ip3/amazon.com.ico'
        },
        {
            name: 'YouTube',
            url: 'https://www.youtube.com',
            icon: 'https://icons.duckduckgo.com/ip3/www.youtube.com.ico'
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com',
            icon: 'https://icons.duckduckgo.com/ip3/www.linkedin.com.ico'
        },
        {
            name: 'Gmail',
            url: 'https://mail.google.com',
            icon: 'https://icons.duckduckgo.com/ip3/mail.google.com.ico'
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com',
            icon: 'https://icons.duckduckgo.com/ip3/www.instagram.com.ico'
        },
        {
            name: 'Netflix',
            url: 'https://www.netflix.com',
            icon: 'https://icons.duckduckgo.com/ip3/www.netflix.com.ico'
        },
    ],
    
    // Storage keys
    STORAGE_KEYS: {
        SPEED_DIAL: 'speedDial',
        SEARCH_HISTORY: 'searchHistory',
        LAST_SEARCH: 'lastSearch'
    },
    
    // History settings
    MAX_HISTORY_ITEMS: 100,
    
    // Animation durations (in ms)
    ANIMATION_DURATION: 300
};
