import React, { useEffect, useState } from "react";
import './Discussions.scss'
import UserDicusstion  from "../UserDicusstion";
import { Link } from "react-router-dom";
const Discussions = () => {
  const [users, setUsers] = useState([]);
  const [ws, setWs] = useState(null); // State để lưu đối tượng WebSocket
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserString);
  useEffect(() => {
    // Khởi tạo kết nối WebSocket khi component được mount
    const webSocket = new WebSocket("ws://140.238.54.136:8080/chat/chat");
    setWs(webSocket); // Lưu đối tượng WebSocket vào state

    // Xử lý khi mở kết nối WebSocket
    webSocket.onopen = () => {
      console.log("WebSocket connected");
      // Gửi thông tin đăng nhập
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
      console.log("Chuỗi JSON LOGIN:", JsonLogin);
      webSocket.send(JsonLogin);
    };

    // Xử lý khi nhận được tin nhắn từ WebSocket
    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      if (message.event === "LOGIN") {
        if (message.status === "success") {
          console.log("Đăng nhập thành công");
          // Gửi yêu cầu lấy danh sách người dùng
          const getUserList = {
            action: "onchat",
            data: {
              event: "GET_USER_LIST",
            },
          };
          const JsonListUser = JSON.stringify(getUserList);
          console.log("Chuỗi JSON GET_USER_LIST:", JsonListUser);
          webSocket.send(JsonListUser);
        } else {
          alert(
            "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập."
          );
          webSocket.close(); // Đóng kết nối WebSocket nếu đăng nhập thất bại
        }
      } else if (message.event === "GET_USER_LIST") {
        if (message.status === "success") {
          console.log("Danh sách người dùng nhận được:", message.data);
          setUsers(message.data); // Cập nhật danh sách người dùng vào state
        } else {
          console.error("Lấy danh sách người dùng thất bại:", message.mes);
        }
      }
    };

    // Xử lý khi có lỗi kết nối WebSocket
    // webSocket.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    //   alert("Lỗi kết nối WebSocket!");
    // };

    // Xử lý khi đóng kết nối WebSocket
    webSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup effect: Đóng kết nối WebSocket khi component unmount
    return () => {
      webSocket.close();
    };
  }, []); // Dependency array rỗng để chỉ chạy một lần khi component mount
    return(
        <>
             <section className="discussions">
            <div className="discussion search">
              <div className="searchbar">
                <i className="fa fa-search" aria-hidden="true"></i>
                <input type="text" placeholder="Search..." />
              </div>
              <div className="buttons">
                <button className="btn-add-member">
                  <i className="fa fa-user-plus" aria-hidden="true"></i>
                </button>
                <button className="btn-add-group">
                  <i className="fa fa-users" aria-hidden="true"></i>
                </button>
              </div>
            </div>
       
          
                {users.map((user, index) => (
                  <Link to={`/home?person=${user.name}`} key={index}><UserDicusstion name={user.name} /></Link>
                  
                 
                ))}
           
          </section>
        </>
    )
}

export default Discussions;