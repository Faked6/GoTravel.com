document.addEventListener('DOMContentLoaded', () => {
    
    // Add simple interaction to search items
    const searchItems = document.querySelectorAll('.search-item');
    
    searchItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active state from all
            searchItems.forEach(i => i.style.outline = 'none');
            
            // Add focus outline
            item.style.outline = '2px solid var(--accent-hover)';
            item.style.outlineOffset = '-2px';
            
            // Focus input if exists
            const input = item.querySelector('input');
            if (input && !input.readOnly) {
                input.focus();
            }
        });
    });

    // Remove outline when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-item')) {
            searchItems.forEach(i => i.style.outline = 'none');
        }
    });

    // Simple alert for Search Button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const dest = document.getElementById('destination').value || 'Anywhere';
            alert(`Searching for properties in ${dest}...`);
        });
    }

    // Dates placeholder interaction
    const datesInput = document.getElementById('dates');
    if (datesInput) {
        datesInput.addEventListener('click', () => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            datesInput.value = `${formatDate(today)} - ${formatDate(tomorrow)}`;
        });
    }

    // ================= Auth System Logic =================
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
        </div>

        <div class="auth-modal" id="booking-modal">
            <div class="auth-modal-content">
                <button class="auth-close" onclick="closeAuthModals()"><i class="fa-solid fa-xmark"></i></button>
                <h2>Book Your Stay</h2>
                <h4 id="booking-property-name" style="text-align: center; color: var(--text-light); margin-bottom: 20px;"></h4>
                <form id="booking-form">
                    <div class="auth-form-group">
                        <label>Guests</label>
                        <input type="number" id="booking-guests" min="1" value="1" required>
                    </div>
                    <div class="auth-form-group">
                        <label>Check-In Date</label>
                        <input type="date" id="booking-checkin" required>
                    </div>
                    <div class="auth-form-group">
                        <label>Check-Out Date</label>
                        <input type="date" id="booking-checkout" required>
                    </div>
                    <h3 id="booking-total" style="text-align: center; color: var(--primary); margin-bottom: 15px;">Total: $0</h3>
                    <button type="submit" class="auth-submit-btn">Confirm Booking</button>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalsHTML);

        // Bind events
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('register-form').addEventListener('submit', handleRegister);
        document.getElementById('booking-form').addEventListener('submit', handleBooking);
        
        document.getElementById('booking-checkin').addEventListener('change', calcTotalPrice);
        document.getElementById('booking-checkout').addEventListener('change', calcTotalPrice);
        document.getElementById('booking-guests').addEventListener('input', calcTotalPrice);
        
        bindBookingButtons();
    }

    function bindBookingButtons() {
        const buttons = document.querySelectorAll('.property-price .primary-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const propertyName = this.closest('.property-item').querySelector('h3').innerText;
                const priceText = this.closest('.property-item').querySelector('.property-price').innerText;
                const priceMatch = priceText.match(/\$(\d+)/);
                const basePrice = priceMatch ? parseInt(priceMatch[1]) : 0;
                openBooking(propertyName, basePrice);
            });
        });
    }

    window.openBooking = function(propertyName, basePrice) {
        const userData = localStorage.getItem('gotravel_user');
        if (!userData) {
            alert('Please sign in or register to book a property.');
            openLogin();
            return;
        }
        document.getElementById('booking-property-name').innerText = propertyName;
        window.currentBasePrice = basePrice;
        calcTotalPrice();
        closeAuthModals();
        document.getElementById('booking-modal').classList.add('active');
    };

    function calcTotalPrice() {
        const checkin = document.getElementById('booking-checkin').value;
        const checkout = document.getElementById('booking-checkout').value;
        const guests = parseInt(document.getElementById('booking-guests').value) || 1;
        const totalEl = document.getElementById('booking-total');
        
        if (checkin && checkout && window.currentBasePrice) {
            const d1 = new Date(checkin);
            const d2 = new Date(checkout);
            const diffTime = d2 - d1;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
                const total = diffDays * window.currentBasePrice * guests;
                totalEl.innerText = `Total: $${total}`;
                totalEl.dataset.total = total;
            } else {
                totalEl.innerText = `Total: $0`;
                totalEl.dataset.total = 0;
            }
        } else {
            totalEl.innerText = `Total: $0`;
            totalEl.dataset.total = 0;
        }
    }

    window.openLogin = function() {
        closeAuthModals();
        document.getElementById('login-modal').classList.add('active');
    };

    window.openRegister = function() {
        closeAuthModals();
        document.getElementById('register-modal').classList.add('active');
    };

    window.closeAuthModals = function() {
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('register-modal').classList.remove('active');
        document.getElementById('booking-modal').classList.remove('active');
    };

    window.logout = function() {
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
                alert(data.error);
            }
        } catch (err) {
            alert('Error connecting to server.');
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
                alert(data.error);
            }
        } catch (err) {
            alert('Error connecting to server.');
        }
    }

    async function handleBooking(e) {
        e.preventDefault();
        const propertyName = document.getElementById('booking-property-name').innerText;
        const checkin = document.getElementById('booking-checkin').value;
        const checkout = document.getElementById('booking-checkout').value;
        const guests = parseInt(document.getElementById('booking-guests').value) || 1;
        const totalPrice = parseInt(document.getElementById('booking-total').dataset.total) || 0;
        const user = JSON.parse(localStorage.getItem('gotravel_user'));

        if (new Date(checkin) >= new Date(checkout)) {
            alert('Check-out date must be after check-in date.');
            return;
        }

        try {
            const res = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: user.email, 
                    property_name: propertyName, 
                    check_in: checkin, 
                    check_out: checkout,
                    persons: guests,
                    total_price: totalPrice
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert('Booking successful! Enjoy your trip!');
                closeAuthModals();
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Error connecting to server.');
        }
    }

    function renderNavActions() {
        const container = document.getElementById('nav-actions-container');
        if (!container) return;

        const userData = localStorage.getItem('gotravel_user');
        if (userData) {
            const user = JSON.parse(userData);
            container.innerHTML = `
                <div class="nav-user-greeting">
                    <i class="fa-regular fa-circle-user"></i>
                    <span>Welcome, ${user.name.split(' ')[0]}</span>
                </div>
                <a href="my-bookings.html" class="auth-btn" style="text-decoration: none;">My Bookings</a>
                <button class="auth-btn" onclick="logout()">Logout</button>
            `;
        } else {
            container.innerHTML = `
                <button class="auth-btn" onclick="openRegister()">Register</button>
                <button class="auth-btn" onclick="openLogin()">Sign in</button>
            `;
        }
    }

    injectAuthModals();
    renderNavActions();

    // ================= AI Assistant Logic =================
    const aiFab = document.getElementById('ai-fab');
    const aiModal = document.getElementById('ai-chat-modal');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('ai-chat-body');
    const chatOptions = document.getElementById('ai-chat-options');

    let currentQuestion = 0;
    let userTraits = [];

    const destinations = [
        { name: 'Bali, Indonesia', image: 'assets/dest_bali_1777425823195.png', url: 'bali.html', desc: 'Tropical paradise with beaches and culture.', traits: ['relax', 'warm', 'nature'] },
        { name: 'Jakarta, Indonesia', image: 'assets/dest_jakarta_1777426644763.png', url: 'jakarta.html', desc: 'Bustling metropolis with rich history.', traits: ['adventure', 'warm', 'city'] },
        { name: 'Paris, France', image: 'assets/dest_paris_1777425808838.png', url: 'paris.html', desc: 'City of light, perfect for romantic strolls.', traits: ['relax', 'cold', 'city'] },
        { name: 'Tokyo, Japan', image: 'assets/dest_tokyo_1777425846700.png', url: 'tokyo.html', desc: 'Neon lights and incredible food scene.', traits: ['adventure', 'cold', 'city'] },
        { name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=500&q=80', url: 'swiss-alps.html', desc: 'Majestic mountains and cozy chalets.', traits: ['relax', 'cold', 'nature'] },
        { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80', url: 'maldives.html', desc: 'Overwater bungalows and crystal clear water.', traits: ['relax', 'warm', 'nature'] },
        { name: 'Reykjavik, Iceland', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=500&q=80', url: 'reykjavik.html', desc: 'Glaciers, hot springs, and Northern Lights.', traits: ['adventure', 'cold', 'nature'] },
        { name: 'Costa Rica', image: 'https://images.unsplash.com/photo-1518182170546-076616fdcb2a?w=500&q=80', url: 'costa-rica.html', desc: 'Rainforests, volcanoes, and surfing.', traits: ['adventure', 'warm', 'nature'] },
        { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80', url: 'dubai.html', desc: 'Luxury shopping and modern architecture.', traits: ['relax', 'warm', 'city'] },
        { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80', url: 'new-york.html', desc: 'The city that never sleeps.', traits: ['adventure', 'warm', 'city'] },
        { name: 'Alabasta Kingdom', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80', url: 'alabasta.html', desc: 'A desert kingdom full of pirates and sandstorms.', traits: ['adventure', 'warm', 'city'] },
        { name: 'The Moon', image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=500&q=80', url: 'moon.html', desc: 'Zero gravity and zero atmosphere. The ultimate getaway.', traits: ['relax', 'cold', 'nature'] }
    ];

    const questions = [
        {
            text: "Hi there! I'm DestiBot. I can help you find your perfect vacation spot. Ready to start?",
            options: [
                { text: "Let's go!", value: null }
            ]
        },
        {
            text: "Great! First question: What's your ideal vacation vibe?",
            options: [
                { text: "Chill & Relax", value: "relax" },
                { text: "Action & Adventure", value: "adventure" }
            ]
        },
        {
            text: "Awesome. What kind of weather do you prefer?",
            options: [
                { text: "Warm & Sunny", value: "warm" },
                { text: "Cool & Crisp", value: "cold" }
            ]
        },
        {
            text: "Last question! Where would you rather be?",
            options: [
                { text: "Bustling City", value: "city" },
                { text: "Quiet Nature", value: "nature" }
            ]
        }
    ];

    if (aiFab && aiModal) {
        aiFab.addEventListener('click', () => {
            aiModal.classList.add('active');
            aiFab.style.display = 'none';
            if (chatBody.children.length === 0) {
                startChat();
            }
        });

        closeChat.addEventListener('click', () => {
            aiModal.classList.remove('active');
            aiFab.style.display = 'flex';
        });
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg bot';
        msgDiv.innerHTML = text;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg user';
        msgDiv.textContent = text;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator(callback) {
        chatOptions.innerHTML = ''; // Clear options while typing
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatBody.appendChild(typingDiv);
        scrollToBottom();

        setTimeout(() => {
            const ind = document.getElementById('typing-indicator');
            if (ind) ind.remove();
            callback();
        }, 1200); // Simulate typing delay
    }

    function renderOptions(options) {
        chatOptions.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => handleOptionSelect(opt));
            chatOptions.appendChild(btn);
        });
    }

    function startChat() {
        currentQuestion = 0;
        userTraits = [];
        showTypingIndicator(() => {
            addBotMessage(questions[0].text);
            renderOptions(questions[0].options);
        });
    }

    function handleOptionSelect(option) {
        addUserMessage(option.text);
        if (option.value) {
            userTraits.push(option.value);
        }
        
        currentQuestion++;
        
        showTypingIndicator(() => {
            if (currentQuestion < questions.length) {
                addBotMessage(questions[currentQuestion].text);
                renderOptions(questions[currentQuestion].options);
            } else {
                calculateDestination();
            }
        });
    }

    function calculateDestination() {
        // Find the best match
        let bestMatch = destinations[0];
        let maxScore = -1;

        destinations.forEach(dest => {
            let score = 0;
            userTraits.forEach(trait => {
                if (dest.traits.includes(trait)) {
                    score++;
                }
            });
            // Add a tiny bit of randomness for tie-breakers
            score += Math.random() * 0.1; 
            
            if (score > maxScore) {
                maxScore = score;
                bestMatch = dest;
            }
        });

        addBotMessage(`Based on your answers, I found the perfect place for you!`);
        
        setTimeout(() => {
            const cardHTML = `
                <div class="chat-dest-card">
                    <img src="${bestMatch.image}" alt="${bestMatch.name}" class="chat-dest-img">
                    <div class="chat-dest-info">
                        <h5>${bestMatch.name}</h5>
                        <p>${bestMatch.desc}</p>
                        <a href="${bestMatch.url}" class="chat-dest-btn">Explore ${bestMatch.name.split(',')[0]}</a>
                    </div>
                </div>
            `;
            addBotMessage(cardHTML);
            const restartBtn = document.createElement('button');
            restartBtn.className = 'chat-option-btn';
            restartBtn.textContent = 'Start Over';
            restartBtn.addEventListener('click', () => {
                chatBody.innerHTML = '';
                startChat();
            });
            chatOptions.innerHTML = '';
            chatOptions.appendChild(restartBtn);
            scrollToBottom();
        }, 600);
    }

});
