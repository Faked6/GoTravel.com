// ===============================================================
// chatbot.js — DestiBot AI Travel Assistant
// ===============================================================

// ── Auto-injection logic ──────────────────────────────────────
(function injectChatbotAssets() {
    // 1. Inject CSS
    const css = `
        /* FAB launcher */
        #ai-fab {
            position: fixed; bottom: 30px; right: 30px;
            width: 65px; height: 65px; border-radius: 50%;
            background: linear-gradient(135deg, #6c3ce1, #4f46e5);
            color: white; display: flex; align-items: center; justify-content: center;
            font-size: 28px; cursor: pointer; box-shadow: 0 8px 32px rgba(108,60,225,0.3);
            z-index: 1000; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #ai-fab:hover { transform: scale(1.1) rotate(5deg); }

        /* Chat Modal */
        #ai-chat-modal {
            position: fixed; bottom: 30px; right: 30px;
            width: 400px; height: 600px; max-height: 85vh;
            background: white; border-radius: 20px;
            box-shadow: 0 12px 48px rgba(0,0,0,0.15);
            display: none; flex-direction: column; overflow: hidden;
            z-index: 1001; animation: slideUp 0.4s ease-out;
        }
        #ai-chat-modal.active { display: flex; }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } }

        /* Header */
        .ai-chat-header {
            background: linear-gradient(135deg, #6c3ce1, #4f46e5);
            color: white; padding: 24px; display: flex; align-items: center; justify-content: space-between;
        }
        .ai-chat-header h3 { margin: 0; font-size: 18px; font-weight: 700; }
        #close-chat { cursor: pointer; font-size: 20px; opacity: 0.8; transition: opacity 0.2s; }
        #close-chat:hover { opacity: 1; }

        /* Chat Body */
        #ai-chat-body {
            flex: 1; overflow-y: auto; padding: 20px;
            background: #f8f9fb; display: flex; flex-direction: column; gap: 12px;
            scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
        }
        #ai-chat-body::-webkit-scrollbar { width: 5px; }
        #ai-chat-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        /* Messages */
        .chat-msg {
            max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.5;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } }
        .chat-msg.bot {
            align-self: flex-start; background: white; color: #1e293b;
            border-bottom-left-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .chat-msg.user {
            align-self: flex-end; background: #6c3ce1; color: white;
            border-bottom-right-radius: 4px;
        }

        /* Options */
        #ai-chat-options {
            padding: 16px; background: white; border-top: 1px solid #f1f5f9;
            display: flex; flex-direction: column; gap: 8px;
        }
        .chat-option-btn {
            background: #f1f5f9; border: none; padding: 10px 14px; border-radius: 10px;
            color: #475569; font-size: 14px; font-weight: 600; cursor: pointer;
            transition: all 0.2s; text-align: left;
        }
        .chat-option-btn:hover { background: #e2e8f0; color: #1e293b; }

        /* Cards */
        .chat-dest-card {
            background: white; border-radius: 12px; overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-top: 10px;
        }
        .chat-dest-img { width: 100%; height: 140px; object-fit: cover; }
        .chat-dest-info { padding: 16px; }
        .chat-dest-info h5 { margin: 0 0 6px; font-size: 16px; color: #1e293b; }
        .chat-dest-info p { margin: 0 0 12px; font-size: 13px; color: #64748b; }
        .chat-dest-btn {
            display: inline-block; background: #6c3ce1; color: white;
            text-decoration: none; padding: 10px 16px; border-radius: 8px;
            font-size: 13px; font-weight: 700; text-align: center;
        }

        /* Typing */
        .typing-indicator { align-self: flex-start; padding: 12px 16px; display: flex; gap: 4px; }
        .typing-dot { width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; animation: blink 1.4s infinite both; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }

        /* Mobile */
        @media (max-width: 480px) {
            #ai-chat-modal { width: calc(100vw - 40px); bottom: 20px; right: 20px; height: 500px; }
            #ai-fab { bottom: 20px; right: 20px; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // 2. Inject HTML
    const html = `
        <div id="ai-fab"><i class="fa-solid fa-robot"></i></div>
        <div id="ai-chat-modal">
            <div class="ai-chat-header">
                <h3><i class="fa-solid fa-wand-magic-sparkles"></i> DestiBot</h3>
                <i class="fa-solid fa-xmark" id="close-chat"></i>
            </div>
            <div id="ai-chat-body"></div>
            <div id="ai-chat-options"></div>
        </div>
    `;
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
})();

function initChatbot() {
    const aiFab = document.getElementById('ai-fab');
    const aiModal = document.getElementById('ai-chat-modal');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('ai-chat-body');
    const chatOptions = document.getElementById('ai-chat-options');

    if (!aiFab || !aiModal) return;

    let currentQuestion = 0;
    let userTraits = [];
    let userBudget = Infinity;

    // ── Destination data ──────────────────────────────────────────
    const destinations = [
        {
            name: 'Bali, Indonesia', image: 'assets/dest_bali_1777425823195.png', url: 'bali.html',
            desc: 'Tropical paradise with beaches and culture.',
            traits: ['relax', 'warm', 'nature', 'beach'],
            hotels: [
                { name: 'Uluwatu Ocean View Resort', price: 240 },
                { name: 'Seminyak Private Villa', price: 180 }
            ],
            experiences: [
                { name: 'Tanah Lot Sunset Tour', price: 45, type: 'Guided Tour', url: 'bali.html' },
                { name: 'Kuta Beach Surf Lessons', price: 35, type: 'Water Sports', url: 'bali.html' }
            ]
        },
        {
            name: 'Jakarta, Indonesia', image: 'assets/dest_jakarta_1777426644763.png', url: 'jakarta.html',
            desc: 'Bustling metropolis with rich history.',
            traits: ['adventure', 'warm', 'city', 'food'],
            hotels: [
                { name: 'Grand Indonesia Luxury Hotel', price: 150 },
                { name: 'Sudirman City View Apartments', price: 999 }
            ],
            experiences: [
                { name: 'Dufan Adventure Park', price: 25, type: 'Theme Park', url: 'jakarta.html' },
                { name: 'Old Town Heritage Tour', price: 40, type: 'Guided Tour', url: 'jakarta.html' }
            ]
        },
        {
            name: 'Paris, France', image: 'assets/dest_paris_1777425808838.png', url: 'paris.html',
            desc: 'City of light, perfect for romantic strolls.',
            traits: ['relax', 'cold', 'city', 'culture'],
            hotels: [
                { name: 'Eiffel View Hotel', price: 350 },
                { name: 'Champs-Élysées Apartment', price: 220 }
            ],
            experiences: [
                { name: 'Eiffel Tower Skip-the-Line', price: 38, type: 'Landmark', url: 'paris.html' },
                { name: 'Seine River Dinner Cruise', price: 89, type: 'River Cruise', url: 'paris.html' }
            ]
        },
        {
            name: 'Tokyo, Japan', image: 'assets/dest_tokyo_1777425846700.png', url: 'tokyo.html',
            desc: 'Neon lights and incredible food scene.',
            traits: ['adventure', 'cold', 'city', 'food'],
            hotels: [
                { name: 'Shinjuku Skyline Hotel', price: 280 },
                { name: 'Akihabara Budget Inn', price: 90 }
            ],
            experiences: [
                { name: 'TeamLab Planets Digital Art', price: 32, type: 'Digital Art', url: 'tokyo.html' },
                { name: 'Mt. Fuji Day Trip', price: 85, type: 'Day Trip', url: 'tokyo.html' }
            ]
        },
        {
            name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=500&q=80', url: 'swiss-alps.html',
            desc: 'Majestic mountains and cozy chalets.',
            traits: ['relax', 'cold', 'nature', 'culture'],
            hotels: [
                { name: 'Alpine Grand Chalet', price: 420 },
                { name: 'Cozy Mountain Lodge', price: 160 }
            ],
            experiences: [
                { name: 'Ski Day at Jungfrau Region', price: 120, type: 'Ski & Snow', url: 'swiss-alps.html' },
                { name: 'Glacier Express Scenic Train', price: 95, type: 'Scenic Train', url: 'swiss-alps.html' }
            ]
        },
        {
            name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80', url: 'maldives.html',
            desc: 'Overwater bungalows and crystal clear water.',
            traits: ['relax', 'warm', 'nature', 'beach'],
            hotels: [
                { name: 'Overwater Paradise Villa', price: 800 },
                { name: 'Lagoon Beach Bungalow', price: 320 }
            ],
            experiences: [
                { name: 'Coral Reef Snorkeling', price: 45, type: 'Snorkeling', url: 'maldives.html' },
                { name: 'Dolphin Watching Tour', price: 65, type: 'Wildlife Tour', url: 'maldives.html' }
            ]
        },
        {
            name: 'Reykjavik, Iceland', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=500&q=80', url: 'reykjavik.html',
            desc: 'Glaciers, hot springs, and Northern Lights.',
            traits: ['adventure', 'cold', 'nature', 'culture'],
            hotels: [
                { name: 'Northern Lights Retreat', price: 310 },
                { name: 'Reykjavik City Hostel', price: 70 }
            ],
            experiences: [
                { name: 'Northern Lights Chase', price: 90, type: 'Night Tour', url: 'reykjavik.html' },
                { name: 'Glacier Hike & Ice Caves', price: 110, type: 'Adventure', url: 'reykjavik.html' }
            ]
        },
        {
            name: 'Costa Rica', image: 'https://images.unsplash.com/photo-1518182170546-076616fdcb2a?w=500&q=80', url: 'costa-rica.html',
            desc: 'Rainforests, volcanoes, and surfing.',
            traits: ['adventure', 'warm', 'nature', 'beach'],
            hotels: [
                { name: 'Jungle Canopy Eco-Lodge', price: 200 },
                { name: 'Pacific Surf Hostel', price: 55 }
            ],
            experiences: [
                { name: 'Arenal Volcano Hike', price: 55, type: 'Volcano', url: 'costa-rica.html' },
                { name: 'Rainforest Zip-lining', price: 70, type: 'Adventure', url: 'costa-rica.html' }
            ]
        },
        {
            name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80', url: 'dubai.html',
            desc: 'Luxury shopping and modern architecture.',
            traits: ['relax', 'warm', 'city', 'culture'],
            hotels: [
                { name: 'Burj Al Arab Penthouse', price: 1500 },
                { name: 'Downtown Dubai Suites', price: 380 }
            ],
            experiences: [
                { name: 'Desert Safari & BBQ Dinner', price: 80, type: 'Desert Safari', url: 'dubai.html' },
                { name: 'IMG Worlds of Adventure', price: 65, type: 'Theme Park', url: 'dubai.html' }
            ]
        },
        {
            name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80', url: 'new-york.html',
            desc: 'The city that never sleeps.',
            traits: ['adventure', 'cold', 'city', 'food'],
            hotels: [
                { name: 'Manhattan Grand Hotel', price: 450 },
                { name: 'Brooklyn Budget Stay', price: 120 }
            ],
            experiences: [
                { name: 'Broadway Show Experience', price: 110, type: 'Entertainment', url: 'new-york.html' },
                { name: 'NYC Helicopter Tour', price: 225, type: 'Aerial Tour', url: 'new-york.html' }
            ]
        },
        {
            name: 'Alabasta Kingdom', image: 'assets/just-found-indian-location-that-makes-everything-have-a-lot-v0-1lrc9r5r29kd1.jpg', url: 'alabasta.html',
            desc: 'A desert kingdom full of ancient secrets.',
            traits: ['adventure', 'warm', 'culture', 'food'],
            hotels: [
                { name: 'Royal Palace Suites', price: 180 },
                { name: 'Desert Oasis Guesthouse', price: 60 }
            ],
            experiences: [
                { name: 'Desert Dune Camel Trek', price: 35, type: 'Desert Trek', url: 'alabasta.html' },
                { name: 'Ancient Ruins Guided Tour', price: 45, type: 'Guided Tour', url: 'alabasta.html' }
            ]
        },
        {
            name: 'The Moon', image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=500&q=80', url: 'moon.html',
            desc: 'Zero gravity and zero atmosphere. The ultimate getaway.',
            traits: ['adventure', 'cold', 'nature', 'culture'],
            hotels: [
                { name: 'Lunar Base Alpha', price: 9999 },
                { name: 'Zero-G Capsule Hotel', price: 500 }
            ],
            experiences: [
                { name: 'Zero-G Crater Walk', price: 999, type: 'Space Walk', url: 'moon.html' },
                { name: 'Lunar Sunrise Viewing', price: 599, type: 'Lunar Event', url: 'moon.html' }
            ]
        }
    ];

    // ── Questions ─────────────────────────────────────────────────
    const questions = [
        {
            text: "Hi! I'm DestiBot 🤖 Let's find your perfect destination. What kind of trip are you dreaming of?",
            trait: 'vibe',
            options: [
                { text: "🌴 Chill & Relax", value: "relax" },
                { text: "⚡ Action & Adventure", value: "adventure" },
                { text: "🍜 Food & Culture", value: "culture" },
                { text: "🏖️ Beach & Sun", value: "beach" }
            ]
        },
        {
            text: "Love it! What kind of weather makes you happy?",
            trait: 'weather',
            options: [
                { text: "☀️ Hot & Tropical", value: "warm" },
                { text: "❄️ Cool & Crisp", value: "cold" },
                { text: "🍂 Mild & Breezy", value: "warm" },
                { text: "🌧️ I love the rain!", value: "cold" }
            ]
        },
        {
            text: "Great choice! What's your ideal setting?",
            trait: 'setting',
            options: [
                { text: "🏙️ Bustling City", value: "city" },
                { text: "🌿 Quiet Nature", value: "nature" },
                { text: "🍕 Food & Nightlife", value: "food" },
                { text: "🎭 Arts & Culture", value: "culture" }
            ]
        },
        {
            text: "Almost there! What's your nightly budget per person?",
            trait: 'budget',
            options: [
                { text: "💰 Under $100", value: 100 },
                { text: "💳 $100–$300", value: 300 },
                { text: "💎 $300–$600", value: 600 },
                { text: "🏆 No limit!", value: Infinity }
            ]
        }
    ];

    // ── FAB toggle ────────────────────────────────────────────────
    aiFab.addEventListener('click', () => {
        aiModal.classList.add('active');
        aiFab.style.display = 'none';
        if (chatBody.children.length === 0) startChat();
    });

    closeChat.addEventListener('click', () => {
        aiModal.classList.remove('active');
        aiFab.style.display = 'flex';
    });

    // ── Helpers ───────────────────────────────────────────────────
    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.innerHTML = text;
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.textContent = text;
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function showTypingIndicator(callback) {
        chatOptions.innerHTML = '';
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
        }, 1000);
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

    // ── Flow ──────────────────────────────────────────────────────
    function startChat() {
        currentQuestion = 0;
        userTraits = [];
        userBudget = Infinity;
        showTypingIndicator(() => {
            addBotMessage(questions[0].text);
            renderOptions(questions[0].options);
        });
    }

    function handleOptionSelect(option) {
        addUserMessage(option.text);
        if (questions[currentQuestion].trait === 'budget') {
            userBudget = option.value;
        } else {
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
        let bestMatches = [];
        let maxScore = -1;

        destinations.forEach(dest => {
            let score = 0;
            userTraits.forEach(trait => {
                if (dest.traits.includes(trait)) score++;
            });
            if (score > maxScore) { maxScore = score; bestMatches = [dest]; }
            else if (score === maxScore) { bestMatches.push(dest); }
        });

        const bestMatch = bestMatches[Math.floor(Math.random() * bestMatches.length)];
        const affordableHotels = bestMatch.hotels.filter(h => h.price <= userBudget);
        const hotelToShow = affordableHotels.length > 0
            ? affordableHotels.sort((a, b) => b.price - a.price)[0]
            : bestMatch.hotels.sort((a, b) => a.price - b.price)[0];

        addBotMessage(`✨ Based on your answers, I think you'd love <strong>${bestMatch.name}</strong>!`);

        setTimeout(() => {
            addBotMessage(`
                <div class="chat-dest-card">
                    <img src="${bestMatch.image}" alt="${bestMatch.name}" class="chat-dest-img">
                    <div class="chat-dest-info">
                        <h5>${bestMatch.name}</h5>
                        <p>${bestMatch.desc}</p>
                        <a href="${bestMatch.url}" class="chat-dest-btn">Explore ${bestMatch.name.split(',')[0]}</a>
                    </div>
                </div>
            `);
        }, 600);

        setTimeout(() => {
            const budgetNote = affordableHotels.length === 0
                ? ` <span style="color:#e74c3c;font-size:12px;">(closest to your budget)</span>` : '';
            addBotMessage(`🏨 I recommend <strong>${hotelToShow.name}</strong> at <strong>$${hotelToShow.price}/night</strong>${budgetNote}`);

            setTimeout(() => {
                addBotMessage(`<button class="chat-dest-btn" style="width:100%;border:none;cursor:pointer;margin-top:8px;" onclick="openBooking('${hotelToShow.name}', ${hotelToShow.price})">Book ${hotelToShow.name} — $${hotelToShow.price}/night</button>`);

                // Also suggest a fun experience
                if (bestMatch.experiences && bestMatch.experiences.length > 0) {
                    const exp = bestMatch.experiences[Math.floor(Math.random() * bestMatch.experiences.length)];
                    setTimeout(() => {
                        addBotMessage(`🎡 <strong>Also check out:</strong> <strong>${exp.name}</strong> — a ${exp.type} starting from <strong>$${exp.price}/person</strong>!`);
                        setTimeout(() => {
                            addBotMessage(`<a class="chat-dest-btn" style="display:block;margin-top:8px;" href="booking.html?place=${encodeURIComponent(exp.name)}&price=${exp.price}&type=experience&dest=${encodeURIComponent(bestMatch.name)}">Book ${exp.name} — $${exp.price}/person</a>`);
                            const restartBtn = document.createElement('button');
                            restartBtn.className = 'chat-option-btn';
                            restartBtn.textContent = '🔄 Plan Another Trip';
                            restartBtn.addEventListener('click', () => { chatBody.innerHTML = ''; startChat(); });
                            chatOptions.innerHTML = '';
                            chatOptions.appendChild(restartBtn);
                            scrollToBottom();
                        }, 500);
                    }, 700);
                } else {
                    const restartBtn = document.createElement('button');
                    restartBtn.className = 'chat-option-btn';
                    restartBtn.textContent = '🔄 Plan Another Trip';
                    restartBtn.addEventListener('click', () => { chatBody.innerHTML = ''; startChat(); });
                    chatOptions.innerHTML = '';
                    chatOptions.appendChild(restartBtn);
                    scrollToBottom();
                }
            }, 600);
        }, 1400);
    }
}

// ── Initialize on load ──────────────────────────────────────
window.addEventListener('load', () => {
    if (typeof initChatbot === 'function') {
        initChatbot();
    }
});
