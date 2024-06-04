
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../Login.scss';

// const LogIn = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedUsername = localStorage.getItem('username');
//     const savedPassword = localStorage.getItem('password');
//     if (savedUsername && savedPassword) {
//       setUsername(savedUsername);
//       setPassword(savedPassword);
//       setRememberMe(true);
//     }
//   }, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (rememberMe) {
//       localStorage.setItem('username', username);
//       localStorage.setItem('password', password);
//     } else {
//       localStorage.removeItem('username');
//       localStorage.removeItem('password');
//     }
//     alert('Đăng nhập thành công!');
//     navigate('/home');
//   };

//   return (
//     <div className="login-container">
//       <h2>Đăng Nhập</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="input-group">
//           <label htmlFor="username">Tài khoản:</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <label htmlFor="password">Mật khẩu:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <input
//             type="checkbox"
//             id="rememberMe"
//             name="rememberMe"
//             checked={rememberMe}
//             onChange={(e) => setRememberMe(e.target.checked)}
//           />
//           <label htmlFor="rememberMe">Lưu tài khoản mật khẩu</label>
//         </div>
//         <button type="submit">Đăng Nhập</button>
//       </form>
//     </div>
//   );
// };

// export default LogIn;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.scss';

const LogIn = ({ setWebSocket }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (rememberMe) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }

    // Establish WebSocket connection
    const ws = new WebSocket('ws://140.238.54.136:8080/chat/chat');
    ws.onopen = () => {
      console.log('WebSocket connected');
      // Send registration message
      const registrationMessage = {
        action: 'onchat',
        data: {
          event: 'REGISTER',
          data: {
            user: username,
            pass: password
          }
        }
      };
      ws.send(JSON.stringify(registrationMessage));
      setWebSocket(ws);
      alert('Đăng nhập thành công!');
      navigate('/home');
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      alert('Đăng nhập thất bại!');
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
        <div className="input-group">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Lưu tài khoản mật khẩu</label>
        </div>
        <button type="submit">Đăng Nhập</button>
      </form>
    </div>
  );
};

export default LogIn;
