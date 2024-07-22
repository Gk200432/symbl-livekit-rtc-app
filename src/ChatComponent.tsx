import React, { useState, useEffect, useRef } from 'react';
import './RoomPage.css'; // Import the CSS file

interface ChatMessage {
  name: string;
  message: string;
}

const ChatComponent = ({ participantName }: { participantName: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const chatRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const messageIds = useRef<Set<string>>(new Set()); // Track message IDs to avoid duplicates

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080'); // Your WebSocket server URL

    ws.current.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data);

      // Check if the message is already displayed
      if (!messageIds.current.has(data.message)) {
        messageIds.current.add(data.message);
        setMessages(prevMessages => [...prevMessages, data]);
      }

      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleSend = () => {
    if (input.trim() && ws.current) {
      const message = {
        name: participantName,
        message: input
      };

      // Send the message to the WebSocket server
      ws.current.send(JSON.stringify(message));

      // Ensure the message is only added once to the state
      if (!messageIds.current.has(input)) {
        messageIds.current.add(input);
        setMessages(prevMessages => [...prevMessages, message]);
      }

      setInput('');
    }
  };

  return (
    <div className="chatContainer show">
      <div className="chatMessages" ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className="chatMessage">
            <strong>{msg.name}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="chatInput">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
