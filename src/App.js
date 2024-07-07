
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './components/LogIn/LogIn';
import HomePage from './components/HomePage/HomePage';
import Register from "./components/Register/Register";

const App = () => {
  const [webSocket, setWebSocket] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn setWebSocket={setWebSocket} />} />
        <Route path="/home" element={<HomePage webSocket={webSocket} />} />
        <Route path="/register" element={<Register webSocket={webSocket} />} />
      </Routes>
    </Router>
  );
};

export default App;