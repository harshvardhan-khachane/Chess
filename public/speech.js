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
            micBtn.textContent = '🎤';
        } else {
            recognition.start();
            micBtn.textContent = '🛑';  
        }
        isRecording = !isRecording;
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
        isRecording = false;
        micBtn.textContent = '🎤';  
    };

    recognition.onend = () => {
        isRecording = false;
        micBtn.textContent = '🎤'; 
    };
} else {
    console.error('Web Speech API is not supported in this browser.');
    const speechOutput = document.getElementById('speech-output');
    speechOutput.textContent = 'Web Speech API is not supported in this browser.';
}
