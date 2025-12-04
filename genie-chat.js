class GenieChat {
    constructor() {
        this.conversationId = null;
        this.isOpen = false;
        this.isProcessing = false;
        
        this.widget = document.getElementById('genie-chat-widget');
        this.container = document.getElementById('chat-container');
        this.toggle = document.getElementById('chat-toggle');
        this.messages = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');
        
        this.initializeEventListeners();
        this.addWelcomeMessage();
    }

    initializeEventListeners() {
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.widget.classList.toggle('open', this.isOpen);
        if (this.isOpen) {
            this.input.focus();
        }
    }

    addWelcomeMessage() {
        this.addMessage(
            'bot',
            'Welcome to the F1 Genie Assistant! Ask me anything about Formula 1 racing statistics, driver records, team performance, or historical data.'
        );
    }

    addMessage(type, content, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (isHtml) {
            bubble.innerHTML = content;
        } else {
            bubble.textContent = content;
        }
        
        messageDiv.appendChild(bubble);
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    addLoadingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message loading-message';
        messageDiv.id = 'loading-message';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        
        messageDiv.appendChild(bubble);
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    removeLoadingMessage() {
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) {
            loadingMsg.remove();
        }
    }

    async sendMessage() {
        const message = this.input.value.trim();
        
        if (!message || this.isProcessing) {
            return;
        }

        this.isProcessing = true;
        this.input.value = '';
        this.input.disabled = true;
        this.sendBtn.disabled = true;

        // Add user message
        this.addMessage('user', message);
        this.addLoadingMessage();

        try {
            const response = await fetch('/api/genie/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversationId: this.conversationId
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send message');
            }

            const data = await response.json();
            
            // Store conversation ID for continuity
            if (data.conversation_id) {
                this.conversationId = data.conversation_id;
            }

            // Poll for response if message ID is provided
            if (data.message_id) {
                await this.pollForResponse(data.conversation_id, data.message_id);
            } else if (data.message && data.message.content) {
                this.removeLoadingMessage();
                this.addMessage('bot', data.message.content);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            this.removeLoadingMessage();
            this.addMessage('bot', `Sorry, I encountered an error: ${error.message}`);
        } finally {
            this.isProcessing = false;
            this.input.disabled = false;
            this.sendBtn.disabled = false;
            this.input.focus();
        }
    }

    async pollForResponse(conversationId, messageId, maxAttempts = 30) {
        let attempts = 0;
        const pollInterval = 1000; // 1 second

        while (attempts < maxAttempts) {
            try {
                const response = await fetch(`/api/genie/poll/${conversationId}/${messageId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to poll for response');
                }

                const data = await response.json();

                // Check if message is complete
                if (data.status === 'COMPLETED' || data.status === 'FAILED') {
                    this.removeLoadingMessage();
                    
                    if (data.status === 'COMPLETED' && data.content) {
                        this.addMessage('bot', data.content);
                    } else {
                        this.addMessage('bot', 'Sorry, I could not generate a response. Please try again.');
                    }
                    return;
                }

                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, pollInterval));
                attempts++;

            } catch (error) {
                console.error('Error polling for response:', error);
                this.removeLoadingMessage();
                this.addMessage('bot', 'Sorry, there was an error getting the response.');
                return;
            }
        }

        // Timeout
        this.removeLoadingMessage();
        this.addMessage('bot', 'The request timed out. Please try asking your question again.');
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GenieChat();
});
