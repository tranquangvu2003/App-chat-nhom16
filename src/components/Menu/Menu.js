import React, { useContext } from "react";
import './Menu.scss';
import { UserContext } from "../UserContextProvider";
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";

const Menu = () => {
  const navigate = useNavigate();
  const { ws } = useContext(UserContext);

  const out = {
    action: "onchat",
    data: {
      event: "LOGOUT"
    }
  };

  const logout = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const logoutMessage = JSON.stringify(out);
      console.log('Chuỗi JSON logout:', logoutMessage);
      ws.send(logoutMessage);

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        if (message.status === 'success') {
          toast.success(message.data)
          // alert(message.data);
          // closeWebSocket(); // Đóng WebSocket khi đăng xuất thành công
          navigate('/');
        }else if (message.event === 'AUTH' && message.mes === 'User not Login'){
          navigate('/');
          toast.success('You are Logout!')
          // alert('You are Logout!')
        } else {
          alert('Đã xảy ra lỗi. Vui lòng thử lại');
        }
      };
    } else {
      alert('WebSocket không sẵn sàng. Vui lòng thử lại sau.');
    }
  };

  return (
      <nav className="menu">
        <ul className="items">
          <li className="item">
            <i className="fa fa-home" aria-hidden="true"></i>
          </li>
          <li className="item">
            <i className="fa fa-user" aria-hidden="true"></i>
          </li>
          <li className="item">
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </li>
          <li className="item item-active">
            <i className="fa fa-commenting" aria-hidden="true"></i>
          </li>
          <li className="item">
            <i className="fa fa-file" aria-hidden="true"></i>
          </li>
          <li className="item">
            <i className="fa fa-sign-out" aria-hidden="true" onClick={logout}></i>
          </li>
        </ul>
      </nav>
  );
};

export default Menu;