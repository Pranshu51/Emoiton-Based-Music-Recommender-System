// DOM Elements
const video = document.getElementById('video');
const currentMood = document.getElementById('current-mood');
const emotionDetectBtn = document.getElementById('emotionDetectBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const moodRecommendations = document.getElementById('mood-recommendations');
const recentTracks = document.getElementById('recent-tracks');
const trendingTracks = document.getElementById('trending-tracks');
const emotionDetectionDialog = document.getElementById('emotionDetectionDialog');
const webcamElement = document.getElementById('webcam');
const stopEmotionBtn = document.getElementById('stopEmotionBtn');
const emotionResult = document.getElementById('emotion-result');

// State
let isPlaying = false;
let currentEmotion = null;
let faceDetectionModel = null;
let emotionDetectionInterval = null;
let videoStream = null;

// Sample Data (Replace with actual API data)
const sampleTracks = [
    { id: 1, title: 'Happy Vibes', artist: 'Artist 1', mood: 'Happy', cover: 'placeholder.jpg' },
    { id: 2, title: 'Chill Mode', artist: 'Artist 2', mood: 'Relaxed', cover: 'placeholder.jpg' },
    { id: 3, title: 'Energy Boost', artist: 'Artist 3', mood: 'Energetic', cover: 'placeholder.jpg' },
    { id: 4, title: 'Peaceful Mind', artist: 'Artist 4', mood: 'Calm', cover: 'placeholder.jpg' },
    { id: 5, title: 'Focus Time', artist: 'Artist 5', mood: 'Focused', cover: 'placeholder.jpg' },
    // Spiritual Music
    { id: 6, title: 'Om Meditation', artist: 'Spiritual Artist 1', mood: 'Meditation', category: 'Spiritual', cover: 'placeholder.jpg' },
    { id: 7, title: 'Sacred Mantras', artist: 'Spiritual Artist 2', mood: 'Mantras', category: 'Spiritual', cover: 'placeholder.jpg' },
    { id: 8, title: 'Divine Bhajans', artist: 'Spiritual Artist 3', mood: 'Bhajans', category: 'Spiritual', cover: 'placeholder.jpg' },
    { id: 9, title: 'Zen Garden', artist: 'Spiritual Artist 4', mood: 'Zen', category: 'Spiritual', cover: 'placeholder.jpg' },
    { id: 10, title: 'Sacred Chants', artist: 'Spiritual Artist 5', mood: 'Sacred', category: 'Spiritual', cover: 'placeholder.jpg' }
];

// Initialize Face Detection
async function initFaceDetection() {
    try {
        faceDetectionModel = await faceapi.loadFaceExpressionModel('/models');
        console.log('Face detection model loaded');
    } catch (error) {
        console.error('Error loading face detection model:', error);
    }
}

// Start Camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();

        // Show the emotion capture overlay
        const overlay = document.querySelector('.emotion-overlay');
        overlay.classList.add('active');

        // Start emotion detection after a short delay
        setTimeout(() => {
            detectEmotion();
        }, 1000);
    } catch (error) {
        console.error('Error accessing camera:', error);
        currentMood.textContent = 'Camera access denied';
    }
}

// Detect Emotion
async function detectEmotion() {
    if (!faceDetectionModel || !video.srcObject) return;

    try {
        const detections = await faceDetectionModel.detectSingleFace(video).withFaceExpressions();
        
        if (detections) {
            const emotion = Object.entries(detections.expressions)
                .reduce((prev, current) => (prev[1] > current[1] ? prev : current))[0];
            
            currentEmotion = emotion;
            currentMood.textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);
            updateMoodRecommendations(emotion);

            // Keep the overlay visible while detecting
            const overlay = document.querySelector('.emotion-overlay');
            overlay.classList.add('active');
        } else {
            currentMood.textContent = 'No face detected';
            // Hide the overlay when no face is detected
            const overlay = document.querySelector('.emotion-overlay');
            overlay.classList.remove('active');
        }

        requestAnimationFrame(detectEmotion);
    } catch (error) {
        console.error('Error detecting emotion:', error);
        const overlay = document.querySelector('.emotion-overlay');
        overlay.classList.remove('active');
    }
}

// Update Music Recommendations
function updateMoodRecommendations(mood) {
    const recommendations = sampleTracks.filter(track => track.mood.toLowerCase() === mood.toLowerCase());
    displayTracks(moodRecommendations, recommendations);
}

// Display Tracks
function displayTracks(container, tracks) {
    container.innerHTML = tracks.map(track => `
        <div class="track-card" data-id="${track.id}">
            <img src="${track.cover}" alt="${track.title}">
            <h3>${track.title}</h3>
            <p>${track.artist}</p>
            <span class="mood-tag">${track.mood}</span>
        </div>
    `).join('');
}

// Handle Play/Pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = `<i class="material-icons">${isPlaying ? 'pause' : 'play_arrow'}</i>`;
}

// Handle navigation and section display
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const section = document.querySelector(`#${sectionId}-section`);
    if (section) {
        section.style.display = 'block';
        
        // Handle empty states
        if (sectionId === 'playlists') {
            const playlists = getPlaylists();
            if (!playlists || playlists.length === 0) {
                section.innerHTML = `
                    <div class="empty-state">
                        <i class="material-icons">queue_music</i>
                        <h3>No Playlists Yet</h3>
                        <p>Create your first playlist to start organizing your music!</p>
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                            Create Playlist
                        </button>
                    </div>
                `;
            }
        } else if (sectionId === 'spirituality') {
            const spiritualContent = getSpiritualContent();
            if (!spiritualContent || spiritualContent.length === 0) {
                section.innerHTML = `
                    <div class="empty-state">
                        <i class="material-icons">self_improvement</i>
                        <h3>Spiritual Content Coming Soon</h3>
                        <p>We're working on bringing you the best spiritual and meditation music.</p>
                    </div>
                `;
            }
        }
    }
}

// Helper functions for getting content
function getPlaylists() {
    // This should be replaced with actual API call
    return JSON.parse(localStorage.getItem('playlists')) || [];
}

function getSpiritualContent() {
    // This should be replaced with actual API call
    return [];
}

// Navigation
document.querySelectorAll('.mdl-navigation__link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.mdl-navigation__link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding section
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId);
    });
});

// Event Listeners
emotionDetectBtn.addEventListener('click', startCamera);
playPauseBtn.addEventListener('click', togglePlayPause);

// Emotion Detection
if (!emotionDetectionDialog.showModal) {
    dialogPolyfill.registerDialog(emotionDetectionDialog);
}

document.getElementById('emotionDetectBtn').addEventListener('click', startEmotionDetection);
stopEmotionBtn.addEventListener('click', stopEmotionDetection);
emotionDetectionDialog.querySelector('.close').addEventListener('click', () => {
    stopEmotionDetection();
    emotionDetectionDialog.close();
});

async function startEmotionDetection() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamElement.srcObject = videoStream;
        emotionDetectionDialog.showModal();
        
        // Load face detection model
        const model = await faceDetection.createDetector(faceDetection.SupportedModels.MediaPipeFaceDetector);
        
        emotionDetectionInterval = setInterval(async () => {
            const faces = await model.estimateFaces(webcamElement);
            if (faces.length > 0) {
                // Here you would implement actual emotion detection
                // For demo, we'll just show that face was detected
                emotionResult.textContent = 'Face detected! Analyzing emotion...';
            } else {
                emotionResult.textContent = 'No face detected';
            }
        }, 100);
    } catch (error) {
        console.error('Error accessing webcam:', error);
        alert('Unable to access webcam. Please make sure you have granted camera permissions.');
    }
}

function stopEmotionDetection() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    if (emotionDetectionInterval) {
        clearInterval(emotionDetectionInterval);
        emotionDetectionInterval = null;
    }
    emotionResult.textContent = '';
}

// Category Icons and Data
const categories = {
    'chill': {
        icon: 'https://i.imgur.com/1234chill.jpg',
        description: 'Relaxing beats for your downtime'
    },
    'party': {
        icon: 'https://i.imgur.com/1234party.jpg',
        description: 'High-energy tracks to get the party started'
    },
    'focus': {
        icon: 'https://i.imgur.com/1234focus.jpg',
        description: 'Concentration-enhancing music'
    },
    'workout': {
        icon: 'https://i.imgur.com/1234workout.jpg',
        description: 'Motivating beats for your exercise'
    },
    'sleep': {
        icon: 'https://i.imgur.com/1234sleep.jpg',
        description: 'Calming sounds for better sleep'
    },
    'meditation': {
        icon: 'https://i.imgur.com/1234meditation.jpg',
        description: 'Peaceful music for mindfulness'
    }
};

// Add category icons to navigation
document.querySelectorAll('.mdl-navigation__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
        const category = href.substring(1);
        if (categories[category]) {
            const icon = document.createElement('img');
            icon.src = categories[category].icon;
            icon.className = 'category-icon';
            link.insertBefore(icon, link.firstChild);
        }
    }
});

// Create category cards in main content
function createCategorySection() {
    const container = document.createElement('div');
    container.className = 'category-container';
    
    Object.entries(categories).forEach(([key, data]) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <img src="${data.icon}" alt="${key}">
            <div class="category-info">
                <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p>${data.description}</p>
            </div>
        `;
        container.appendChild(card);
    });
    
    return container;
}

// Add category section to main content
const mainContent = document.querySelector('main');
mainContent.appendChild(createCategorySection());

// Pop-up functionality
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('welcomePopup');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        closePopup();
    }, 3000);
});

function closePopup() {
    const popup = document.getElementById('welcomePopup');
    popup.style.animation = 'fadeOut 0.5s ease-out forwards';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 500);
}

// Initialize
window.addEventListener('load', () => {
    initFaceDetection();
    displayTracks(recentTracks, sampleTracks.slice(0, 4));
    displayTracks(trendingTracks, sampleTracks.slice().reverse());
});
