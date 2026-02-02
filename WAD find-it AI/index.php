<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Find-it AI</title>
    <!-- Google Fonts: Outfit for a modern, clean look -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS (CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        burgundy: '#800020',
                        'burgundy-light': '#982b4a',
                        cream: '#f6e9d6ff',
                        'cream-soft': '#f6f1f1ff',
                        gold: '#f6dd1aff',
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50 text-gray-800 font-sans h-screen flex flex-col overflow-hidden">

    <!-- Header -->
    <header class="bg-burgundy text-white p-4 shadow-lg flex items-center justify-between z-10 shrink-0">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-burgundy font-bold text-xl shadow-inner border-2 border-gold">
                AI
            </div>
            <div>
                <h1 class="text-xl font-bold tracking-wide">Find-it AI</h1>
                <p class="text-xs text-cream opacity-80">Your Smart Buyer Concierge</p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <!-- Badges removed as per user request -->
        </div>
    </header>

    <!-- Main Chat Area -->
    <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-cream-soft scroll-smooth relative" id="chat-container">
        
        <!-- Welcome Message -->
        <div class="flex w-full mb-6 animate-fade-in-up">
            <div class="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
                <div class="w-8 h-8 rounded-full bg-burgundy flex-shrink-0 flex items-center justify-center text-white text-xs border border-gold">
                    AI
                </div>
                <div class="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 text-sm md:text-base">
                    <p class="mb-2">Halo! 👋 I'm **Find-it AI**, your personal procurement concierge.</p>
                    <p>Tell me what you need, your budget, and where you are. I'll find the best deals for you.</p>
                    <div class="mt-3 flex flex-wrap gap-2">
                        <button onclick="presetQuery('Nasi Padang under 20k')" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-burgundy font-medium transition">Example: "Nasi Padang under 20k"</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chat Content will effectively go here -->
        <div id="chat-history"></div>

        <!-- Loading Indicator -->
        <div id="loading-indicator" class="hidden flex w-full mb-6">
            <div class="flex items-end gap-2">
                <div class="w-8 h-8 rounded-full bg-burgundy flex-shrink-0 flex items-center justify-center text-white text-xs">
                    AI
                </div>
                <div class="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
                    <div class="w-2 h-2 bg-burgundy rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-burgundy rounded-full animate-bounce delay-75"></div>
                    <div class="w-2 h-2 bg-burgundy rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        </div>

    </main>

    <!-- Input Area -->
    <footer class="bg-white p-4 border-t border-gray-200 shrink-0">
        <div class="max-w-4xl mx-auto relative">
            <form id="chat-form" class="flex gap-2 items-end">
                <button type="button" class="p-3 text-gray-400 hover:text-burgundy transition rounded-full hover:bg-gray-50">
                    <i class="fa-solid fa-paperclip"></i>
                </button>
                <div class="flex-1 relative">
                    <textarea 
                        id="user-input" 
                        rows="1" 
                        class="w-full bg-gray-100 border-0 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-burgundy focus:bg-white transition resize-none max-h-32 text-gray-800 placeholder-gray-500"
                        placeholder="Type your request here... (e.g., 'Tell me what you need, your budget, and where you are.')"
                    ></textarea>
                </div>
                <button type="submit" class="w-12 h-12 rounded-full bg-burgundy text-white shadow-lg hover:bg-burgundy-light hover:shadow-xl transition flex items-center justify-center transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </div>
    </footer>

    <!-- App Logic -->
    <script src="app.js"></script>
</body>
</html>
