class VoiceSearch {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.init();
    }

    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Voice search is not supported in this browser');
            document.getElementById('voiceSearch').disabled = true;
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isRecording = true;
            document.getElementById('voiceSearch').classList.add('recording');
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            document.getElementById('voiceSearch').classList.remove('recording');
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                }
            }
            if (finalTranscript) {
                document.getElementById('searchInput').value = finalTranscript.trim();
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.stop();
        };
    }

    toggle() {
        if (this.isRecording) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.recognition) return;
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
        }
    }

    stop() {
        if (!this.recognition) return;
        try {
            this.recognition.stop();
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    }
}

// Initialize voice search
const voiceSearch = new VoiceSearch();

// Add click event listener to voice search button
document.getElementById('voiceSearch').addEventListener('click', () => {
    voiceSearch.toggle();
});