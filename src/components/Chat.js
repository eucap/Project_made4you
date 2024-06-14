import React, { useState, useEffect } from 'react';
import './Chat.css';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const welcomeMessage = {
            sender: 'bot',
            text: 'Hello! How can I assist you today?',
            buttons: [
                { title: 'Categories', payload: '/show_categories' },
                { title: 'Best Selling', payload: '/show_best_selling' },
            ],
        };
        setMessages([welcomeMessage]);
    }, []);

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender: 'user', message: input }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            handleBotMessages(data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleButtonClick = async (buttonPayload) => {
        const userMessage = { sender: 'user', text: buttonPayload };
        setMessages([...messages, userMessage]);

        try {
            const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender: 'user', message: buttonPayload }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            handleBotMessages(data);
        } catch (error) {
            console.error('Error sending button click:', error);
        }
    };

    const handleBotMessages = (data) => {
        const botMessages = data.map((msg) => {
            if (msg.buttons) {
                return { sender: 'bot', text: msg.text, buttons: msg.buttons };
            } else {
                if (msg.text === 'show_categories') {
                    navigate('/categories');
                } else if (msg.text === 'show_best_selling') {
                    navigate('/best-selling');
                }
                return { sender: 'bot', text: msg.text };
            }
        });
        setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    };

    return (
        <div className="chat-container">
            <div className="chat-box" id="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                        {msg.buttons && (
                            <div className="buttons">
                                {msg.buttons.map((button, idx) => (
                                    <button key={idx} onClick={() => handleButtonClick(button.payload)}>
                                        {button.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
