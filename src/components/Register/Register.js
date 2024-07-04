import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Register.scss';
import LogIn from "../LogIn/LogIn";

const Register = ({ setWebSocket }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if(password !== password1){
      alert('Mật khẩu nhập lại không đúng! Vui lòng kiểm tra lại.');
      return
    }else if(username === '' || password === '' || password1 === ''){
      alert('Vui lòng nhập đủ các thông tin.');
      return
    }

    // Thiết lập kết nối WebSocket
    const ws = new WebSocket('ws://140.238.54.136:8080/chat/chat');

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Gửi thông tin đăng kí
      const loginData = {
        action: 'onchat',
        data: {
          event: "REGISTER",
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
        alert(message.data);
        <LogIn setWebSocket={setWebSocket} />
        navigate('/');
      } else if(message.status === 'error'){
        // Đăng nhập thất bại
        alert('Lỗi: '+message.mes);
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
        <h2>Đăng kí tài khoản</h2>
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
          <div className="input-group">
            <label htmlFor="password">Nhập lại mật khẩu:</label>
            <input
                type="password"
                id="password1"
                name="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
            />
          </div>
          <button type="submit">Đăng Kí</button>
        </form>
        <div className="btn-register">
          <button><Link to="/">Quay lại đăng nhập</Link></button>
        </div>
      </div>
  );
};

export default Register;
