import React, { useEffect, useState } from "react";
import './Discussions.scss';
import UserDicusstion from "../UserDicusstion";
import { Link } from "react-router-dom";

const NewGroup = ({ style, submitNewGroup }) => {
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
  const [showJonGr, setShowJonGr] = useState(false);
  const [showTodoList, setShowTodoList] = useState(false); // Assuming this state exists
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [defaultUsers, setDefaultUsers] = useState([]);
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserString);
  const webSocket = new WebSocket("ws://140.238.54.136:8080/chat/chat");

  useEffect(() => {

    webSocket.onopen = () => {
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
          setDefaultUsers(message.data); // Set default users list
        } else {
          console.error("Lấy danh sách người dùng thất bại:", message.mes);
        }
      }
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      alert("Lỗi kết nối WebSocket!");
    };

    webSocket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    };

    return () => {
      if (webSocket.readyState === WebSocket.OPEN) {
        // webSocket.close();
      }
      console.log('Ngắt kết nối WebSocket');
    };
  }, [currentUser.username, currentUser.password]);

  const submitNewGroup = (groupName) => {
    const wsk = new WebSocket("ws://140.238.54.136:8080/chat/chat");
    wsk.onopen = () => {
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
      wsk.send(JsonLogin);
    }
    wsk.onmessage = (event) => {
      const messagenewG = JSON.parse(event.data);
      console.log("Received message:", messagenewG);

      if (messagenewG.event === "LOGIN") {
        if (messagenewG.status === "success") {

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
          wsk.send(jsonNewG);
          console.log('Gửi yêu cầu tạo nhóm:', jsonNewG);
        } else {
          alert("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.");
        }
      } else if (messagenewG.event === "CREATE_ROOM") {
        if (messagenewG.status === "success") {
          console.log('Phòng đã được tạo thành công:', messagenewG.data);
          const getUserList = {
            action: "onchat",
            data: {
              event: "GET_USER_LIST",
            },
          };
          const JsonListUser = JSON.stringify(getUserList);
          wsk.send(JsonListUser);
        } else {
          console.error("Tạo phòng thất bại:", messagenewG.mes);
        }
      } else if (messagenewG.event === "GET_USER_LIST") {
        if (messagenewG.status === "success") {
          setUsers(messagenewG.data);
          setDefaultUsers(messagenewG.data); // Set default users list
          wsk.close()
        } else {
          console.error("Lấy danh sách người dùng thất bại:", messagenewG.mes);
        }
      } else {
        console.error('WebSocket không sẵn sàng hoặc đã đóng.');
      }
    };
  }
  const submitJoinGroup = (groupName) => {
    const wsk = new WebSocket("ws://140.238.54.136:8080/chat/chat");

    wsk.onopen = () => {
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
      wsk.send(JsonLogin);
    }

    wsk.onmessage = (event) => {
        const messagenewG = JSON.parse(event.data);
        console.log("Received message:", messagenewG);
        if (messagenewG.event === "LOGIN") {
          if (messagenewG.status === "success") {
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
            wsk.send(jsonG);
            console.log('Gửi yêu cầu tham gia nhóm:', jsonG);
          } else {
            alert("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.");
          }
        } else if (messagenewG.event === "JOIN_ROOM") {
          if (messagenewG.status === "success") {
            console.log('Tham gia phòng thành công:', messagenewG.data);
            const getUserList = {
              action: "onchat",
              data: {
                event: "GET_USER_LIST",
              },
            };
            const JsonListUser = JSON.stringify(getUserList);
            wsk.send(JsonListUser);
          } else {
            console.error("Tham gia phòng thất bại:", messagenewG.mes);
          }
        } else if (messagenewG.event === "GET_USER_LIST") {
          console.log("Tham gia phòng thất bại:", messagenewG);
          if (messagenewG.status === "success") {
            setUsers(messagenewG.data);
            setDefaultUsers(messagenewG.data); // Set default users list
            wsk.close()
          } else {
            console.error("Lấy danh sách người dùng thất bại:", messagenewG.mes);
          }
        } else {
          console.error('WebSocket không sẵn sàng hoặc đã đóng.');
        }
      }
  };

  const handleSearch = () => {
    const filtered = defaultUsers.filter(user =>
      user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <>
      <section className="discussions">
        <div className="discussion search">
          <div className="searchbar">
            <i className="fa fa-search" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="buttons">
            <button onClick={() => { setShowJonGr(!showJonGr); setShowTodoList(false); }} className="btn-add-member">
              <i className="fa-solid fa-comment-medical" aria-hidden="true"></i>
            </button>
            <button onClick={() => { setShowJonGr(!showJonGr); setShowTodoList(false); }} className="btn-add-member">
              <i className="fa fa-user-plus" aria-hidden="true"></i>
            </button>
            <button onClick={() => { setShowJonGr(false); setShowTodoList(!showTodoList); }} className="btn-add-group">
              <i className="fa fa-users" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div className="user-list" style={{
          overflowY: "auto",
          maxHeight: "630px",
          display: "block",
        }}>
          {(searchQuery ? filteredUsers : users).map((user, index) => (
            <Link to={`/home?person=${user.name}&type=${user.type}`} key={index}>
              <UserDicusstion name={user.name} />
            </Link>
          ))}
          {searchQuery && filteredUsers.length === 0 && <p>No users found.</p>}
        </div>

        {!showJonGr && showTodoList && (
          <NewGroup
            style={{
              position: 'fixed',
              left: '29.5%',
              top: '12%',
              transform: 'translateX(-50%)',
              backgroundColor: '#FF99CC', // Brighter white background
              padding: '30px', // Increased padding
              borderRadius: '12px', // More rounded corners
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Increased shadow
              width: '320px', // Increased width
              maxWidth: '90vw',
              fontSize: '16px',
              zIndex: 1000,
              border: '1px solid #ddd', // Added border
              marginBottom: '40px',

            }}
            submitNewGroup={submitNewGroup}
          />
        )}

        {showJonGr && !showTodoList && (
          <JoinGroup
            style={{
              position: 'fixed',
              left: '29.5%',
              top: '12%', // Adjusted position to ensure spacing
              transform: 'translateX(-50%)',
              backgroundColor: '#FF99CC', // Brighter light gray background
              padding: '30px', // Increased padding
              borderRadius: '12px', // More rounded corners
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Increased shadow
              width: '320px', // Increased width
              maxWidth: '90vw',
              fontSize: '16px',
              zIndex: 1000,
              border: '1px solid #ddd', // Added border
              marginBottom: '40px', // Increased bottom margin for spacing
            }}
            submitJoinGroup={submitJoinGroup}
          />
        )}
      </section>
    </>
  );
};

export default Discussions;
