import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ roomId, roomTitle, ownerName, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Get current user from localStorage (assuming JWT token contains user info)
  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Load chat messages
  const loadMessages = async () => {
    if (!roomId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/chat/room/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId,
          message: newMessage.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.newMessage]);
        setNewMessage('');
        messageInputRef.current?.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && roomId) {
      loadMessages();
    }
  }, [isOpen, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Chat Header */}
        <div className="chat-header">
          <h3>Chat with {ownerName}</h3>
          <p className="room-title">{roomTitle}</p>
          <button className="close-chat" onClick={onClose}>&times;</button>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {loading ? (
            <div className="loading-messages">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === currentUser?.id ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  {msg.message}
                </div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="message-input-container">
          <textarea
            ref={messageInputRef}
            className="message-input"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
            disabled={sending}
          />
          <button
            className="send-button"
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;