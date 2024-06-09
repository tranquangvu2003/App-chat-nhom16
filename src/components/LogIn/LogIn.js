import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Login.scss';

const LogIn = ({ setWebSocket }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Thiết lập kết nối WebSocket
    const ws = new WebSocket('ws://140.238.54.136:8080/chat/chat');

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Gửi thông tin đăng nhập
      const loginData = {
        action: 'onchat',
        data: {
          event: "LOGIN",
          data: {
            user: username,
            pass: password
          }
        }
      };
      const JsonLogin = JSON.stringify(loginData);
      console.log('Chuỗi JSON login:', JsonLogin);
      ws.send(JsonLogin);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      if (message.status === 'success') {
        // Đăng nhập thành công
        alert('Đăng nhập thành công!');
        <LogIn setWebSocket={setWebSocket} />
        navigate('/home');
      } else {
        // Đăng nhập thất bại
        alert('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.');
        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      alert('Lỗi kết nối WebSocket!');
    };
  };

  return (
      <div className="login-container">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Tài khoản:</label>
            <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
      </div>
  );
};

export default LogIn;
