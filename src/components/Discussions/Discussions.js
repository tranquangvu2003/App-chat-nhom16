import React, { useEffect, useState } from "react";
import './Discussions.scss';
import UserDicusstion from "../UserDicusstion";
import { Link } from "react-router-dom";

const TodoListGroup = ({ style, submitNewGroup }) => {
  const [newG, setNewG] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    submitNewGroup(newG);
    setNewG('');
  };

  return (
      <form style={style} onSubmit={handleSubmit}>
        <div>Tạo group</div>
        <input
            placeholder="new Group"
            value={newG}
            onChange={(e) => setNewG(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
  );
};

const JoinGroup = ({ style, submitJoinGroup }) => {
  const [joinG, setJoinG] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    submitJoinGroup(joinG);
    setJoinG('');
  };

  return (
      <form style={style} onSubmit={handleSubmit}>
        <div>Join group</div>
        <input
            placeholder="join Group"
            value={joinG}
            onChange={(e) => setJoinG(e.target.value)}
        />
        <button type="submit">Join</button>
      </form>
  );
};

const Discussions = () => {
  const [users, setUsers] = useState([]);
  const [ws, setWs] = useState(null);
  const [showTodoList, setShowTodoList] = useState(false);
  const [showJonGr, setShowJonGr] = useState(false);
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserString);

  useEffect(() => {
    const webSocket = new WebSocket("ws://140.238.54.136:8080/chat/chat");

    webSocket.onopen = () => {
      setWs(webSocket);
      const loginData = {
        action: "onchat",
        data: {
          event: "LOGIN",
          data: {
            user: currentUser.username,
            pass: currentUser.password,
          },
        },
      };
      const JsonLogin = JSON.stringify(loginData);
      webSocket.send(JsonLogin);
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      if (message.event === "LOGIN") {
        if (message.status === "success") {
          const getUserList = {
            action: "onchat",
            data: {
              event: "GET_USER_LIST",
            },
          };
          const JsonListUser = JSON.stringify(getUserList);
          webSocket.send(JsonListUser);
        } else {
          alert("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.");
        }
      } else if (message.event === "GET_USER_LIST") {
        if (message.status === "success") {
          setUsers(message.data);
        } else {
          console.error("Lấy danh sách người dùng thất bại:", message.mes);
        }
      } else if (message.event === "CREATE_ROOM") {
        if (message.status === "success") {
          console.log('Phòng đã được tạo thành công:', message.data);
          setShowTodoList(false)
          const getUserList = {
            action: "onchat",
            data: {
              event: "GET_USER_LIST",
            },
          };
          const JsonListUser = JSON.stringify(getUserList);
          webSocket.send(JsonListUser);
        } else {
          console.error("Tạo phòng thất bại:", message.mes);
        }
      } else if (message.event === "JOIN_ROOM") {
        if (message.status === "success") {
          console.log('Tham gia phòng thành công:', message.data);
          setShowJonGr(false)
          const getUserList = {
            action: "onchat",
            data: {
              event: "GET_USER_LIST",
            },
          };
          const JsonListUser = JSON.stringify(getUserList);
          webSocket.send(JsonListUser);
        } else {
          console.error("Tham gia phòng thất bại:", message.mes);
        }
      }
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      alert("Lỗi kết nối WebSocket!");
      setWs(null);
    };

    webSocket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      setWs(null);
    };

    return () => {
      if (webSocket.readyState === WebSocket.OPEN) {
        // webSocket.close();
      }
      console.log('Ngắt kết nối WebSocket');
    };
  }, [currentUser.username, currentUser.password]);

  const submitNewGroup = (groupName) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const sendGroupData = {
        action: "onchat",
        data: {
          event: "CREATE_ROOM",
          data: {
            name: groupName
          }
        }
      };
      const jsonNewG = JSON.stringify(sendGroupData);
      ws.send(jsonNewG);
      console.log('Gửi yêu cầu tạo nhóm:', jsonNewG);
    }else {
      console.error('WebSocket không sẵn sàng hoặc đã đóng.');
    }
  };

  const submitJoinGroup = (groupName) => {
    console.log('ws',ws)
    if (ws && ws.readyState === WebSocket.OPEN) {
      const sendJoinGroupData = {
        action: "onchat",
        data: {
          event: "JOIN_ROOM",
          data: {
            name: groupName
          }
        }
      };
      const jsonG = JSON.stringify(sendJoinGroupData);
      ws.send(jsonG);
      console.log('Gửi yêu cầu tham gia nhóm:', jsonG);
    }else {
      console.error('WebSocket không sẵn sàng hoặc đã đóng.');
    }
  };

  return (
      <>
        <section className="discussions">
          <div className="discussion search">
            <div className="searchbar">
              <i className="fa fa-search" aria-hidden="true"></i>
              <input type="text" placeholder="Search..." />
            </div>
            <div className="buttons">
              <button onClick={() => {setShowJonGr(!showJonGr); setShowTodoList(false)}} className="btn-add-member">
                <i className="fa fa-user-plus" aria-hidden="true"></i>
              </button>
              <button onClick={() => {setShowJonGr(false); setShowTodoList(!showTodoList)}} className="btn-add-group">
                <i className="fa fa-users" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {users.map((user, index) => (
              <Link to={`/home?person=${user.name}&type=${user.type}`} key={index}>
                <UserDicusstion name={user.name} type={user.type}/>
              </Link>
          ))}

          {!showJonGr && showTodoList && <TodoListGroup style={{ position: 'fixed', left: '28%', top: '15%' }} submitNewGroup={submitNewGroup} />}
          {showJonGr && !showTodoList && <JoinGroup style={{ position: 'fixed', left: '20%', top: '15%' }} submitJoinGroup={submitJoinGroup} />}
        </section>
      </>
  );
};

export default Discussions;
