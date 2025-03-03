// API Key for Gemini Vision API
const API_KEY = 'AIzaSyDbX8XifmUsG-uUmgRdQTWmwxulKPKuniI';

class ImageDescriber {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentFacingMode = 'user';
        this.availableCameras = [];
    }

    initializeElements() {
        this.videoElement = document.getElementById('camera-feed');
        this.canvasElement = document.getElementById('camera-canvas');
        this.canvas = this.canvasElement.getContext('2d');
        this.captureBtn = document.getElementById('capture-btn');
        this.switchCameraBtn = document.getElementById('switch-camera-btn');
        this.resultText = document.getElementById('result-text');
        this.captureBtn.disabled = true; // Disable button initially
    }

    setupEventListeners() {
        this.captureBtn.addEventListener('click', () => this.captureImage());
        this.switchCameraBtn.addEventListener('click', () => this.switchCamera());
        this.checkAvailableCameras();
    }

    async checkAvailableCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.availableCameras = devices.filter(device => device.kind === 'videoinput');
            
            // Show switch camera button only if multiple cameras are available
            this.switchCameraBtn.style.display = this.availableCameras.length > 1 ? 'block' : 'none';
            
            // Start the camera after checking available devices
            await this.startCamera();
        } catch (error) {
            console.error('Error checking available cameras:', error);
            this.resultText.textContent = '❌ Unable to detect cameras';
        }
    }

    async switchCamera() {
        // Toggle facing mode
        this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
        
        // Stop current stream
        if (this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        
        // Restart camera with new facing mode
        await this.startCamera();
    }

    async startCamera() {
        try {
            // Check if we're in a secure context (HTTPS or localhost)
            if (!window.isSecureContext) {
                throw new Error('Secure context required');
            }

            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported');
            }

            // Show camera access pending message
            this.resultText.textContent = '📸 Requesting camera access...';
            console.log('Requesting camera access...');

            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    facingMode: this.currentFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });

            console.log('Camera access granted, setting up video stream...');
            this.videoElement.srcObject = stream;
            
            // Wait for video to be ready
            await new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    this.videoElement.play();
                    console.log('Video stream is ready and playing');
                    resolve();
                };
            });

            this.resultText.textContent = '✅ Camera ready!';
            this.captureBtn.disabled = false;
        } catch (error) {
            console.error('Error accessing camera:', error);
            let errorMessage = 'Camera access is required!';
            
            if (error.message === 'Secure context required') {
                errorMessage = '🔒 Camera access requires HTTPS or localhost.';
            } else if (error.message === 'getUserMedia not supported') {
                errorMessage = '❌ Your browser doesn\'t support camera access.';
            } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMessage = '🚫 Camera permission denied. Please allow camera access and refresh the page.';
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                errorMessage = '❌ No camera found. Please connect a camera and refresh the page.';
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                errorMessage = '❌ Camera is in use by another application. Please close other apps using the camera.';
            }
            
            this.resultText.textContent = errorMessage;
            this.captureBtn.disabled = true;
        }
    }

    async captureImage() {
        // Set canvas size to match video dimensions
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;
        
        // Draw the current video frame onto the canvas
        this.canvas.drawImage(this.videoElement, 0, 0);
        
        // Convert the canvas to base64 image
        const imageData = this.canvasElement.toDataURL('image/jpeg');
        
        // Show loading state
        this.resultText.textContent = '✨ Looking at your picture...';
        
        // Analyze the image using Gemini API
        await this.analyzeImage(imageData);
    }

    async analyzeImage(imageData) {
        try {
            if (!imageData) {
                throw new Error('No image data provided');
            }

            console.log('Sending image to Gemini API...');
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Please describe the main object in this image in 2-6 words simple description for children that focuses on object name, reaction, colour and shapes for easy understanding with relevant emojies related to the object, colour and shapes. Do not have any additional words or sentences.'
                        }, {
                            inlineData: {
                                mimeType: 'image/jpeg',
                                data: imageData.split(',')[1]
                            }
                        }]
                    }]
                })
            });

            const responseText = await response.text();
            let data;
            
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse API response:', responseText);
                throw new Error('Invalid JSON response from API');
            }

            if (!response.ok) {
                console.error('API Error:', response.status, data);
                if (data.error) {
                    throw new Error(`API Error: ${data.error.message || 'Unknown API error'}`);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                console.error('Unexpected API response format:', data);
                throw new Error('Invalid API response format');
            }

            const result = data.candidates[0].content.parts[0].text;
            this.resultText.textContent = `${result} 🎈`;

        } catch (error) {
            console.error('Error analyzing image:', error);
            this.resultText.textContent = `❌ ${error.message || 'Something went wrong! Let\'s try again!'}`;
        }
    }
}

// Initialize the app when the page loads
window.addEventListener('load', () => {
    new ImageDescriber();
});