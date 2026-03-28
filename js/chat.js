document.addEventListener('DOMContentLoaded', () => {
    // Chat UI elements
    const overlay = document.getElementById('chat-overlay');
    const messagesContainer = document.getElementById('ask-srini-ai-messages');
    const chatInput = document.getElementById('ask-srini-ai-input');
    const chatSendBtn = document.getElementById('ask-srini-ai-send');
    const chatStarters = document.getElementById('ask-srini-ai-starters');

    let thinkingInProgress = false;

    // Helper: Add Message to UI
    function addMessage(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${type}`;

        const content = document.createElement('div');
        content.className = 'chat-content';

        if (type.includes('thinking')) {
            content.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
        } else {
            content.innerHTML = marked.parse(text || '');
        }

        msgDiv.appendChild(content);
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return msgDiv;
    }

    // Main Function: Send Message to API
    async function sendMessage(textQuery) {
        const query = (textQuery || chatInput.value).trim();
        if (!query || thinkingInProgress) return;

        // Reset Input
        chatInput.value = '';
        thinkingInProgress = true;

        // User message
        addMessage(query, 'user');

        // Hide Starters
        if (chatStarters) chatStarters.style.display = 'none';

        // Thinking Bubble
        const thinkingBubble = addMessage('', 'bot thinking');

        try {
            const res = await fetch(`https://n8n.srinikb.in/webhook/srini-ai?q=${encodeURIComponent(query)}`);

            // Remove Thinking
            messagesContainer.removeChild(thinkingBubble);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = '';

            const botBubble = addMessage('', 'bot');
            const botContent = botBubble.querySelector('.chat-content');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(l => l.trim());

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.type === 'item') {
                            accumulatedResponse += data.content;
                            botContent.innerHTML = marked.parse(accumulatedResponse.trim());
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        } else if (data.type === 'end') {
                            thinkingInProgress = false;
                            return;
                        }
                    } catch (err) {
                        // Log fallback for raw streaming
                        accumulatedResponse += line;
                        botContent.innerHTML = marked.parse(accumulatedResponse.trim());
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                }
            }
        } catch (err) {
            console.error('AI Error:', err);
            if (thinkingBubble && thinkingBubble.parentNode) {
                messagesContainer.removeChild(thinkingBubble);
            }
            addMessage("I'm having trouble connecting to my brain right now. Please try again later.", 'bot');
        } finally {
            thinkingInProgress = false;
        }
    }

    // Input Listeners
    chatSendBtn.addEventListener('click', () => sendMessage());
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Starters Listener
    document.querySelectorAll('.chat-starter').forEach(starter => {
        starter.addEventListener('click', () => {
            sendMessage(starter.getAttribute('data-q'));
        });
    });

    // Auto-focus input when modal opens (handled in index.html too, but here for safety)
    const aiNavTrigger = document.getElementById('ai-nav-trigger');
    if (aiNavTrigger) {
        aiNavTrigger.addEventListener('click', () => {
            setTimeout(() => {
                chatInput.focus();
            }, 350); // wait for anim
        });
    }
});
