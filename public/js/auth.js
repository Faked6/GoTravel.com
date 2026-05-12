// ===============================================================
// auth.js — Authentication, Modals & Navigation
// ===============================================================

function injectAuthModals() {
    const modalsHTML = `
    <div class="auth-modal" id="login-modal">
        <div class="auth-modal-content">
            <button class="auth-close" onclick="closeAuthModals()"><i class="fa-solid fa-xmark"></i></button>
            <h2>Sign In</h2>
            <form id="login-form">
                <div class="auth-form-group">
                    <label>Email</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="auth-form-group">
                    <label>Password</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="auth-submit-btn">Sign In</button>
            </form>
            <div class="auth-toggle">
                Don't have an account? <a onclick="openRegister()">Register here</a>
            </div>
        </div>
    </div>

    <div class="auth-modal" id="register-modal">
        <div class="auth-modal-content">
            <button class="auth-close" onclick="closeAuthModals()"><i class="fa-solid fa-xmark"></i></button>
            <h2>Create Account</h2>
            <form id="register-form">
                <div class="auth-form-group">
                    <label>Full Name</label>
                    <input type="text" id="register-name" required>
                </div>
                <div class="auth-form-group">
                    <label>Email</label>
                    <input type="email" id="register-email" required>
                </div>
                <div class="auth-form-group">
                    <label>Password</label>
                    <input type="password" id="register-password" required>
                </div>
                <button type="submit" class="auth-submit-btn">Register</button>
            </form>
            <div class="auth-toggle">
                Already have an account? <a onclick="openLogin()">Sign In here</a>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalsHTML);

    // Custom Alert & Confirm Modals
    document.body.insertAdjacentHTML('beforeend', `
        <div class="custom-alert-overlay" id="custom-alert">
            <div class="custom-alert-box">
                <div class="custom-alert-msg" id="custom-alert-msg"></div>
                <div class="custom-alert-buttons">
                    <button class="custom-btn-primary" onclick="document.getElementById('custom-alert').classList.remove('active')">OK</button>
                </div>
            </div>
        </div>
        <div class="custom-alert-overlay" id="custom-confirm">
            <div class="custom-alert-box">
                <div class="custom-alert-msg" id="custom-confirm-msg"></div>
                <div class="custom-alert-buttons">
                    <button class="custom-btn-secondary" onclick="document.getElementById('custom-confirm').classList.remove('active')">Cancel</button>
                    <button class="custom-btn-primary" id="custom-confirm-btn">Confirm</button>
                </div>
            </div>
        </div>
    `);

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    bindBookingButtons();
}

function bindBookingButtons() {
    const buttons = document.querySelectorAll('.property-price .primary-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const propertyName = this.closest('.property-item').querySelector('h3').innerText;
            const priceText = this.closest('.property-item').querySelector('.property-price').innerText;
            const priceMatch = priceText.match(/\$(\d+)/);
            const basePrice = priceMatch ? parseInt(priceMatch[1]) : 0;
            openBooking(propertyName, basePrice);
        });
    });
}

window.openBooking = function (propertyName, basePrice) {
    const userData = localStorage.getItem('gotravel_user');
    if (!userData) {
        customAlert('Please sign in or register to book a property.');
        openLogin();
        return;
    }
    const url = `booking.html?hotel=${encodeURIComponent(propertyName)}&price=${basePrice}`;
    window.location.href = url;
};

window.customAlert = function (msg) {
    document.getElementById('custom-alert-msg').innerText = msg;
    document.getElementById('custom-alert').classList.add('active');
};

window.customConfirm = function (msg, onConfirm) {
    document.getElementById('custom-confirm-msg').innerText = msg;
    const btn = document.getElementById('custom-confirm-btn');
    btn.onclick = function () {
        document.getElementById('custom-confirm').classList.remove('active');
        if (onConfirm) onConfirm();
    };
    document.getElementById('custom-confirm').classList.add('active');
};

window.openLogin = function () {
    closeAuthModals();
    document.getElementById('login-modal').classList.add('active');
};

window.openRegister = function () {
    closeAuthModals();
    document.getElementById('register-modal').classList.add('active');
};

window.closeAuthModals = function () {
    document.getElementById('login-modal').classList.remove('active');
    document.getElementById('register-modal').classList.remove('active');
};

window.logout = function () {
    localStorage.removeItem('gotravel_user');
    renderNavActions();
};

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('gotravel_user', JSON.stringify(data.user));
            closeAuthModals();
            renderNavActions();
        } else {
            customAlert(data.error);
        }
    } catch (err) {
        customAlert('Error connecting to server.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('gotravel_user', JSON.stringify(data.user));
            closeAuthModals();
            renderNavActions();
        } else {
            customAlert(data.error);
        }
    } catch (err) {
        customAlert('Error connecting to server.');
    }
}

function renderNavActions() {
    const container = document.getElementById('nav-actions-container');
    if (!container) return;

    const userData = localStorage.getItem('gotravel_user');
    if (userData) {
        const user = JSON.parse(userData);
        const adminLink = user.is_admin
            ? `<a href="admin.html" class="auth-btn" style="background: linear-gradient(135deg,#1a1a2e,#0f3460); text-decoration:none;"><i class="fa-solid fa-shield-halved"></i> Admin</a>`
            : '';
        container.innerHTML = `
            <div class="nav-user-greeting">
                <i class="fa-regular fa-circle-user"></i>
                <span>Welcome, ${user.name.split(' ')[0]}</span>
            </div>
            <a href="my-bookings.html" class="auth-btn" style="text-decoration: none;">My Bookings</a>
            ${adminLink}
            <button class="auth-btn" onclick="logout()">Logout</button>
        `;
    } else {
        container.innerHTML = `
            <button class="auth-btn" onclick="openRegister()">Register</button>
            <button class="auth-btn" onclick="openLogin()">Sign in</button>
        `;
    }
}
