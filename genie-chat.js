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
            'Welcome to the F1 Genie Assistant! Ask me questions about F1 statistics and I\'ll show you the SQL query used. For best results, ask questions like "Show me the top 10 drivers by wins" or "What were Hamilton\'s results in 2020?"'
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
                        await this.displayGenieResponse(data);
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

    async displayGenieResponse(data) {
        let responseHtml = '';
        
        // Check if there are attachments with query results
        if (data.attachments && data.attachments.length > 0) {
            for (const attachment of data.attachments) {
                // Display SQL query if available
                if (attachment.query) {
                    const query = attachment.query;
                    const attachmentId = attachment.attachment_id;
                    
                    // Fetch actual results using conversation_id, message_id, and attachment_id
                    if (attachmentId && data.conversation_id && data.id) {
                        try {
                            const resultsResponse = await fetch(`/api/genie/results/${data.conversation_id}/${data.id}/${attachmentId}`);
                            console.log('Results response status:', resultsResponse.status);
                            if (resultsResponse.ok) {
                                const resultsData = await resultsResponse.json();
                                console.log('Results data received:', resultsData);
                                responseHtml += await this.formatQueryResults(resultsData, query);
                            } else {
                                const errorText = await resultsResponse.text();
                                console.error('Results fetch failed:', resultsResponse.status, errorText);
                                responseHtml += this.formatQueryMetadata(query);
                            }
                        } catch (error) {
                            console.error('Error fetching results:', error);
                            responseHtml += this.formatQueryMetadata(query);
                        }
                    } else {
                        console.log('Missing required IDs - attachmentId:', attachmentId, 'conversation_id:', data.conversation_id, 'message_id:', data.id);
                        responseHtml += this.formatQueryMetadata(query);
                    }
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

    async formatQueryResults(resultsData, query) {
        let html = '<div style="margin-bottom: 1rem;">';
        
        console.log('Formatting query results, full data:', JSON.stringify(resultsData, null, 2));
        
        // Handle Genie query-result format
        let columns = [];
        let rows = [];
        
        if (resultsData.statement_response) {
            const stmtResponse = resultsData.statement_response;
            console.log('Found statement_response:', stmtResponse);
            if (stmtResponse.result && stmtResponse.result.data_array) {
                rows = stmtResponse.result.data_array;
                console.log('Found data_array with', rows.length, 'rows');
                if (stmtResponse.manifest && stmtResponse.manifest.schema && stmtResponse.manifest.schema.columns) {
                    columns = stmtResponse.manifest.schema.columns;
                    console.log('Found columns:', columns.map(c => c.name));
                }
            }
        }
        // Fallback to old format
        else if (resultsData.result && resultsData.result.data_array) {
            rows = resultsData.result.data_array;
            console.log('Found data_array (old format) with', rows.length, 'rows');
            if (resultsData.manifest && resultsData.manifest.schema && resultsData.manifest.schema.columns) {
                columns = resultsData.manifest.schema.columns;
                console.log('Found columns (old format):', columns.map(c => c.name));
            }
        }
        
        // Display the actual data results
        if (rows && rows.length > 0 && columns && columns.length > 0) {
            html += '<p style="font-weight: 600; margin-bottom: 0.5rem;">📊 Answer:</p>';
            
            // For single row results, display as a clean answer
            if (rows.length === 1 && columns.length <= 2) {
                html += '<p style="font-size: 1.1rem; color: var(--accent-gold); font-weight: 600; margin: 0.5rem 0;">';
                if (columns.length === 1) {
                    html += this.escapeHtml(String(rows[0][0]));
                } else {
                    html += `${this.escapeHtml(String(rows[0][0]))}: ${this.escapeHtml(String(rows[0][1]))}`;
                }
                html += '</p>';
            } else {
                // For multiple rows, display as a table
                html += '<div style="max-height: 300px; overflow-y: auto; margin: 0.5rem 0;">';
                html += '<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">';
                html += '<thead><tr>';
                columns.forEach(col => {
                    html += `<th style="text-align: left; padding: 0.4rem; border-bottom: 2px solid var(--primary-red); color: var(--accent-gold);">${this.escapeHtml(col.name)}</th>`;
                });
                html += '</tr></thead><tbody>';
                
                // Limit to first 10 rows for display
                const displayRows = rows.slice(0, 10);
                displayRows.forEach((row, idx) => {
                    html += `<tr style="border-bottom: 1px solid rgba(225, 6, 0, 0.2);">`;
                    row.forEach(cell => {
                        html += `<td style="padding: 0.4rem;">${this.escapeHtml(String(cell || ''))}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</tbody></table></div>';
                
                if (rows.length > 10) {
                    html += `<p style="font-size: 0.85rem; font-style: italic; margin-top: 0.5rem;">Showing first 10 of ${rows.length} results</p>`;
                }
            }
            
            html += `<p style="font-size: 0.85rem; color: var(--gray-text); margin-top: 0.5rem;">Total: ${rows.length} result(s)</p>`;
        }
        
        // Show query in collapsible section
        if (query.query) {
            html += '<details style="margin-top: 0.5rem;"><summary style="cursor: pointer; font-size: 0.85rem; color: var(--gray-text);">View SQL Query</summary>';
            html += `<div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem; font-family: monospace; font-size: 0.75rem; overflow-x: auto;">`;
            html += `<code>${this.escapeHtml(query.query)}</code>`;
            html += `</div></details>`;
        }
        
        html += '</div>';
        return html;
    }

    formatQueryMetadata(query) {
        let html = '<div style="margin-bottom: 1rem;">';
        
        // Show a message that results are available
        if (query.query_result_metadata && query.query_result_metadata.row_count !== undefined) {
            const count = query.query_result_metadata.row_count;
            html += `<p style="font-size: 1rem; margin-bottom: 0.5rem;">✓ Query executed successfully</p>`;
            html += `<p style="font-size: 0.95rem; color: var(--accent-gold); margin-bottom: 1rem;">📊 Found ${count} result${count !== 1 ? 's' : ''}</p>`;
            
            if (count > 0) {
                html += `<p style="font-size: 0.9rem; color: var(--gray-text); font-style: italic; margin-bottom: 1rem;">Note: To see the actual results, you can run this query in your Databricks workspace, or the data may appear in suggested follow-up questions below.</p>`;
            }
        }
        
        // Show query in collapsible section
        if (query.query) {
            html += '<details style="margin-top: 0.5rem;"><summary style="cursor: pointer; font-size: 0.9rem; color: var(--primary-red); font-weight: 600;">▶ View SQL Query</summary>';
            html += `<div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem; font-family: monospace; font-size: 0.75rem; overflow-x: auto; max-height: 200px; overflow-y: auto;">`;
            html += `<code>${this.escapeHtml(query.query)}</code>`;
            html += `</div>`;
            if (query.description) {
                html += `<p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--gray-text);">${this.escapeHtml(query.description)}</p>`;
            }
            html += '</details>';
        }
        
        html += '</div>';
        return html;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GenieChat();
});
