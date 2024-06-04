import React, { useState, useEffect } from 'react';
import './HomePage.scss';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'Bin' },
  { id: 5, name: 'Truong' },
  { id: 6, name: 'Vu' },
  { id: 7, name: 'Tu' },
  { id: 8, name: 'Trung' },
  // Thêm người dùng khác nếu cần
];

const HomePage = ({ webSocket }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'message') {
          setMessages((prevMessages) => {
            const userMessages = prevMessages[message.from] || [];
            return {
              ...prevMessages,
              [message.from]: [...userMessages, { text: message.text, sender: message.from }]
            };
          });
        }
      };
    }
  }, [webSocket]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const message = { action: 'onchat', data: { event: 'MESSAGE', data: { to: selectedUser.id, text: newMessage } } };
      webSocket.send(JSON.stringify(message));
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

  // Lọc người dùng dựa trên truy vấn tìm kiếm
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="homepage-container">
      <h1>Chào mừng đến trang chủ!</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm người dùng..."
        />
      </div>
      <div className="users-list-container">
        <div className="users-list">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`user-item ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
              onClick={() => handleUserClick(user)}
            >
              {user.name}
            </div>
          ))}
        </div>
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
