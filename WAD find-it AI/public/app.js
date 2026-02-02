document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        input.value = '';

        // Show typing indicator (simulated)
        const loadingId = addLoadingIndicator();

        try {
            const response = await fetch('../server/search.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            // Remove loading indicator
            removeMessage(loadingId);

            // Add AI text response
            addMessage(data.text, 'ai');

            // Add cards if any
            if (data.cards && data.cards.length > 0) {
                addCards(data.cards);
            }

        } catch (error) {
            console.error('Error:', error);
            removeMessage(loadingId);
            addMessage("Sorry, I'm having trouble connecting to the server. Please try again.", 'ai');
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = text;
        
        messageDiv.appendChild(bubble);
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
        return messageDiv.id = 'msg-' + Date.now();
    }

    function addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.id = id;
        messageDiv.classList.add('message', 'ai-message');
        
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.innerHTML = '<span style="opacity:0.6">Finding the best deals...</span>';
        
        messageDiv.appendChild(bubble);
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function addCards(cards) {
        const container = document.createElement('div');
        container.classList.add('smart-card-container');
        container.classList.add('message'); 
        container.classList.add('ai-message'); // Align left

        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('smart-card');
            
            // Format price to IDR
            const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(card.price);

            cardEl.innerHTML = `
                <div class="card-header">
                    <span class="store-name">${escapeHtml(card.store_name)}</span>
                    <span class="rating">⭐ ${card.rating}</span>
                </div>
                <div class="card-body">
                    <span class="price-tag">${formattedPrice}</span>
                    <div class="address">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        ${escapeHtml(card.address)}
                    </div>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}" target="_blank" class="check-store-btn">Check Store</a>
            `;
            container.appendChild(cardEl);
        });

        chatContainer.appendChild(container);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
