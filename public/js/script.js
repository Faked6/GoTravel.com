// ===============================================================
// script.js — Page UI & App Initialisation
// ===============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ── Search bar interactions (index page only) ─────────────────
    const searchItems = document.querySelectorAll('.search-item');

    searchItems.forEach(item => {
        item.addEventListener('click', () => {
            searchItems.forEach(i => i.style.outline = 'none');
            item.style.outline = '2px solid var(--accent-hover)';
            item.style.outlineOffset = '-2px';
            const input = item.querySelector('input');
            if (input && !input.readOnly) input.focus();
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-item')) {
            searchItems.forEach(i => i.style.outline = 'none');
        }
    });

    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const dest = document.getElementById('destination').value || 'Anywhere';
            alert(`Searching for properties in ${dest}...`);
        });
    }

    // ── Dates picker (index page only) ───────────────────────────
    const datesInput = document.getElementById('dates');
    if (datesInput) {
        datesInput.addEventListener('click', () => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const fmt = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            datesInput.value = `${fmt(today)} - ${fmt(tomorrow)}`;
        });
    }

    // ── Initialise modules ────────────────────────────────────────
    injectAuthModals();   // from auth.js  — injects login/register modals + nav
    renderNavActions();   // from auth.js  — renders header buttons
    initChatbot();        // from chatbot.js — starts DestiBot

    // ── Dynamic Hotel Main Image Update ──────────────────────────
    if (typeof hotelData !== 'undefined') {
        document.querySelectorAll('.property-item').forEach(item => {
            const heading = item.querySelector('h3');
            if (heading) {
                const hotelName = heading.textContent.trim();
                if (hotelData[hotelName] && hotelData[hotelName].image) {
                    const img = item.querySelector('.property-img');
                    if (img) {
                        img.src = hotelData[hotelName].image;
                    }
                }
            }
        });
    }

});
