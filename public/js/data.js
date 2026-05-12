// ===============================================================
// data.js — Shared Travel Data (Itineraries & Descriptions)
// ===============================================================

const TRAVEL_DATA = {
    packages: {
        "Bali Wellness Retreat": {
            hotel: "Uluwatu Ocean View",
            itinerary: [
                { day: 1, title: "Arrival & Sacred Monkey Forest", desc: "Airport pickup → luxury villa check-in in Ubud → afternoon visit to the Sacred Monkey Forest Sanctuary." },
                { day: 2, title: "Tegalalang Rice Terraces & Swing", desc: "Morning yoga → visit the iconic rice terraces → jungle swing experience → organic lunch." },
                { day: 3, title: "Tirta Empul Holy Water Temple", desc: "Purification ritual at the holy spring temple → traditional Balinese healing session → evening spa." },
                { day: 4, title: "Uluwatu Sunset & Kecak Dance", desc: "Transfer to South Bali → Uluwatu Temple visit → sunset fire dance performance → seafood dinner at Jimbaran." },
                { day: 5, title: "Nusa Penida Island Trip", desc: "Fast boat to Nusa Penida → Kelingking Beach (T-Rex Bay) → snorkeling at Crystal Bay → return to mainland." },
                { day: 6, title: "Mount Batur Sunrise Hike", desc: "Early morning hike to the volcano summit for sunrise → hot springs soak → relaxing afternoon at the villa." },
                { day: 7, title: "Souvenir Shopping & Departure", desc: "Ubud Art Market visit → traditional cooking class → transfer to airport for your flight home." }
            ]
        },
        "Jakarta City Explorer": {
            hotel: "Grand Indonesia",
            itinerary: [
                { day: 1, title: "Arrival & Welcome Dinner", desc: "Airport pickup → hotel check-in at Menteng → welcome dinner at Kota Tua waterfront restaurant." },
                { day: 2, title: "Dufan Adventure Park", desc: "Full day at Dufan — 30+ rides, live shows, and lunch on-site. Return to hotel by evening." },
                { day: 3, title: "Heritage & Culture", desc: "Morning: Old Town Heritage Walking Tour & National Museum. Afternoon: TMII Cultural Theme Park." },
                { day: 4, title: "Shopping & Cooking Class", desc: "Morning: Grand Indonesia Mall & souvenir shopping. Afternoon: hands-on Indonesian cooking class." },
                { day: 5, title: "Departure", desc: "Breakfast at hotel → optional morning market visit → airport transfer for departure." }
            ]
        },
        "Parisian Romance": {
            hotel: "Eiffel View Hotel",
            itinerary: [
                { day: 1, title: "Arrival & Eiffel Tower Dinner", desc: "Private transfer to hotel → evening gourmet dinner at a restaurant with Eiffel Tower views." },
                { day: 2, title: "Louvre Museum & Seine Cruise", desc: "Skip-the-line Louvre tour → afternoon Seine River cruise → evening stroll through Montmartre." },
                { day: 3, title: "Palace of Versailles", desc: "Guided tour of the Royal Apartments and Hall of Mirrors → afternoon in the lush Palace Gardens." },
                { day: 4, title: "Champagne Region Day Trip", desc: "Train to Reims → visit world-famous Champagne cellars with tastings → return to Paris for dinner." },
                { day: 5, title: "Macaroon Workshop & Departure", desc: "Morning pastry class → final shopping at Galeries Lafayette → private transfer to CDG airport." }
            ]
        },
        "Tokyo Neon Odyssey": {
            hotel: "Shinjuku Skyline",
            itinerary: [
                { day: 1, title: "Arrival & Shinjuku Neon", desc: "Airport pickup → Shinjuku check-in → evening walking tour of the neon-lit Golden Gai." },
                { day: 2, title: "TeamLab Planets & Odaiba", desc: "Immersive digital art at TeamLab → lunch at Tsukiji Outer Market → evening at Odaiba bay." },
                { day: 3, title: "Harajuku & Shibuya Crossing", desc: "Meiji Shrine visit → Harajuku street style → the world-famous Shibuya Crossing → Robot Cafe show." },
                { day: 4, title: "Mt. Fuji & Hakone Day Trip", desc: "Bullet train to Hakone → Lake Ashi cruise → Ropeway views of Mt. Fuji → relaxing Onsen hot spring soak." },
                { day: 5, title: "Akihabara & Asakusa", desc: "Morning in Akihabara (Electric Town) → afternoon at Senso-ji Temple in Asakusa → traditional Kaiseki dinner." },
                { day: 6, title: "Departure", desc: "Morning tea ceremony → final souvenir shopping → airport transfer via Narita Express." }
            ]
        },
        "Swiss Alpine Escape": {
            hotel: "Alpine Grand Chalet",
            itinerary: [
                { day: 1, title: "Arrival in Interlaken", desc: "Train from Zurich → Interlaken check-in → evening stroll by Lake Brienz." },
                { day: 2, title: "Jungfraujoch - Top of Europe", desc: "Cogwheel train to the highest station in Europe → Ice Palace visit → Sphinx Observatory views." },
                { day: 3, title: "Grindelwald Adventure", desc: "First Cliff Walk → Trottibike scooter descent → afternoon hiking with panoramic alpine views." },
                { day: 4, title: "Lucerne & Mount Pilatus", desc: "Train to Lucerne → steepest rack railway to Mt. Pilatus summit → Lake Lucerne boat cruise." },
                { day: 5, title: "Chocolate Factory & Departure", desc: "Visit Lindt Home of Chocolate in Zurich → final gift shopping → transfer to Zurich Airport." }
            ]
        },
        "Lunar Odyssey": {
            hotel: "Lunar Base Alpha",
            itinerary: [
                { day: 1, title: "Launch & Transit", desc: "Launch from Kennedy Space Center → 3-day transit to Moon orbit." },
                { day: 2, title: "Lunar Landing", desc: "Touchdown at Sea of Tranquility → airlock entry to Moonbase Alpha." },
                { day: 3, title: "Crater Walk", desc: "Full EVA excursion → exploring craters in low gravity." }
            ]
        },
        "Moonbase Quickstay": {
            hotel: "Lunar Base Alpha",
            itinerary: [
                { day: 1, title: "Arrival", desc: "Fast transit and docking at Moonbase Alpha." },
                { day: 2, title: "Observation", desc: "Viewing Earthrise from the dome observatory." },
                { day: 3, title: "Return", desc: "Departure and re-entry to Earth." }
            ]
        }
    }
};

window.TRAVEL_DATA = TRAVEL_DATA;
