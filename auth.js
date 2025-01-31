// User authentication and profile management

class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('user')) || null;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    login(email, password) {
        // For demo purposes, using simple validation
        if (email && password) {
            const user = {
                id: 1,
                email: email,
                name: email.split('@')[0],
                avatar: 'https://ui-avatars.com/api/?name=' + email.split('@')[0]
            };
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUser = user;
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser = null;
        window.location.reload();
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth
const auth = new Auth();

// Login dialog setup
const loginDialog = document.createElement('dialog');
loginDialog.className = 'mdl-dialog';
loginDialog.innerHTML = `
    <h4 class="mdl-dialog__title">Login</h4>
    <div class="mdl-dialog__content">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="email" id="loginEmail">
            <label class="mdl-textfield__label" for="loginEmail">Email</label>
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="password" id="loginPassword">
            <label class="mdl-textfield__label" for="loginPassword">Password</label>
        </div>
    </div>
    <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button login">Login</button>
        <button type="button" class="mdl-button close">Cancel</button>
    </div>
`;
document.body.appendChild(loginDialog);

// Profile dialog setup
const profileDialog = document.createElement('dialog');
profileDialog.className = 'mdl-dialog';
profileDialog.innerHTML = `
    <h4 class="mdl-dialog__title">Profile</h4>
    <div class="mdl-dialog__content">
        <div class="profile-info">
            <img id="profileAvatar" src="" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 15px;">
            <p id="profileName" style="font-size: 18px; margin: 10px 0;"></p>
            <p id="profileEmail" style="color: #666;"></p>
        </div>
    </div>
    <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button logout">Logout</button>
        <button type="button" class="mdl-button close">Close</button>
    </div>
`;
document.body.appendChild(profileDialog);

// Initialize Material Design Lite dialogs
if (!loginDialog.showModal) {
    dialogPolyfill.registerDialog(loginDialog);
}
if (!profileDialog.showModal) {
    dialogPolyfill.registerDialog(profileDialog);
}

// Event Listeners
document.getElementById('userProfileBtn').addEventListener('click', () => {
    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        document.getElementById('profileAvatar').src = user.avatar;
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        profileDialog.showModal();
    } else {
        loginDialog.showModal();
    }
});

loginDialog.querySelector('.close').addEventListener('click', () => {
    loginDialog.close();
});

loginDialog.querySelector('.login').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (auth.login(email, password)) {
        loginDialog.close();
        window.location.reload();
    } else {
        alert('Invalid credentials');
    }
});

profileDialog.querySelector('.close').addEventListener('click', () => {
    profileDialog.close();
});

profileDialog.querySelector('.logout').addEventListener('click', () => {
    auth.logout();
    profileDialog.close();
});
