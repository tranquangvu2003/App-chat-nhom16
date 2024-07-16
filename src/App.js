import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './components/LogIn/LogIn';
import HomePage from './components/HomePage/HomePage';
import Register from "./components/Register/Register";
import UserContextProvider from "./components/UserContextProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
    const [webSocket, setWebSocket] = useState(null);

    return (
        <Router>
            <UserContextProvider>
                <Routes>
                    <Route path="/" element={<LogIn setWebSocket={setWebSocket} />} />
                    <Route path="/home" element={<HomePage webSocket={webSocket} />} />
                    <Route path="/register" element={<Register webSocket={webSocket} />} />
                </Routes>
            </UserContextProvider>
            <ToastContainer />
        </Router>
    );
};

export default App;
