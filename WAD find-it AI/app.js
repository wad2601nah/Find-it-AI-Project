/**
 * Find-it AI - Core Application Logic
 * 
 * Handles chat interactions, mock Database logic, and UI rendering.
 */

// DOM Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');
const loadingIndicator = document.getElementById('loading-indicator');
const chatContainer = document.getElementById('chat-container');

// Mock Database (Firestore Schema Simulation)
const MOCK_DB = {
    stores: [
        {
            id: "s1",
            name: "Rumah Makan Sederhana Minang",
            location: "Jakarta Selatan",
            address: "Jl. RS. Fatmawati No. 15, Gandaria Sel., Kec. Cilandak",
            rating: 4.8,
            price_range: "15k - 40k",
            categories: ["food", "padang", "nasi padang"],
        },
        {
            id: "s2",
            name: "Padang Merdeka",
            location: "Jakarta Pusat",
            address: "Jl. KH. Wahid Hasyim No. 55, Menteng",
            rating: 4.6,
            price_range: "25k - 60k",
            categories: ["food", "padang", "premium"],
        },
        {
            id: "s3",
            name: "Warung Nasi Ampera",
            location: "Jakarta Timur",
            address: "Jl. Pemuda No. 70, Rawamangun",
            rating: 4.4,
            price_range: "12k - 30k",
            categories: ["food", "sunda", "nasi"],
        },
        {
            id: "s4",
            name: "Enter Komputer",
            location: "Jakarta Pusat",
            address: "Mangga Dua Mall Lt. 5 Blok C No. 1",
            rating: 4.9,
            price_range: "5jt - 50jt",
            categories: ["electronics", "laptop", "computer"],
        },
        {
            id: "s5",
            name: "KliknKlik",
            location: "Jakarta Selatan",
            address: "Poins Square Lt. 2 No. 25",
            rating: 4.5,
            price_range: "3jt - 20jt",
            categories: ["electronics", "laptop", "gadget"],
        },
        {
            id: "s6",
            name: "Sate Padang Ajo Ramon",
            location: "Jakarta Selatan",
            address: "Jl. Cikajang No.72, Petogogan, Kebayoran Baru",
            rating: 4.7,
            price_range: "30k - 50k",
            categories: ["food", "padang", "sate"],
        },
        {
            id: "s7",
            name: "Pagi Sore Kemang",
            location: "Jakarta Selatan",
            address: "Jl. Kemang Raya No. 18, Bangka",
            rating: 4.9,
            price_range: "50k - 100k",
            categories: ["food", "padang", "premium"],
        },
        {
            id: "s8",
            name: "Rumah Makan Padang Bu Mus",
            location: "Bandung",
            address: "Jl. Buah Batu No. 182, Bandung",
            rating: 4.5,
            price_range: "20k - 45k",
            categories: ["food", "padang", "sunda"],
        },
        {
            id: "s9",
            name: "Sate Maulana Yusuf",
            location: "Bandung",
            address: "Jl. Maulana Yusuf No. 21, Bandung",
            rating: 4.8,
            price_range: "30k - 60k",
            categories: ["food", "sate", "premium"],
        },
        {
            id: "s10",
            name: "Soto Ambengan Pak Sadi",
            location: "Surabaya",
            address: "Jl. Ambengan No. 3A, Surabaya",
            rating: 4.7,
            price_range: "25k - 50k",
            categories: ["food", "soto", "surabaya"],
        },
        {
            id: "s11",
            name: "Depot Bu Rudy",
            location: "Surabaya",
            address: "Jl. Dharmahusada No. 140, Surabaya",
            rating: 4.6,
            price_range: "40k - 80k",
            categories: ["food", "nasi", "surabaya"],
        },
        {
            id: "s12",
            name: "Rm. Sederhana Lintau",
            location: "Bekasi",
            address: "Jl. Jend. Sudirman No. 45, Bekasi Barat",
            rating: 4.3,
            price_range: "18k - 35k",
            categories: ["food", "padang", "nasi", "bekasi"],
        },
        {
            id: "s13",
            name: "Nasi Padang Surya Eco",
            location: "Bekasi",
            address: "Jl. Perjuangan No. 8, Bekasi Utara",
            rating: 4.2,
            price_range: "12k - 25k",
            categories: ["food", "padang", "murah", "bekasi"],
        },
        {
            id: "s14",
            name: "Rumah Makan Bumi Aki",
            location: "Bogor",
            address: "Jl. Raya Pajajaran No. 51, Bogor",
            rating: 4.8,
            price_range: "50k - 100k",
            categories: ["food", "sunda", "premium", "bogor"],
        },
        {
            id: "s15",
            name: "Soto Kuning Pak Yusup",
            location: "Bogor",
            address: "Jl. Suryakencana No. 280, Bogor",
            rating: 4.6,
            price_range: "25k - 40k",
            categories: ["food", "soto", "bogor"],
        },
        {
            id: "s16",
            name: "Warung Nasi Murah Meriah",
            location: "Bogor",
            address: "Jl. Veteran No. 10, Bogor Tengah",
            rating: 4.1,
            price_range: "10k - 20k",
            categories: ["food", "nasi", "murah", "bogor"],
        }
    ]
};

// Utils for formatting currency
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Scroll to bottom
const scrollToBottom = () => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Auto-resize textarea
userInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Handle Form Submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();

    if (!query) return;

    // 1. Add User Message
    addMessage(query, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';
    scrollToBottom();

    // 2. Show Loading
    loadingIndicator.classList.remove('hidden');
    scrollToBottom();

    // 3. Simulate AI Processing Delay
    setTimeout(() => {
        loadingIndicator.classList.add('hidden');
        processAIResponse(query);
    }, 1500);
});

// Preset Query Handler
window.presetQuery = (text) => {
    userInput.value = text;
    chatForm.dispatchEvent(new Event('submit'));
};

// Add Message to Chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex w-full mb-6 animate-fade-in-up ${sender === 'user' ? 'justify-end' : ''}`;

    const contentClass = sender === 'user'
        ? 'bg-burgundy text-white rounded-br-none'
        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none';

    const avatar = sender === 'user'
        ? `<div class="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 text-xs ml-2">You</div>`
        : `<div class="w-8 h-8 rounded-full bg-burgundy flex-shrink-0 flex items-center justify-center text-white text-xs mr-2 border border-gold">AI</div>`;

    const html = `
        <div class="flex items-end max-w-[85%] md:max-w-[70%] ${sender === 'user' ? 'flex-row' : ''}">
            ${sender === 'ai' ? avatar : ''}
            <div class="${contentClass} p-4 rounded-2xl shadow-sm text-sm md:text-base chat-content">
                ${text}
            </div>
            ${sender === 'user' ? avatar : ''}
        </div>
    `;

    messageDiv.innerHTML = html;
    chatHistory.appendChild(messageDiv);
    scrollToBottom();
}

// AI "Brain" - Enhanced Logic with Location & Price Filtering
function processAIResponse(query) {
    const lowerQuery = query.toLowerCase();

    // Parse Query for Item and Location using common separators
    // e.g. "Sate in Madura", "Gudeg di Jogja", "Kopi at Aceh"
    const separators = [" in ", " di ", " at ", " near "];
    let detectedItem = null;
    let detectedLocation = null;

    for (const sep of separators) {
        if (lowerQuery.includes(sep)) {
            const parts = lowerQuery.split(sep);
            detectedItem = parts[0].trim();
            detectedLocation = parts[1].trim();
            break;
        }
    }

    // If no separator found, try to guess or use default logic
    if (!detectedLocation) {
        // Fallback to strict list checking if no natural language structure found
        const locationList = ["jakarta selatan", "jakarta pusat", "jakarta timur", "jakarta barat", "jakarta utara", "kemang", "tebet", "menteng", "fatmawati", "rawamangun", "kebayoran", "bandung", "surabaya", "bali", "bekasi", "bogor", "medan", "yogyakarta", "jogja", "semarang", "malang", "makassar", "palembang", "aceh", "papua", "lampung"];
        for (const loc of locationList) {
            if (lowerQuery.includes(loc)) {
                detectedLocation = loc;
                // Item is everything else? Rough approximation
                detectedItem = lowerQuery.replace(loc, "").replace(" in ", "").replace(" di ", "").trim();
                break;
            }
        }
    }

    // 1. Try MOCK_DB Hardcoded Matches First
    let matches = [];
    if (detectedItem) {
        matches = MOCK_DB.stores.filter(s =>
            (s.name.toLowerCase().includes(detectedItem) || s.categories.some(c => detectedItem.includes(c))) &&
            (detectedLocation ? (s.location.toLowerCase().includes(detectedLocation) || s.address.toLowerCase().includes(detectedLocation) || s.categories.includes(detectedLocation)) : true)
        );
    } else {
        // Keyword matching fallback for simple queries like "Nasi Padang" without location
        if (lowerQuery.includes('padang') || lowerQuery.includes('nasi') || lowerQuery.includes('makan') || lowerQuery.includes('sate') || lowerQuery.includes('soto')) {
            matches = MOCK_DB.stores.filter(s => s.categories.includes('food') || s.categories.includes('padang') || s.categories.includes('soto') || s.categories.includes('sate') || s.categories.includes('nasi'));
        } else if (lowerQuery.includes('laptop') || lowerQuery.includes('computer') || lowerQuery.includes('gaming')) {
            matches = MOCK_DB.stores.filter(s => s.categories.includes('electronics'));
        }

        // Filter by location if detected later
        if (detectedLocation) {
            matches = matches.filter(s =>
                s.location.toLowerCase().includes(detectedLocation) ||
                s.address.toLowerCase().includes(detectedLocation) ||
                s.categories.includes(detectedLocation)
            );
        }
    }


    // 2. Extract Price Constraints & Sorting (Shared Logic)
    let priceConstraintText = "";
    if (lowerQuery.includes('under 20k') || lowerQuery.includes('bawah 20k') || lowerQuery.includes('< 20k')) {
        matches = matches.filter(s => {
            const rangeStart = parseInt(s.price_range.split('-')[0].replace(/\D/g, ''));
            return rangeStart <= 20;
        });
        priceConstraintText += " under 20k";
    }

    let sortIntent = 'rating';
    if (lowerQuery.includes('cheapest') || lowerQuery.includes('termurah') || lowerQuery.includes('paling murah') || lowerQuery.includes('terjangkau') || lowerQuery.includes('murah')) {
        sortIntent = 'price_asc';
    }


    // 3. Dynamic Fallback (UNIVERSAL SEARCH)
    // If no strict matches found, but we have an Item and a Location, GENERATE results.
    let isGenerative = false;
    if (matches.length === 0 && detectedItem && detectedLocation) {
        matches = generateDynamicRecommendations(detectedItem, detectedLocation);
        isGenerative = true;
    }


    // 4. Generate Response
    if (matches.length > 0) {
        // Intro Text construction
        let introText = "";

        if (isGenerative) {
            introText = `I searched my universal network for <strong>${detectedItem}</strong> in <strong>${detectedLocation}</strong>. Here are the best matches found:`;
        } else {
            introText = `I found <strong>${matches.length} matches</strong>`;
            if (detectedLocation) introText += ` in <span class="capitalize font-semibold text-burgundy">${detectedLocation}</span>`;
            if (priceConstraintText) introText += ` for your budget${priceConstraintText}`;
            introText += ". Here are the best recommendations:";
        }

        // Add sorting hint if strictly unmatched
        if (!isGenerative && sortIntent === 'price_asc') {
            introText += ` <br><span class="text-xs text-gray-500">(Sorted by lowest price)</span>`;
        }

        let responseHTML = `<p class="mb-3">${introText}</p>`;

        responseHTML += `<div class="flex flex-col gap-3 mt-2">`;

        // Sort Logic (Only for hardcoded data usually, but works for mock too if structure matches)
        if (sortIntent === 'price_asc') {
            matches.sort((a, b) => {
                const priceA = parseInt(a.price_range.split('-')[0].replace(/\D/g, ''));
                const priceB = parseInt(b.price_range.split('-')[0].replace(/\D/g, ''));
                return priceA - priceB;
            });
        } else {
            matches.sort((a, b) => b.rating - a.rating);
        }

        matches.forEach(store => {
            const starIcons = Array(5).fill('<i class="fa-regular fa-star text-gray-300"></i>');
            const fullStars = Math.floor(store.rating);
            for (let i = 0; i < fullStars; i++) starIcons[i] = '<i class="fa-solid fa-star text-gold"></i>';
            if (store.rating % 1 !== 0) starIcons[fullStars] = '<i class="fa-solid fa-star-half-stroke text-gold"></i>';

            responseHTML += `
                <div class="store-card p-4 rounded-xl flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <h3 class="font-bold text-burgundy text-lg capitalize">${store.name}</h3>
                        <div class="flex items-center gap-2 text-sm my-1">
                            <span class="text-yellow-500">${store.rating}</span>
                            <div class="flex text-xs">${starIcons.join('')}</div>
                        </div>
                        <p class="text-sm text-gray-600 mb-1"><i class="fa-solid fa-tag text-burgundy opacity-70 w-5"></i> ${store.price_range}</p>
                        <p class="text-sm text-gray-500 capitalize"><i class="fa-solid fa-location-dot text-burgundy opacity-70 w-5"></i> ${store.address}</p>
                    </div>
                    <div class="flex items-center">
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}" target="_blank" class="w-full md:w-auto px-6 py-2.5 bg-gold hover:bg-yellow-400 text-burgundy text-sm font-bold rounded-full transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                            Check Store <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                </div>
            `;
        });

        responseHTML += `</div>`;
        addMessage(responseHTML, 'ai');
    } else {
        // Fallback for completely unknown intetns
        let fallbackMsg = `I'm listening! Tell me what you need and where.`;
        if (detectedLocation) fallbackMsg = `I couldn't find specific matches in **${detectedLocation}**. Try broadening yoru search?`;

        addMessage(`
            <p>${fallbackMsg}</p>
            <p class="mt-2 text-sm text-gray-600">Examples: "Gudeg in Jogja", "Pempek in Palembang", "Kopi in Aceh"</p>
        `, 'ai');
    }
}

// Helper to Generate Dynamic "Universal" Results
function generateDynamicRecommendations(item, location) {
    // Return 2 "AI Generated" Placeholders that link to Google Maps
    // This simulates having data for ANY region.
    return [
        {
            id: "gen_1",
            name: `${item} ${location} Spesial`, // e.g. "Gudeg Jogja Spesial"
            location: location,
            address: `Pusat Kuliner ${location}`,
            rating: 4.8,
            price_range: "Check on Maps",
            categories: ["generated"],
        },
        {
            id: "gen_2",
            name: `Warung ${item} Enak ${location}`, // e.g. "Warung Gudeg Enak Jogja"
            location: location,
            address: `Near City Center, ${location}`,
            rating: 4.6,
            price_range: "Affordable",
            categories: ["generated"],
        }
    ];
}
