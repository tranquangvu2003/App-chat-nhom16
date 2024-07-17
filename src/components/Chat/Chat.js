import React, { useEffect, useRef, useState } from "react";
import "./Chat.scss";
import { useLocation } from "react-router-dom";
import Picker, {SkinTones} from 'emoji-picker-react';

const Chat = () => {
    // console.log("updataadaaf")
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const nameParam = queryParams.get("person");
    const typeParam = queryParams.get("type")
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [ msg, setMsg] = useState("");
    const tbodyRef = useRef(null); // Tham chiếu cho tbody
    const currentUserString = localStorage.getItem("currentUser");
    const currentUser = JSON.parse(currentUserString);
    const [person, setPerson] = useState(nameParam);
    const [type, setType] = useState(typeParam);
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [own,setOwn] = useState("")
    const [listMember,setListMember] = useState([])
    const [showPicker, setShowPicker] = useState(false);
    const onEmojiClick = (event, emojiObject) => {
        const emoji = event?.emoji;
        if (emoji) {
            setMsg(prevMsg => prevMsg + emoji);
        }
        setShowPicker(false); // Ẩn picker emoji sau khi chọn
    };
      
      
    //update chat
    // console.log('type',type)
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const nameParam = queryParams.get("person");
        const typeParam = queryParams.get("type");
        setPerson(nameParam);
        setType(typeParam);
        setMessages([]);
        setLoading(true);

        // Cập nhật lại tin nhắn khi person thay đổi
        if (ws && nameParam && ws.readyState === WebSocket.OPEN) {
            if(typeParam === "0"){
                setType(typeParam)
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
                console.log("Chuỗi JSON getPeopleChatMes:", JsonGetPeopleChatMes);
                ws.send(JsonGetPeopleChatMes);
            } else if(typeParam === "1"){
                setType(typeParam)
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
                ws.send(JsoGetRoomChatMes);
            }else {
                console.log("err,type")
            }
        }
    }, [location.search, ws]);


    useEffect(() => {
        const webSocket = new WebSocket("ws://140.238.54.136:8080/chat/chat");
        setWs(webSocket);
        // console.log("websocket thay đổi")
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
            if(document.getElementById('tdMess1')){
                document.getElementById('tdMess1').remove();
            }
            const message = JSON.parse(event.data);
            console.log("Received message:", message);
            if (message.event === "LOGIN") {
                if (message.status === "success") {
                    if(type === '0'){
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
                        console.log("Chuỗi JSON getPeopleChatMes:", JsonGetPeopleChatMes);
                        webSocket.send(JsonGetPeopleChatMes);
                    }else if(type === '1'){
                        // Sau khi đăng nhập thành công, gửi tin nhắn tới person hiện tại
                        const getPeopleChatMes = {
                            action: "onchat",
                            data: {
                                event: "GET_ROOM_CHAT_MES",
                                data: {
                                    name: person,
                                    page: 1,
                                },
                            },
                        };
                        const JsonGetPeopleChatMes = JSON.stringify(getPeopleChatMes);
                        // console.log("Chuỗi JSON getPeopleChatMes:", JsonGetPeopleChatMes);
                        webSocket.send(JsonGetPeopleChatMes);
                    }
                } else {
                    alert(
                        "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập."
                    );
                    // webSocket.close();
                }
            } else if (message.event === "GET_PEOPLE_CHAT_MES") {
                if(document.getElementById('tdMess2')){
                    document.getElementById('tdMess2').remove();
                }
                setMessages(message.data.reverse());
                setLoading(false); // Kết thúc trạng thái loading
                // console.log("Danh sách tin nhắn chat của người dùng:", message.data);
            } else if (message.event === "SEND_CHAT") {
                const newRow = document.createElement("tr");
                newRow.style.height = "50px";
                const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
                newRow.innerHTML = `
  <td id="tdMess1" style="color: blue; width: 200px; border-radius: 10px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); background-color: #f2f2f2; padding: 20px;">
    ${message.data.mes}
    <br/>
    <p className="detailMes" style="font-size: 10px; color: black;">
      ${currentTime}
    </p>
  </td>
  <td class="tdMess">&nbsp;</td>
`;

                // console.log(message.data.to);
                // console.log();
                if(message.data.to == currentUser.username){
                    tbodyRef.current.append(newRow);
                    tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;
                }
                
                // Xử lý khi nhận được tin nhắn đã gửi thành công
                // console.log("Tin nhắn đã gửi thành công:", message);
                // Cập nhật danh sách tin nhắn nếu cần
            }else if (message.event === "GET_ROOM_CHAT_MES") {
                if(document.getElementById('tdMess2')){
                    document.getElementById('tdMess2').remove();
                }
                if (typeof message.data === 'undefined' || typeof message.data.chatData === 'undefined') {
                    // console.log('message.data or message.data.chatData is undefined');
                    setMessages([]);
                } else {
                    setOwn(message.data.own);
                    setListMember(message.data.userList)
                    setMessages(message.data.chatData.reverse());
                }
                setLoading(false);
            }else if(message.event === "AUTH" && message.mes === 'User not Login'){
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
            }
        };

        webSocket.onerror = (error) => {
            // console.error("WebSocket error:", error);
            alert("Lỗi kết nối WebSocket!");
        };

        webSocket.onclose = () => {
            console.log("WebSocket connection closed on chat.js");
        };

        return () => {
            if (ws) {
                // ws.close();
            }
        };
    }, []);

    useEffect(() => {
        // Cuộn xuống cuối cùng của tbody khi messages thay đổi
        if (tbodyRef.current) {
            tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleDeleteMessage = (index) => {
        setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // const queryParams = new URLSearchParams(location.search);
        // const typeParam = queryParams.get("type");
        if(type === '0'){
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
                const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
                newRow.style.height = "50px";
                newRow.innerHTML = `
  <td class="tdMess">&nbsp;</td>
  <td id="tdMess2" style="width: 200px; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px inset; background-color: rgb(242, 242, 242); padding: 20px; text-align: right; color: red;">
    ${msg}
    <br/>
    <p className="detailMes" style="font-size: 10px; color: black;">
      ${currentTime}
    </p>
  </td>
`;

                tbodyRef.current.append(newRow);
                tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;

                // Reset giá trị của input
                setMsg("");
            } else {
                console.error("WebSocket is not connected.");
            }
        }else if(type=== '1' ){
            if (ws && ws.readyState === WebSocket.OPEN) {
                const sendChatData = {
                    action: "onchat",
                    data: {
                        event: "SEND_CHAT",
                        data: {
                            type: "room",
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
                const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
                newRow.style.height = "50px";
                newRow.innerHTML = ` <td class="tdMess" style="width: 200px";>&nbsp;</td>
  <td id="tdMess2" style="width: 200px; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px inset; background-color: rgb(242, 242, 242); padding: 20px; text-align: right; color: red;">
    ${msg}
    <br/>
    <p className="detailMes" style="font-size: 10px; color: black;">
      ${currentTime}
    </p>
  </td>`;
                tbodyRef.current.append(newRow);
                tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;

                // Reset giá trị của input
                setMsg("");
            } else {
                console.error("WebSocket is not connected.");
            }
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
                    style={{width: "100%",minWidth:"561px",maxWidth:"600px", borderCollapse: "collapse", marginBottom: 10}}
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
                            <td colSpan="2" style={{textAlign: "center"}}>
                                Loading...
                            </td>
                        </tr>
                    ) : (type === "0" ?(
                        messages.map((message, index) => (
                            <tr key={index} style={{height: "50px"}}>
                                {message.name === person ? (
                                    <>
                                        <td style={{
                                            color: "blue",
                                            width: "200px",
                                            maxWidth:"200px",
                                            wordBreak:"break-all",
                                            borderRadius: "10px",
                                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                                            backgroundColor: "#f2f2f2",
                                            padding: "20px", // Adjust margin as needed
                                        }} className="you">
                                            {message.mes}
                                            <>
                                                <br/>

                                                <p className="detailMes" style={{fontSize: "10px", color: "black"}}>
                                                    {message.createAt}
                                                </p>
                                            </>
                                        </td>
                                        <td style={{width: "200px"}} className="me">
                                            &nbsp;
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td style={{width: "200px"}} className="you">
                                            &nbsp;
                                        </td>
                                        <td style={{
                                            color: "red",
                                            width: "200px",
                                            maxWidth:"200px",
                                            wordBreak:"break-all",
                                            borderRadius: "10px",
                                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                                            backgroundColor: "#f2f2f2",
                                            padding: "20px",
                                            textAlign: "right",
                                        }} className="me">
                                            {message.mes}
                                            <br/>
                                            <p className="detailMes"
                                               style={{fontSize: "10px", color: "black"}}>
                                                {message.createAt}
                                            </p>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        messages.map((message, index) => (
                            <tr key={index} style={{height: "50px"}}>
                                {message.name !== currentUser.username ? (
                                    <>
                                        <td style={{
                                            color: "blue",
                                            width: "200px",
                                            borderRadius: "10px",
                                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                                            backgroundColor: "#f2f2f2",
                                            padding: "20px", // Adjust margin as needed
                                        }} className="you">
                                            {message.mes}
                                                <>
                                                    <br />
                                                    <span className="detailMes" style={{fontSize: "10px", color: "black" , whiteSpace: "nowrap"}}>
                                                        <span className="detailMes"
                                                           style={{fontSize: "10px", color: "black"}}>
                                                            {message.name} {"  / "}
                                                        </span>
                                                        {message.createAt}
                                                    </span>
                                                </>
                                        </td>
                                        <td style={{width: "200px"}} className="me">
                                            &nbsp;
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td style={{width: "200px"}} className="you">
                                            &nbsp;
                                        </td>
                                        <td style={{
                                            color: "red",
                                            width: "200px",
                                            borderRadius: "10px",
                                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                                            backgroundColor: "#f2f2f2",
                                            padding: "20px",
                                            textAlign: "right",
                                        }} className="me">
                                            {message.mes}
                                            <br/>
                                            <p className="detailMes"
                                               style={{fontSize: "10px", color: "black"}}>{message.createAt}
                                            </p>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ))}
                    </tbody>
                </table>
                <form onSubmit={handleSubmit}>
                <div className="footer-chat">
                  <i
                        className="icon fa fa-image clickable"
                        style={{ fontSize: "20pt", cursor: "pointer" }}
                        aria-hidden="true"
                    ></i>
                    {/* Nút emoji */}
                    <i
                        className="icon fa fa-smile-o clickable"
                        style={{ fontSize: "20pt", cursor: "pointer" }}
                        aria-hidden="true"
                        onClick={() => setShowPicker(prev => !prev)}
                    ></i>
                    {/* Hiển thị picker emoji nếu showPicker là true */}
                    {showPicker && (
                        <Picker className="emoji-picker-container"
                         style={{
                        position: 'absolute',
                        width: '600px',  // Adjust this value to make it wider
                        height: '400px', // Adjust this value to make it shorter
                        bottom: '10px',  // Adjust this value as needed
                        right: '600px',   // Adjust this value as needed
                        zIndex: 1000,    // Ensure it is above other elements
                        overflowY: 'scroll'
                     }}
                            onEmojiClick={onEmojiClick}
                        />
                    )}
                    {/* Input tin nhắn */}
                    <input
                        type="text"
                        className="write-message"
                        placeholder="Type your message here"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    {/* Nút gửi */}
                    <button type="submit">Send</button>
                </div>
            </form>

            </section>
            {type === "1" ? (<div className="table-container">
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th>Chủ sở hữu <p style={{color: "red"}}>{own}</p></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="horizontal-line" colSpan="1"></td>
                    </tr>
                    <tr>
                        <th>Thành viên</th>
                    </tr>
                    {listMember.map((item, index) => (
                        <tr key={index}>
                            <td>{index}:{item.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>) : ""}
        </>
    );
};

export default Chat;