import React, { useEffect, useRef, useState, useContext } from "react";
import "./Chat.scss";
import { useLocation } from "react-router-dom";

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [ msg, setMsg] = useState("");
  const tbodyRef = useRef(null); // Tham chiếu cho tbody
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserString);
  const [person, setPerson] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading


  //update chat
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const nameParam = queryParams.get("person");
    setPerson(nameParam);
    // console.log("Name from query string:", nameParam);

    // Xóa tin nhắn cũ trước khi yêu cầu tin nhắn mới
    setMessages([]);
    setLoading(true); // Bắt đầu trạng thái loading

    // Cập nhật lại tin nhắn khi person thay đổi
    if (ws && nameParam && ws.readyState === WebSocket.OPEN) {
      const getPeopleChatMes = {
        action: "onchat",
        data: {
          event: "GET_PEOPLE_CHAT_MES",
          data: {
            name: nameParam,
            page: 1,
          },
        },
      };
      const JsonGetPeopleChatMes = JSON.stringify(getPeopleChatMes);
      // console.log("Chuỗi JSON getPeopleChatMes:", JsonGetPeopleChatMes);
      ws.send(JsonGetPeopleChatMes);
    }
  }, [location.search, ws]);

  useEffect(() => {
    const webSocket = new WebSocket("ws://140.238.54.136:8080/chat/chat");
    setWs(webSocket);

    webSocket.onopen = () => {
      // console.log("WebSocket connected");
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
      // console.log("Chuỗi JSON LOGIN:", JsonLogin);
      webSocket.send(JsonLogin);
    };

    webSocket.onmessage = (event) => {

      const message = JSON.parse(event.data);
      console.log("Received message:", message);
     
      if (message.event === "LOGIN") {
        if (message.status === "success") {
          // Sau khi đăng nhập thành công, gửi tin nhắn tới person hiện tại
          const getPeopleChatMes = {
            action: "onchat",
            data: {
              event: "GET_PEOPLE_CHAT_MES",
              data: {
                name: person,
                page: 1,
              },
            },
          };
          const JsonGetPeopleChatMes = JSON.stringify(getPeopleChatMes);
          // console.log("Chuỗi JSON getPeopleChatMes:", JsonGetPeopleChatMes);
          webSocket.send(JsonGetPeopleChatMes);
        } else {
          alert(
            "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập."
          );
          webSocket.close();
        }
      } else if (message.event === "GET_PEOPLE_CHAT_MES") {
        if(message.data.length !==0){
        setMessages(message.data.reverse());
        setLoading(false); // Kết thúc trạng thái loading
        // console.log("Danh sách tin nhắn chat của người dùng:", message.data);
        }else{
          // Thiếu hiển thị useer
          const queryParams = new URLSearchParams(location.search);
          const nameParam = queryParams.get("person");
          // console.log("Name from query string:", nameParam);
          const getRoomChatMes = {
            action: "onchat",
            data: {
              event: "GET_ROOM_CHAT_MES",
              data: {
                name: nameParam,
                page: 1,
              },
            },
          };
          const JsoGetRoomChatMes = JSON.stringify(getRoomChatMes);
          // console.log("Chuỗi JSON getRoomChatMes:", JsoGetRoomChatMes);
          webSocket.send(JsoGetRoomChatMes);
        }
      } else if (message.event === "SEND_CHAT") {
        const newRow = document.createElement("tr");
        newRow.style.height = "50px";
        newRow.innerHTML = `<td >${message.data.mes}</td><td>&nbsp;</td>`;
        tbodyRef.current.append(newRow);
        tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;
        // Xử lý khi nhận được tin nhắn đã gửi thành công
        // console.log("Tin nhắn đã gửi thành công:", message);
        // Cập nhật danh sách tin nhắn nếu cần
      }else if (message.event === "GET_ROOM_CHAT_MES") {
        if (typeof message.data === 'undefined' || typeof message.data.chatData === 'undefined') {
          // console.log('message.data or message.data.chatData is undefined');
          setMessages([]);
        } else {
          setMessages(message.data.chatData);
        }
        setLoading(false);
      }
    };

    webSocket.onerror = (error) => {
      // console.error("WebSocket error:", error);
      alert("Lỗi kết nối WebSocket!");
    };

    webSocket.onclose = () => {
      // console.log("WebSocket connection closed");
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    // Cuộn xuống cuối cùng của tbody khi messages thay đổi
    if (tbodyRef.current) {
      tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (ws && ws.readyState === WebSocket.OPEN) {
      const sendChatData = {
        action: "onchat",
        data: {
          event: "SEND_CHAT",
          data: {
            type: "people",
            to: person,
            mes: msg,
          },
        },
      };
      const newMessage = {
        name: currentUser.username,
        mes: msg,
      };
      const JsonSendChat = JSON.stringify(sendChatData);
      // console.log("Chuỗi JSON JsonSendChat:", JsonSendChat);

      ws.send(JsonSendChat); // Gửi tin nhắn

      // Đặt scroll xuống cuối cùng khi có tin nhắn mới
      const newRow = document.createElement("tr");
      newRow.style.height = "50px";
      newRow.innerHTML = `<td >&nbsp;</td><td>${msg}</td>`;
      tbodyRef.current.append(newRow);
      tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;

      // Reset giá trị của input
      setMsg("");
    } else {
      // console.error("WebSocket is not connected.");
    }
  };

  return (
    <>
      <section className="chat">
        <div className="header-chat">
          <i className="icon fa fa-user-o" aria-hidden="true"></i>
          <p className="name">{person}</p>
          <i
            className="icon clickable fa fa-ellipsis-h right"
            aria-hidden="true"
          ></i>
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}
        >
          <tbody
            id="tbody"
            ref={tbodyRef}
            style={{
              overflowY: "auto", // Hiển thị thanh cuộn dọc khi cần thiết
              maxHeight: "500px", // Chiều cao tối đa của phần tử
              display: "block", // Thiết lập phần tử trở thành block để có thể sử dụng overflow-y
            }}
          >
            {loading ? (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : (
              messages.map((message, index) => (
  <tr key={index} style={{ height: "50px" }}>
    {message.name === person ? (
      <>
        <td style={{
          width: "400px",
          borderRadius: "10px",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
          backgroundColor: "#f2f2f2",
          padding: "20px", // Adjust margin as needed
        }} className="you">
          {message.mes}
        </td>
        <td style={{ width: "400px" }} className="me">
          &nbsp;
        </td>
      </>
    ) : (
      <>
        <td style={{ width: "400px" }} className="you">
          &nbsp;
        </td>
        <td style={{
          width: "400px",
          borderRadius: "10px",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
          backgroundColor: "#f2f2f2",
          padding: "20px",
          textAlign:"right",
        }} className="me">
          {message.mes}
        </td>
      </>
    )}
  </tr>
))
            )}
          </tbody>
        </table>
        <form onSubmit={handleSubmit}>
          <div className="footer-chat">
            <i
              className="icon fa fa-smile-o clickable"
              style={{ fontSize: "25pt" }}
              aria-hidden="true"
            ></i>
            <input
              type="text"
              className="write-message"
              placeholder="Type your message here"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button type="submit">Send</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Chat;
