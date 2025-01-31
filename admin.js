// Constants
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'ADMIN123';

// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const addSongBtn = document.getElementById('addSongBtn');
const addSongDialog = document.getElementById('addSongDialog');
const navigationLinks = document.querySelectorAll('.mdl-navigation__link');
const sections = document.querySelectorAll('.section');

// Initialize Material Design Lite dialog
if (!addSongDialog.showModal) {
    dialogPolyfill.registerDialog(addSongDialog);
}

// Event Listeners
logoutBtn.addEventListener('click', logout);
addSongBtn.addEventListener('click', () => addSongDialog.showModal());
addSongDialog.querySelector('.close').addEventListener('click', () => addSongDialog.close());
addSongDialog.querySelector('#addSongSubmit').addEventListener('click', handleAddSong);

navigationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = e.target.getAttribute('href').substring(1);
        showSection(targetSection);
    });
});

// Navigation Functions
function showSection(sectionId) {
    // Update navigation links
    navigationLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Show selected section
    sections.forEach(section => {
        if (section.id === `${sectionId}-section`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Load section data
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'music':
            loadMusicData();
            break;
        case 'users':
            loadUserData();
            break;
        case 'emotions':
            loadEmotionData();
            break;
    }
}

// Authentication Functions
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('session'));
    if (!user || !user.isAdmin) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('session');
    window.location.href = 'index.html';
}

// Data Loading Functions
async function loadDashboardData() {
    try {
        // Update statistics
        document.getElementById('total-users').textContent = await getTotalUsers();
        document.getElementById('total-songs').textContent = await getTotalSongs();
        document.getElementById('active-users').textContent = await getActiveUsers();
        document.getElementById('total-playlists').textContent = await getTotalPlaylists();

        // Update emotion distribution chart
        const emotionData = await getEmotionDistribution();
        updateEmotionChart(emotionData);

        // Update recent activity
        const activities = await getRecentActivity();
        updateRecentActivity(activities);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadMusicData() {
    try {
        const songs = await getSongs();
        updateSongsTable(songs);
    } catch (error) {
        console.error('Error loading music data:', error);
    }
}

async function loadUserData() {
    try {
        const users = await getUsers();
        updateUsersTable(users);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function loadEmotionData() {
    try {
        const trends = await getEmotionTrends();
        updateEmotionTrendsChart(trends);
    } catch (error) {
        console.error('Error loading emotion data:', error);
    }
}

// Mock API Functions (Replace with actual API calls)
async function getTotalUsers() {
    return 1250;
}

async function getTotalSongs() {
    return 5000;
}

async function getActiveUsers() {
    return 750;
}

async function getTotalPlaylists() {
    return 300;
}

async function getEmotionDistribution() {
    return {
        labels: ['Happy', 'Sad', 'Energetic', 'Calm', 'Angry'],
        data: [30, 25, 20, 15, 10]
    };
}

async function getRecentActivity() {
    return [
        { type: 'user', action: 'New user registered', time: '5 minutes ago' },
        { type: 'song', action: 'New song uploaded', time: '10 minutes ago' },
        { type: 'emotion', action: 'Emotion analysis completed', time: '15 minutes ago' }
    ];
}

async function getSongs() {
    return [
        { id: 1, title: 'Happy Days', artist: 'John Doe', duration: '3:45', mood: 'Happy' },
        { id: 2, title: 'Midnight Blues', artist: 'Jane Smith', duration: '4:20', mood: 'Sad' }
    ];
}

async function getUsers() {
    return [
        { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2023-01-01', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2023-02-15', status: 'Inactive' }
    ];
}

async function getEmotionTrends() {
    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
            {
                label: 'Happy',
                data: [30, 35, 25, 40, 35]
            },
            {
                label: 'Sad',
                data: [20, 25, 30, 25, 20]
            }
        ]
    };
}

// UI Update Functions
function updateEmotionChart(data) {
    const ctx = document.getElementById('emotion-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: [
                    '#1db954',
                    '#1ed760',
                    '#1fdf64',
                    '#20e75b',
                    '#21ef52'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateEmotionTrendsChart(data) {
    const ctx = document.getElementById('emotion-trends-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: data.datasets.map((dataset, index) => ({
                ...dataset,
                borderColor: index === 0 ? '#1db954' : '#1ed760',
                fill: false
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateRecentActivity(activities) {
    const activityList = document.getElementById('recent-activity');
    activityList.innerHTML = activities.map(activity => `
        <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-icon">
                    ${getActivityIcon(activity.type)}
                </i>
                ${activity.action}
                <span class="mdl-list__item-sub-title">${activity.time}</span>
            </span>
        </li>
    `).join('');
}

function updateSongsTable(songs) {
    const tableBody = document.getElementById('songs-table-body');
    tableBody.innerHTML = songs.map(song => `
        <tr>
            <td class="mdl-data-table__cell--non-numeric">${song.title}</td>
            <td class="mdl-data-table__cell--non-numeric">${song.artist}</td>
            <td>${song.duration}</td>
            <td class="mdl-data-table__cell--non-numeric">${song.mood}</td>
            <td>
                <button class="mdl-button mdl-js-button mdl-button--icon" onclick="editSong(${song.id})">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-button--icon" onclick="deleteSong(${song.id})">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateUsersTable(users) {
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td class="mdl-data-table__cell--non-numeric">${user.name}</td>
            <td class="mdl-data-table__cell--non-numeric">${user.email}</td>
            <td>${user.joinDate}</td>
            <td>${user.status}</td>
            <td>
                <button class="mdl-button mdl-js-button mdl-button--icon" onclick="editUser(${user.id})">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-button--icon" onclick="deleteUser(${user.id})">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Utility Functions
function getActivityIcon(type) {
    switch (type) {
        case 'user':
            return 'person';
        case 'song':
            return 'music_note';
        case 'emotion':
            return 'mood';
        default:
            return 'info';
    }
}

// Song Management Functions
async function handleAddSong(e) {
    e.preventDefault();
    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('artistName').value;
    const file = document.getElementById('songFile').files[0];

    if (!title || !artist || !file) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // TODO: Implement actual song upload
        console.log('Uploading song:', { title, artist, file });
        addSongDialog.close();
        loadMusicData(); // Refresh the table
    } catch (error) {
        console.error('Error uploading song:', error);
        alert('Failed to upload song. Please try again.');
    }
}

function editSong(songId) {
    // TODO: Implement song editing
    console.log('Editing song:', songId);
}

function deleteSong(songId) {
    // TODO: Implement song deletion
    if (confirm('Are you sure you want to delete this song?')) {
        console.log('Deleting song:', songId);
    }
}

// User Management Functions
function editUser(userId) {
    // TODO: Implement user editing
    console.log('Editing user:', userId);
}

function deleteUser(userId) {
    // TODO: Implement user deletion
    if (confirm('Are you sure you want to delete this user?')) {
        console.log('Deleting user:', userId);
    }
}

// Initialize the admin dashboard
function init() {
    checkAuth();
    showSection('dashboard');
}

init();
