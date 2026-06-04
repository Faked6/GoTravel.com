const hotelData = {
    "Uluwatu Ocean View Resort": {
        name: "Uluwatu Ocean View Resort",
        location: "Uluwatu, Bali",
        description: "Experience absolute luxury with private infinity pools and breathtaking sunset views from the cliffs of Uluwatu. Our resort offers world-class dining, exceptional spa services, and direct access to pristine beaches.",
        image: "assets/uluwatuhotelpresidentialsuite.jpg",
        ratingScore: 4.8,
        ratingCount: 154,
        facilities: [
            { icon: "fa-wifi", name: "Free High-Speed WiFi" },
            { icon: "fa-swimming-pool", name: "Infinity Pool" },
            { icon: "fa-spa", name: "Luxury Spa" },
            { icon: "fa-utensils", name: "Oceanfront Dining" },
            { icon: "fa-martini-glass", name: "Sunset Bar" },
            { icon: "fa-dumbbell", name: "Fitness Center" }
        ],
        rooms: [
            { name: "Ocean View Suite", description: "Spacious suite featuring a king-size bed, a modern en-suite bathroom with a rainfall shower, and a private balcony overlooking the Indian Ocean. Accommodates 2 guests.", price: 240, type: "room", images: ["assets/uluwatuhoteloceanviewsuite.jpg"] },
            { name: "Private Pool Villa", description: "Exclusive 1-bedroom villa with a luxurious king-size bed, indoor-outdoor bathroom with a soaking tub, and your own private infinity pool and sun deck. Accommodates 2 guests.", price: 450, type: "room", images: ["assets/uluwatuhotelprivatepoolvilla.jpg", "assets/uluwatuhotelprivatepool.jpg"] },
            { name: "Presidential Penthouse", description: "Ultimate luxury with 3 sprawling bedrooms, panoramic ocean views, expansive living and dining areas, dedicated butler service, and a private rooftop jacuzzi. Accommodates up to 6 guests.", price: 890, type: "room", images: ["assets/uluwatuhotelpresidentialsuite.jpg", "assets/uluwatuhotelpresidential-suite-master-bedroom.jpg", "assets/uluwatuhotelpresidential-suites-bathroom.jpg"] }
        ],
        reviews: [
            { id: "rev_ulu_1", author: "Sarah Jenkins", rating: 5, date: "Oct 12, 2025", text: "Absolutely stunning views and impeccable service. The infinity pool is out of this world!", upvotes: 12, downvotes: 0, replies: [] },
            { id: "rev_ulu_2", author: "David M.", rating: 4, date: "Sep 28, 2025", text: "Great resort, very relaxing. Food was excellent though a bit pricey.", upvotes: 4, downvotes: 1, replies: [{author: "Hotel Management", text: "Thank you for your feedback David! We hope to welcome you back soon."}] }
        ]
    },
    "Seminyak Private Villa": {
        name: "Seminyak Private Villa",
        location: "Seminyak, Bali",
        description: "A tranquil 3-bedroom villa close to the beach and top restaurants. Enjoy absolute privacy with a tropical garden, open-air living spaces, and a private pool, right in the heart of trendy Seminyak.",
        image: "assets/seminyak3bedroom.jpg",
        ratingScore: 4.6,
        ratingCount: 128,
        facilities: [
            { icon: "fa-wifi", name: "Free WiFi" },
            { icon: "fa-swimming-pool", name: "Private Pool" },
            { icon: "fa-kitchen-set", name: "Fully Equipped Kitchen" },
            { icon: "fa-tv", name: "Smart TV & Entertainment" },
            { icon: "fa-car", name: "Free Parking" }
        ],
        rooms: [
            { name: "1 Bedroom Villa", description: "Perfect for couples, featuring a private pool and romantic setup.", price: 180, type: "room", images: ["assets/seminyak1bedroomvilla2.jpg", "assets/seminyak1bedroomvilla1.jpg"] },
            { name: "2 Bedroom Villa", description: "Ideal for small families or friends with a larger pool area.", price: 280, type: "room", images: ["assets/seminyak2bedroom.jpg", "assets/seminyak2bedroom2.jpg", "assets/seminyak2bedroom3.jpg"] },
            { name: "3 Bedroom Family Villa", description: "Spacious villa accommodating up to 6 guests with full amenities.", price: 380, type: "room", images: ["assets/seminyak3bedroom.jpg", "assets/seminyak3bedroom2.jpg"] }
        ],
        reviews: [
            { id: "rev_sem_1", author: "Michael T.", rating: 5, date: "Nov 02, 2025", text: "The perfect private getaway! The staff were very accommodating and the pool was lovely.", upvotes: 8, downvotes: 0, replies: [] },
            { id: "rev_sem_2", author: "Emma W.", rating: 4, date: "Aug 15, 2025", text: "Great location, right next to all the best cafes but still very quiet at night.", upvotes: 3, downvotes: 0, replies: [] }
        ]
    },
    "Grand Indonesia Luxury Hotel": {
        name: "Grand Indonesia Luxury Hotel",
        location: "Menteng, Jakarta",
        description: "A premium 5-star hotel located right in the heart of the city. Connected directly to the Grand Indonesia Mall, offering unparalleled convenience for shopping, dining, and business.",
        image: "assets/GrandIndonesiapenthouse.webp",
        ratingScore: 4.7,
        ratingCount: 189,
        facilities: [
            { icon: "fa-wifi", name: "Free WiFi" },
            { icon: "fa-swimming-pool", name: "Rooftop Pool" },
            { icon: "fa-utensils", name: "5 Fine Dining Restaurants" },
            { icon: "fa-dumbbell", name: "24/7 Gym" },
            { icon: "fa-briefcase", name: "Business Center" },
            { icon: "fa-spa", name: "Wellness Spa" }
        ],
        rooms: [
            { name: "Deluxe City Room", description: "Modern room with stunning views of the Jakarta skyline.", price: 150, type: "room", images: ["assets/GrandIndonesiaDeluxe.webp", "assets/GrandIndonesiaDeluxe2.webp"] },
            { name: "Executive Suite", description: "Includes access to the Executive Lounge with complimentary breakfast and evening cocktails.", price: 250, type: "room", images: ["assets/GrandIndonesiaexecutive1.webp", "assets/GrandIndonesiaexecutive2.webp"] },
            { name: "Grand Penthouse Suite", description: "Spacious living area, marble bathroom, and panoramic city views.", price: 500, type: "room", images: ["assets/GrandIndonesiapenthouse.webp", "assets/GrandIndonesiapenthouse2.webp"] }
        ],
        reviews: [
            { id: "rev_jkt1_1", author: "Budi S.", rating: 5, date: "Dec 10, 2025", text: "Unmatched convenience with the mall right next door. Breakfast buffet was spectacular.", upvotes: 20, downvotes: 1, replies: [] },
            { id: "rev_jkt1_2", author: "Clara R.", rating: 4, date: "Oct 05, 2025", text: "Very luxurious but the lobby can get quite busy during the weekends.", upvotes: 5, downvotes: 0, replies: [] }
        ]
    },
    "Sudirman City View Apartments": {
        name: "Sudirman City View Apartments",
        location: "Sudirman, Jakarta",
        description: "Modern serviced apartments with stunning skyline views and premium facilities. Perfect for both short and long-term stays, offering the comfort of home with hotel-like services.",
        image: "assets/sudirmanpremium.webp",
        ratingScore: 4.5,
        ratingCount: 112,
        facilities: [
            { icon: "fa-wifi", name: "High-Speed Internet" },
            { icon: "fa-kitchen-set", name: "Full Kitchenette" },
            { icon: "fa-washing-machine", name: "In-room Laundry" },
            { icon: "fa-swimming-pool", name: "Shared Pool" },
            { icon: "fa-dumbbell", name: "Fitness Center" }
        ],
        rooms: [
            { name: "Studio Apartment", description: "Cozy and efficient, perfect for solo travelers or business trips.", price: 90, type: "room", images: ["assets/sudirmanstudio.jpg"] },
            { name: "1 Bedroom Apartment", description: "Separate living area and bedroom with great city views.", price: 130, type: "room", images: ["assets/sudirman1bedroom.webp"] },
            { name: "Premium 3 Bedroom Penthouse", description: "Expansive luxury apartment for family or group stays.", price: 999, type: "room", images: ["assets/sudirmanpremium.webp", "assets/sudirmanpremium2.webp"] }
        ],
        reviews: [
            { id: "rev_jkt2_1", author: "Jonathan", rating: 4, date: "Sep 20, 2025", text: "Great place for a long stay. Kitchen had everything I needed.", upvotes: 7, downvotes: 0, replies: [] },
            { id: "rev_jkt2_2", author: "Alice G.", rating: 5, date: "Jul 11, 2025", text: "The skyline view at night from the balcony is absolutely gorgeous.", upvotes: 15, downvotes: 2, replies: [] }
        ]
    },
    "Le Bristol Paris": {
        name: "Le Bristol Paris",
        location: "Downtown, Paris",
        description: "Experience the epitome of Parisian elegance in our historic hotel. Located just steps from the Champs-Élysées, featuring Michelin-starred dining and an iconic indoor rooftop pool.",
        image: "assets/lebristolprestige.webp",
        ratingScore: 4.9,
        ratingCount: 195,
        facilities: [
            { icon: "fa-wifi", name: "Free WiFi" },
            { icon: "fa-utensils", name: "Michelin-Starred Dining" },
            { icon: "fa-spa", name: "La Prairie Spa" },
            { icon: "fa-swimming-pool", name: "Indoor Rooftop Pool" },
            { icon: "fa-bell", name: "24/7 Concierge" },
            { icon: "fa-paw", name: "Pet Friendly" }
        ],
        rooms: [
            { name: "Superior Room", description: "Elegant Parisian decor overlooking the quiet courtyard.", price: 550, type: "room", images: ["assets/lebristolsuperior.webp", "assets/lebristolsuperior2.webp"] },
            { name: "Deluxe Balcony Room", description: "Spacious room with a private balcony and city views.", price: 750, type: "room", images: ["assets/lebristoldeluxe.webp"] },
            { name: "Prestige Suite", description: "Luxurious suite with a separate living room and marble bathroom.", price: 1200, type: "room", images: ["assets/lebristolprestige.webp", "assets/lebristolprestige2.webp"] }
        ],
        reviews: [
            { id: "rev_par1_1", author: "Marie Dupont", rating: 5, date: "Jan 03, 2026", text: "Perfection in every detail. Dining at the restaurant was the highlight of our trip.", upvotes: 45, downvotes: 0, replies: [] },
            { id: "rev_par1_2", author: "James L.", rating: 5, date: "Nov 22, 2025", text: "Truly a 5-star experience. The indoor pool is unique and beautiful.", upvotes: 12, downvotes: 1, replies: [] }
        ]
    },
    "Eiffel View Apartment": {
        name: "Eiffel View Apartment",
        location: "City Center, Paris",
        description: "A beautiful, classic Parisian apartment offering direct, unobstructed views of the Eiffel Tower. Feel like a local in this fully furnished, stylishly decorated space.",
        image: "assets/eiffelview2bedroom.webp",
        ratingScore: 4.6,
        ratingCount: 134,
        facilities: [
            { icon: "fa-wifi", name: "Free WiFi" },
            { icon: "fa-kitchen-set", name: "Modern Kitchen" },
            { icon: "fa-elevator", name: "Elevator Access" },
            { icon: "fa-tv", name: "Cable TV" },
            { icon: "fa-binoculars", name: "Eiffel Tower View" }
        ],
        rooms: [
            { name: "Classic 1 Bedroom", description: "Charming apartment perfect for a romantic getaway.", price: 220, type: "room", images: ["assets/eiffelview1bedroom.webp"] },
            { name: "Premium 2 Bedroom", description: "More spacious, ideal for families or two couples.", price: 350, type: "room", images: ["assets/eiffelview2bedroom.webp", "assets/eiffelview2bedroom2.webp"] }
        ],
        reviews: [
            { id: "rev_par2_1", author: "Tom & Sarah", rating: 5, date: "Dec 25, 2025", text: "Waking up to the Eiffel tower right outside the window is a dream come true.", upvotes: 33, downvotes: 2, replies: [] },
            { id: "rev_par2_2", author: "Lucas", rating: 4, date: "Aug 30, 2025", text: "Very cozy. The elevator is small but that's expected in Paris!", upvotes: 6, downvotes: 0, replies: [] }
        ]
    },
    "Shinjuku Grand Hotel": {
        name: "Shinjuku Grand Hotel",
        location: "Shinjuku, Tokyo",
        description: "Towering over the bustling streets of Shinjuku, this grand hotel offers unparalleled views of Tokyo and Mount Fuji on clear days. Experience modern Japanese hospitality and world-class amenities.",
        image: "assets/shinjukuskysuite1.webp",
        ratingScore: 4.8,
        ratingCount: 176,
        facilities: [
            { icon: "fa-wifi", name: "Free High-Speed WiFi" },
            { icon: "fa-train", name: "Near Subway Station" },
            { icon: "fa-utensils", name: "Multiple Dining Options" },
            { icon: "fa-martini-glass", name: "Sky Bar" },
            { icon: "fa-dumbbell", name: "Fitness Center" },
            { icon: "fa-hot-tub-person", name: "Public Bath (Sento)" }
        ],
        rooms: [
            { name: "Standard Double Room", description: "Compact but perfectly appointed with modern Japanese aesthetics.", price: 300, type: "room", images: ["assets/shinjukustandard.jpg", "assets/shinjukustandar2.jpg"] },
            { name: "Premium Corner Room", description: "Expansive windows offering dual-aspect views of the neon skyline.", price: 450, type: "room", images: ["assets/shinjukupremium.webp", "assets/shinjukupremium2.webp"] },
            { name: "Sky Suite", description: "Located on the top floors with exclusive lounge access.", price: 800, type: "room", images: ["assets/shinjukuskysuite1.webp", "assets/shinjukuskysuite2.webp"] }
        ],
        reviews: [
            { id: "rev_tok1_1", author: "Kenji", rating: 5, date: "Feb 14, 2026", text: "Amazing location, steps away from the station. The sky bar is fantastic.", upvotes: 18, downvotes: 0, replies: [] },
            { id: "rev_tok1_2", author: "Olivia S.", rating: 4, date: "Oct 19, 2025", text: "Great hotel. Rooms are a bit small but typical for Tokyo. Views are unmatched.", upvotes: 9, downvotes: 0, replies: [] }
        ]
    },
    "Traditional Ryokan": {
        name: "Traditional Ryokan",
        location: "City Center, Tokyo",
        description: "An authentic oasis of calm in the middle of modern Tokyo. Experience traditional Japanese tatami rooms, futon bedding, and exceptional multi-course Kaiseki dinners.",
        image: "assets/ryokandeluxe.webp",
        ratingScore: 4.7,
        ratingCount: 142,
        facilities: [
            { icon: "fa-wifi", name: "Free WiFi" },
            { icon: "fa-hot-tub-person", name: "Onsen (Hot Spring)" },
            { icon: "fa-leaf", name: "Zen Garden" },
            { icon: "fa-bowl-rice", name: "Kaiseki Dining included" },
            { icon: "fa-mug-hot", name: "Tea Ceremony Room" }
        ],
        rooms: [
            { name: "Standard Tatami Room", description: "Classic tatami room with shared open-air bath access.", price: 300, type: "room", images: ["assets/ryokanstandard.webp"] },
            { name: "Deluxe Room with Private Bath", description: "Spacious tatami room featuring your own private wooden bath.", price: 500, type: "room", images: ["assets/ryokandeluxe.webp", "assets/ryokandeluxe2.webp"] }
        ],
        reviews: [
            { id: "rev_tok2_1", author: "Yuki T.", rating: 5, date: "Jan 20, 2026", text: "The onsen was so relaxing. The Kaiseki dinner was an absolute work of art.", upvotes: 25, downvotes: 1, replies: [] },
            { id: "rev_tok2_2", author: "Robert C.", rating: 5, date: "Dec 08, 2025", text: "A truly authentic experience. Sleeping on the futon was surprisingly comfortable!", upvotes: 14, downvotes: 0, replies: [] }
        ]
    }
};
