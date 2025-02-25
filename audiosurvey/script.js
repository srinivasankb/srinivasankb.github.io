let mediaRecorder = null;
let audioChunks = [];
let currentQuestionIndex = 0;
let answeredQuestions = new Set();

const questions = [
    'How do you use SurveySparrow, and what goals are you achieving with it?',
    'What challenges have you faced while creating or analyzing surveys?',
    'How useful are the reporting and analytics features? What improvements would help?',
    'Which integrations do you use or wish SurveySparrow had?',
    'How likely are you to recommend SurveySparrow, and why?'
];

const toggleBtn = document.getElementById('toggleBtn');
const output = document.getElementById('output');
const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelector('.status-text');
const questionsList = document.getElementById('questionsList');
const recordingSection = document.getElementById('recordingSection');
const emailSection = document.getElementById('emailSection');
const thankYouSection = document.getElementById('thankYouSection');
const backBtn = document.getElementById('backBtn');
const submitAnswer = document.getElementById('submitAnswer');
const submitEmail = document.getElementById('submitEmail');
const downloadResponses = document.getElementById('downloadResponses');
const currentQuestionTitle = document.getElementById('currentQuestionTitle');
const currentQuestionText = document.getElementById('currentQuestionText');
const preferTypingBtn = document.createElement('button');
preferTypingBtn.id = 'preferTypingBtn';
preferTypingBtn.className = 'control-btn secondary-btn';
preferTypingBtn.textContent = 'Prefer Typing';
let isTypingMode = false;

// Function to clean text using OpenAI
async function cleanText(text) {
    try {
        const apiKey = localStorage.getItem('openaiApiKey');
            if (!apiKey) {
                throw new Error('Please set your OpenAI API key in settings');
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: 'You are a text editor. Your task is to make minimal improvements to the text using OpenAI.'
                }, {
                    role: 'user',
                    content: text
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error cleaning text:', error);
        throw error;
    }
}

// Function to send audio to OpenAI Whisper API
async function transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');

    try {
        const apiKey = localStorage.getItem('openaiApiKey');
            if (!apiKey) {
                throw new Error('Please set your OpenAI API key in settings');
            }

            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            text: data.text,
            language: data.language || 'unknown'
        };
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw error;
    }
}

// Initialize question cards
document.querySelectorAll('.question-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        currentQuestionIndex = index;
        showRecordingSection();
    });
});

// Show recording section for current question
function showRecordingSection() {
    questionsList.classList.add('hidden');
    recordingSection.classList.remove('hidden');
    currentQuestionTitle.textContent = '';
    currentQuestionText.textContent = questions[currentQuestionIndex];
    output.innerHTML = '';
    
    // Show previous answer if it exists
    const answers = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');
    if (answers[currentQuestionIndex]) {
        const p = document.createElement('p');
        p.classList.add('final');
        p.contentEditable = true;
        p.textContent = answers[currentQuestionIndex];
        output.appendChild(p);
    } else if (!isTypingMode) {
        statusText.textContent = 'Ready to record';
    }

    // Reset typing mode
    isTypingMode = false;
    toggleRecordingControls(true);
    preferTypingBtn.textContent = 'Prefer Typing';
}

// Back button handler
backBtn.addEventListener('click', () => {
    recordingSection.classList.add('hidden');
    questionsList.classList.remove('hidden');
});

// Submit answer handler
submitAnswer.addEventListener('click', () => {
    const answer = output.querySelector('.final')?.textContent;
    if (answer) {
        const answers = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');
        answers[currentQuestionIndex] = answer;
        localStorage.setItem('surveyAnswers', JSON.stringify(answers));
        answeredQuestions.add(currentQuestionIndex);

        // Mark question as answered in UI
        const questionCard = document.querySelector(`[data-index="${currentQuestionIndex}"]`);
        questionCard.style.borderColor = '#28a745';

        // Check if all questions are answered
        if (answeredQuestions.size === questions.length) {
            showEmailSection();
        } else {
            recordingSection.classList.add('hidden');
            questionsList.classList.remove('hidden');
        }
    } else {
        alert('Please record or type your answer before submitting.');
    }
});

// Show email section
function showEmailSection() {
    questionsList.classList.add('hidden');
    recordingSection.classList.add('hidden');
    emailSection.classList.remove('hidden');
}

// Submit email handler
submitEmail.addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    if (email && email.includes('@')) {
        const answers = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');
        const surveyResponse = {
            email,
            answers,
            timestamp: new Date().toISOString()
        };

        // Store complete survey response
        const responses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
        responses.push(surveyResponse);
        localStorage.setItem('surveyResponses', JSON.stringify(responses));
        localStorage.removeItem('surveyAnswers'); // Clear the answers after submission

        showThankYouSection();
    } else {
        alert('Please enter a valid email address.');
    }
});

// Show thank you section
function showThankYouSection() {
    emailSection.classList.add('hidden');
    thankYouSection.classList.remove('hidden');
}

// Download responses as CSV
downloadResponses.addEventListener('click', () => {
    const responses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    if (responses.length === 0) {
        alert('No responses to download.');
        return;
    }

    const csvRows = [
        ['Email', 'Timestamp', ...questions]
    ];

    responses.forEach(response => {
        const row = [
            response.email,
            response.timestamp,
            ...questions.map((_, index) => response.answers[index] || '')
        ];
        csvRows.push(row);
    });

    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'survey_responses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
});

// Function to toggle recording controls visibility
function toggleRecordingControls(show) {
    const recordingControls = [toggleBtn, statusDot, statusText];
    recordingControls.forEach(element => {
        element.style.display = show ? 'inline-block' : 'none';
    });
}

// Function to enable typing mode
function enableTypingMode() {
    isTypingMode = !isTypingMode;
    toggleRecordingControls(!isTypingMode);
    
    if (isTypingMode) {
        preferTypingBtn.textContent = 'Show Recording';
        if (!output.querySelector('.final')) {
            const p = document.createElement('p');
            p.classList.add('final');
            p.contentEditable = true;
            p.setAttribute('placeholder', 'Type your answer here...');
            output.innerHTML = '';
            output.appendChild(p);
            p.focus();
        }
    } else {
        preferTypingBtn.textContent = 'Prefer Typing';
        if (!output.querySelector('.final')?.textContent.trim()) {
            output.innerHTML = '';
        }
    }
}

// Add Prefer Typing button to controls
const controls = document.querySelector('.controls');
controls.appendChild(preferTypingBtn);

// Add click handler for Prefer Typing button
preferTypingBtn.addEventListener('click', enableTypingMode);

// Check if browser supports MediaRecorder
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                statusDot.classList.remove('listening');
                statusText.textContent = 'Processing audio...';

                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                try {
                    const transcriptionResult = await transcribeAudio(audioBlob);
                    statusText.textContent = 'Cleaning text...';
                    const cleanedTranscript = await cleanText(transcriptionResult.text);
                    
                    output.innerHTML = '';
                    const p = document.createElement('p');
                    p.classList.add('final');
                    p.contentEditable = true;
                    p.textContent = cleanedTranscript;
                    output.appendChild(p);

                    // Add edit hint
                    const hint = document.createElement('div');
                    hint.classList.add('edit-hint');
                    hint.textContent = 'You can edit the text above if needed';
                    output.appendChild(hint);

                    statusText.textContent = 'Click Start to begin recording';
                } catch (error) {
                    statusText.textContent = `Error: ${error.message}`;
                }

                audioChunks = [];
                toggleBtn.textContent = 'Start Recording';
            };

            function startRecording() {
                audioChunks = [];
                mediaRecorder.start();
                statusDot.classList.add('listening');
                statusText.textContent = 'Recording...';
                toggleBtn.textContent = 'Stop Recording';
            }

            function stopRecording() {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }

            toggleBtn.addEventListener('click', () => {
                if (mediaRecorder.state === 'inactive') {
                    startRecording();
                } else {
                    stopRecording();
                }
            });

            // Set up audio context and analyzer for visualization
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Float32Array(bufferLength);

            // Create canvas for visualization
            const canvas = document.createElement('canvas');
            canvas.className = 'audio-visualizer';
            canvas.style.display = 'none';
            const canvasCtx = canvas.getContext('2d');
            document.querySelector('.status-indicator').appendChild(canvas);

            function visualize() {
                const WIDTH = canvas.width;
                const HEIGHT = canvas.height;

                requestAnimationFrame(visualize);

                analyser.getFloatTimeDomainData(dataArray);

                canvasCtx.fillStyle = 'rgb(245, 245, 245)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = '#28a745';
                canvasCtx.beginPath();

                const sliceWidth = WIDTH / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] * 0.5;
                    const y = (v * HEIGHT / 2) + (HEIGHT / 2);

                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(WIDTH, HEIGHT / 2);
                canvasCtx.stroke();
            }

            function startRecording() {
                audioChunks = [];
                mediaRecorder.start();
                statusDot.classList.add('listening');
                statusText.textContent = 'Recording...';
                toggleBtn.textContent = 'Stop Recording';
                canvas.style.display = 'block';

                // Connect audio stream to analyzer
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                visualize();
            }

            function stopRecording() {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    canvas.style.display = 'none';
                }
            }

            document.addEventListener('keydown', (event) => {
                const isTextInputFocused = document.activeElement.classList?.contains('final');
                if (event.code === 'Space' && !event.repeat && !isTypingMode && !isTextInputFocused && mediaRecorder.state === 'inactive') {
                    event.preventDefault();
                    startRecording();
                }
            });

            document.addEventListener('keyup', (event) => {
                const isTextInputFocused = document.activeElement.classList?.contains('final');
                if (event.code === 'Space' && !isTypingMode && !isTextInputFocused && mediaRecorder.state === 'recording') {
                    event.preventDefault();
                    stopRecording();
                }
            });


        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
            toggleBtn.disabled = true;
            statusText.textContent = 'Error accessing microphone';
        });
} else {
    toggleBtn.disabled = true;
    statusText.textContent = 'Audio recording is not supported in this browser';
    console.error('Audio recording is not supported in this browser');
}

// Load previously answered questions
const savedAnswers = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');
Object.keys(savedAnswers).forEach(index => {
    answeredQuestions.add(parseInt(index));
    const questionCard = document.querySelector(`[data-index="${index}"]`);
    if (questionCard) {
        questionCard.style.borderColor = '#28a745';
    }
});

// Check if all questions are already answered
if (answeredQuestions.size === questions.length) {
    showEmailSection();
}
// Settings modal handlers
const settingsIcon = document.getElementById('settingsIcon');
const settingsModal = document.getElementById('settingsModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveSettings = document.getElementById('saveSettings');
const cancelSettings = document.getElementById('cancelSettings');

// Load saved API key
apiKeyInput.value = localStorage.getItem('openaiApiKey') || '';

// Show settings modal
settingsIcon.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

// Save API key
saveSettings.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('openaiApiKey', apiKey);
        settingsModal.classList.add('hidden');
    } else {
        alert('Please enter a valid API key');
    }
});

// Cancel settings
cancelSettings.addEventListener('click', () => {
    apiKeyInput.value = localStorage.getItem('openaiApiKey') || '';
    settingsModal.classList.add('hidden');
});

// Close modal when clicking outside
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.add('hidden');
    }
});

// Restart survey handler
document.getElementById('restartSurvey').addEventListener('click', () => {
    // Clear all survey-related data from localStorage
    localStorage.removeItem('surveyAnswers');
    localStorage.removeItem('surveyResponses');
    
    // Reset application state
    answeredQuestions.clear();
    currentQuestionIndex = 0;
    audioChunks = [];
    
    // Reset UI elements
    document.querySelectorAll('.question-card').forEach(card => {
        card.style.borderColor = '';
    });
    output.innerHTML = '';
    statusText.textContent = 'Ready to record';
    toggleBtn.textContent = 'Start Recording';
    
    // Hide all sections except questions list
    thankYouSection.classList.add('hidden');
    emailSection.classList.add('hidden');
    recordingSection.classList.add('hidden');
    questionsList.classList.remove('hidden');
});