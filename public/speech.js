if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    const micBtn = document.getElementById('mic-btn');
    const speechOutput = document.getElementById('speech-output');

    let isRecording = false;

    micBtn.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
        isRecording = !isRecording;
        micBtn.disabled = false;
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toUpperCase();
        speechOutput.textContent = transcript;
        
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
        if (isRecording) {
            recognition.start();
        }
        micBtn.disabled = false;
    };
} else {
    console.error('Web Speech API is not supported in this browser.');
    const speechOutput = document.getElementById('speech-output');
    speechOutput.textContent = 'Web Speech API is not supported in this browser.';
}
