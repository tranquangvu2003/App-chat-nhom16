import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Login.scss';
import { Link } from "react-router-dom";
import { UserContext } from "../UserContextProvider";
import {toast} from "react-toastify";

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { ws, createWebSocket } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        if (message.status === 'success') {
          // Đăng nhập thành công
          toast.success('Đăng nhập thành công!');
          localStorage.setItem(
              "currentUser",
              JSON.stringify({ username: username, password: password })
          );
          navigate('/home');
        } else {
          // Đăng nhập thất bại
          toast.error('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.');
          // ws.close();
        }
      };
    }
  }, [ws, username, password, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert('WebSocket chưa được khởi tạo hoặc chưa kết nối! Khởi tạo lại...');
      createWebSocket();
      return;
    }

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

  return (
      <div className="login-container">
        <h1 style={{textAlign: "center", fontFamily: "initial"}}>Đăng Nhập</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Tài khoản:</label>
            <input
                type="text"
                id="username"
                style={{backgroundColor: "#f2f2f2"}}
                placeholder="Enter your username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
                placeholder="Enter your password"
                type="password"
                id="password"
                style={{backgroundColor: "#f2f2f2"}}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
        <div className="btn-register" style={{color: "white", marginTop: "15px"}}>
          <button ><Link to="/register" style={{color: "white", textDecoration: "none"}}>Đăng Kí</Link></button>
        </div>
      </div>
  );
};

export default LogIn;