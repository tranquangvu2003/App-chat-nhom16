import React, { useState } from 'react';
import './HomePage.scss';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  // Thêm người dùng khác nếu cần
];

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => {
        const userMessages = prevMessages[selectedUser.id] || [];
        return {
          ...prevMessages,
          [selectedUser.id]: [...userMessages, { text: newMessage, sender: 'You' }]
        };
      });
      setNewMessage('');
    }
  };

  return (
    <div className="homepage-container">
      <h1>Chào mừng đến trang chủ!</h1>
      <div className="users-list">
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-item ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
            onClick={() => handleUserClick(user)}
          >
            {user.name}
          </div>
        ))}
      </div>
      {selectedUser && (
        <div className="chat-box">
          <h2>Chat với {selectedUser.name}</h2>
          <div className="messages">
            {(messages[selectedUser.id] || []).map((message, index) => (
              <div key={index} className="message">
                <span className="sender">{message.sender}:</span> {message.text}
              </div>
            ))}
          </div>
          <div className="input-group">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
