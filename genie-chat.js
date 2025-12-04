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
                let errorMsg = 'Failed to send message';
                try {
                    const error = await response.json();
                    errorMsg = error.error || errorMsg;
                    if (error.details) {
                        errorMsg += ` (${error.details})`;
                    }
                } catch (e) {
                    // If JSON parsing fails, use default message
                }
                throw new Error(errorMsg);
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
                    
                    if (data.status === 'COMPLETED') {
                        this.displayGenieResponse(data);
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

    displayGenieResponse(data) {
        let responseHtml = '';
        
        // Check if there are attachments with query results
        if (data.attachments && data.attachments.length > 0) {
            for (const attachment of data.attachments) {
                // Display SQL query if available
                if (attachment.query) {
                    const query = attachment.query;
                    responseHtml += `<div style="margin-bottom: 1rem;">`;
                    
                    if (query.description) {
                        responseHtml += `<p style="margin-bottom: 0.5rem;">${this.escapeHtml(query.description)}</p>`;
                    }
                    
                    if (query.query) {
                        responseHtml += `<div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0; font-family: monospace; font-size: 0.85rem; overflow-x: auto;">`;
                        responseHtml += `<code>${this.escapeHtml(query.query)}</code>`;
                        responseHtml += `</div>`;
                    }
                    
                    if (query.query_result_metadata && query.query_result_metadata.row_count !== undefined) {
                        responseHtml += `<p style="font-size: 0.9rem; color: var(--accent-gold); margin-top: 0.5rem;">📊 Found ${query.query_result_metadata.row_count} result(s)</p>`;
                    }
                    
                    responseHtml += `</div>`;
                }
                
                // Display text responses
                if (attachment.text && attachment.text.content) {
                    responseHtml += `<p style="margin-bottom: 0.5rem;">${this.escapeHtml(attachment.text.content)}</p>`;
                }
                
                // Display suggested questions
                if (attachment.suggested_questions && attachment.suggested_questions.questions) {
                    responseHtml += `<div style="margin-top: 1rem;">`;
                    responseHtml += `<p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem;">💡 Related questions:</p>`;
                    responseHtml += `<ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">`;
                    for (const question of attachment.suggested_questions.questions) {
                        responseHtml += `<li style="margin-bottom: 0.3rem;">${this.escapeHtml(question)}</li>`;
                    }
                    responseHtml += `</ul></div>`;
                }
            }
        }
        
        // Fallback if no formatted response was created
        if (!responseHtml) {
            responseHtml = `<p>Query completed successfully.</p>`;
            if (data.query_result && data.query_result.row_count !== undefined) {
                responseHtml += `<p>Found ${data.query_result.row_count} result(s).</p>`;
            }
        }
        
        this.addMessage('bot', responseHtml, true);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GenieChat();
});
