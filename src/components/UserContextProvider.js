import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [ws, setWs] = useState(null);

    const createWebSocket = () => {
        const newWs = new WebSocket('ws://140.238.54.136:8080/chat/chat');

        newWs.onopen = () => {
            console.log('WebSocket connected');
        };

        newWs.onclose = () => {
            console.log('WebSocket closed');
            setWs(null); // Reset ws state to null when closed
        };

        newWs.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setWs(newWs);
    };

    useEffect(() => {
        createWebSocket();

        return () => {
            if (ws) ws.close();
        };
    }, []);

    const closeWebSocket = () => {
        if (ws) {
            ws.close();
        }
    };

    return (
        <UserContext.Provider value={{ ws, createWebSocket, closeWebSocket }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;