document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const saveBtn = document.getElementById('save-btn');
    const colorDisplay = document.getElementById('color-display');
    const hexCode = document.getElementById('hex-code');
    const favoritesList = document.getElementById('favorites-list');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const welcomeText = document.getElementById('welcome-text');
    const colorGenerator = document.getElementById('color-generator');

    const MAX_FAVORITES = 10;

    const generateRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        colorDisplay.style.backgroundColor = randomColor;
        hexCode.textContent = randomColor;
        return randomColor;
    };

    const saveToFavorites = (color) => {
        const user = getCurrentUser();
        if (!user) return;
        
        let favorites = JSON.parse(localStorage.getItem(user)) || [];
        if (!favorites.includes(color) && favorites.length < MAX_FAVORITES) {
            favorites.push(color);
            localStorage.setItem(user, JSON.stringify(favorites));
            displayFavorites();
        }
    };

    const displayFavorites = () => {
        const user = getCurrentUser();
        if (!user) return;

        const favorites = JSON.parse(localStorage.getItem(user)) || [];
        favoritesList.innerHTML = '';
        favorites.forEach(color => {
            const li = document.createElement('li');
            li.innerHTML = `<span style="background-color: ${color};"></span>${color}<button onclick="removeFromFavorites('${color}')">Odstranit</button>`;
            favoritesList.appendChild(li);
        });
    };

    window.removeFromFavorites = (color) => {
        const user = getCurrentUser();
        if (!user) return;

        let favorites = JSON.parse(localStorage.getItem(user)) || [];
        favorites = favorites.filter(fav => fav !== color);
        localStorage.setItem(user, JSON.stringify(favorites));
        displayFavorites();
    };

    const getCurrentUser = () => {
        return localStorage.getItem('currentUser');
    };

    const loginUser = (username, password) => {
        const storedPassword = localStorage.getItem(`user_${username}`);
        if (storedPassword === password) {
            localStorage.setItem('currentUser', username);
            showUserInterface(username);
        } else {
            alert('Nesprávné uživatelské jméno nebo heslo.');
        }
    };

    const registerUser = (username, password) => {
        if (localStorage.getItem(`user_${username}`)) {
            alert('Uživatelské jméno již existuje.');
        } else {
            localStorage.setItem(`user_${username}`, password);
            alert('Registrace byla úspěšná. Nyní se můžete přihlásit.');
        }
    };

    const showUserInterface = (username) => {
        loginForm.style.display = 'none';
        welcomeMessage.style.display = 'block';
        colorGenerator.style.display = 'block';
        welcomeText.textContent = `Vítejte, ${username}!`;
        displayFavorites();
    };

    const logoutUser = () => {
        localStorage.removeItem('currentUser');
        loginForm.style.display = 'block';
        welcomeMessage.style.display = 'none';
        colorGenerator.style.display = 'none';
    };

    generateBtn.addEventListener('click', generateRandomColor);
    saveBtn.addEventListener('click', () => {
        const color = hexCode.textContent;
        if (color) saveToFavorites(color);
    });

    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (username && password) {
            loginUser(username, password);
        }
    });

    registerBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (username && password) {
            registerUser(username, password);
        }
    });

    logoutBtn.addEventListener('click', logoutUser);

    const user = getCurrentUser();
    if (user) {
        showUserInterface(user);
    }
});
