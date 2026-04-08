// AI Chat App JavaScript
class ChatApp {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.clearChatBtn = document.getElementById('clearChatBtn');
        this.demoBtn = document.querySelector('.demo-btn');
        this.isLoading = false;
        
        this.init();
        this.loadChatHistory();
    }

    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Clear chat functionality
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        
        // Demo button functionality
        this.demoBtn.addEventListener('click', () => this.startDemo());

        // Focus input on load
        this.messageInput.focus();
    }

    clearChat() {
        // Clear messages from DOM
        this.chatMessages.innerHTML = '';
        
        // Clear localStorage
        localStorage.removeItem('chatHistory');
        
        // Add welcome message
        this.addMessage('Hello! How can I help you today?', 'ai');
    }

    startDemo() {
        // Clear existing chat first
        this.clearChat();
        
        // Add demo messages
        const demoMessages = [
            { role: 'user', content: 'Give me information of this platform?' },
            { role: 'ai', content: 'Certainly! As an AI language model, I can provide you with information about various topics. This platform allows you to chat with an AI assistant powered by Google Gemini technology. You can ask questions, get help with tasks, or just have a conversation!' },
            { role: 'user', content: 'How does it work?' },
            { role: 'ai', content: 'The platform uses Google\'s Gemini API to process your messages and generate intelligent responses. Simply type your question or message in the input field and press Enter or click the send button. I\'ll analyze your request and provide a helpful response based on my training and knowledge.' }
        ];
        
        // Add demo messages with delays
        let messageIndex = 0;
        const addNextMessage = () => {
            if (messageIndex < demoMessages.length) {
                const msg = demoMessages[messageIndex];
                this.addMessage(msg.content, msg.role);
                messageIndex++;
                
                if (messageIndex < demoMessages.length) {
                    setTimeout(addNextMessage, 1500);
                }
            }
        };
        
        // Start adding demo messages
        setTimeout(addNextMessage, 500);
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message || this.isLoading) return;

        // Clear input and disable send button
        this.messageInput.value = '';
        this.setLoadingState(true);

        // Add user message
        this.addMessage(message, 'user');
        
        // Save to history
        this.saveToHistory('user', message);

        try {
            // Show loading indicator
            this.showLoadingIndicator();

            // Get AI response
            const aiResponse = await this.getAIResponse(message);
            
            // Hide loading indicator
            this.hideLoadingIndicator();

            // Add AI response
            this.addMessage(aiResponse, 'ai');
            
            // Save to history
            this.saveToHistory('ai', aiResponse);

        } catch (error) {
            this.hideLoadingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('Error getting AI response:', error);
        }

        this.setLoadingState(false);
        this.messageInput.focus();
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        // Auto scroll to bottom
        this.scrollToBottom();
    }

    showLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message loading-indicator';
        loadingDiv.id = 'loadingIndicator';
        loadingDiv.innerHTML = `
            <div class="message-content">
                <span class="typing-text">Typing</span>
                <span class="loading-dots" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
        `;
        this.chatMessages.appendChild(loadingDiv);
        this.scrollToBottom();
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        this.messageInput.disabled = loading;
    }

    saveToHistory(role, content) {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        history.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 messages
        if (history.length > 50) {
            history.shift();
        }
        
        localStorage.setItem('chatHistory', JSON.stringify(history));
    }

    loadChatHistory() {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        
        // If no history, show welcome message
        if (history.length === 0) {
            this.addMessage('Hello! How can I help you today?', 'ai');
        } else {
            history.forEach(message => {
                this.addMessage(message.content, message.role);
            });
        }
    }

    async getAIResponse(message) {
        const API_KEY = 'AIzaSyDfTr_SNJPmTsQJkK0-W92IbbP8DHhHYI8';
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: message
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            return 'Sorry, I encountered an error while processing your request. Please try again.';
        }
    }
}

// Initialize the chat app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
