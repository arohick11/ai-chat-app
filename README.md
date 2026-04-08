# EasyChat - AI Chat App

EasyChat is a simple browser-based chat application that lets you chat with an AI assistant using Google Gemini.

## What this project does

- Provides a chat-style UI in the browser
- Sends your message to the Gemini API
- Displays the AI response in the chat window
- Saves chat history locally in your browser (localStorage)

## Features

- Chat UI with user messages (right) and AI messages (left)
- Press Enter to send messages
- Prevents sending empty messages
- “Typing…” loading indicator while waiting for the AI response
- Auto-scrolls to the latest message
- Clear chat button
- Demo conversation button
- Local chat history (keeps the last 50 messages)

## Tech used

- HTML
- CSS
- JavaScript (Vanilla)
- Google Gemini API (`generateContent` endpoint)

## How to run

### Option 1: Open directly

1. Open `index.html` in your browser.
2. Type a message and click send.

Note: Some browsers may block API calls when opening files directly. If that happens, use Option 2.

### Option 2: Run with a local server (recommended)

From the project folder:

```bash
python3 -m http.server 5173
```

Then open:

- http://localhost:5173

## Configuration (API Key)

The Gemini API key is currently set in `script.js` inside `getAIResponse()`.

Important: Since this is a frontend-only project, any API key placed in `script.js` is visible to anyone who can load the page. For production, move the API call to a backend/proxy and keep the key on the server.
