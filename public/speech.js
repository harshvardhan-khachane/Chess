if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    const micBtn = document.getElementById('mic-btn');
    const speechOutput = document.getElementById('speech-output');

    micBtn.addEventListener('click', () => {
        recognition.start();
        micBtn.disabled = true;
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toUpperCase();
        speechOutput.textContent = transcript;
        micBtn.disabled = false;
        
        if (/^[A-H][1-8]$/.test(transcript)) {
            const box = document.getElementById(transcript);
            if (box) {
                box.click();
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        micBtn.disabled = false;
    };

    recognition.onend = () => {
        micBtn.disabled = false;
    };
} else {
    console.error('Web Speech API is not supported in this browser.');
    const speechOutput = document.getElementById('speech-output');
    speechOutput.textContent = 'Web Speech API is not supported in this browser.';
}
