import React, { useState, useEffect } from 'react';
import './Chat.css';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const welcomeMessage = {
            sender: 'bot',
            text: 'Hello! How can I assist you today?',
            buttons: [
                { title: 'Categories', payload: 'show_categories' },
                { title: 'Best Selling', payload: 'show_best_selling' },
            ],
        };
        setMessages([welcomeMessage]);
    }, []);

    const sendMessage = () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);
        setInput('');
    };

    const handleButtonClick = (buttonPayload, buttonTitle) => {
        const userMessage = { sender: 'user', text: buttonTitle };
        setMessages([...messages, userMessage, { sender: 'bot', text: `You chose the ${buttonTitle.toLowerCase()} option.` }]);

        if (buttonPayload === 'show_categories') {
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: 'bot',
                    text: 'Please select a category:',
                    buttons: [
                        { title: 'Men', payload: 'show_men' },
                        { title: 'Women', payload: 'show_women' },
                        { title: 'Kids', payload: 'show_kids' },
                        { title: 'Accessories', payload: 'show_accessories' },
                    ],
                },
            ]);
        } else if (buttonPayload === 'show_best_selling') {
            navigate('/');
        } else if (buttonPayload === 'show_men') {
            navigate('/men');
        } else if (buttonPayload === 'show_women') {
            navigate('/women');
        } else if (buttonPayload === 'show_kids') {
            navigate('/kids');
        } else if (buttonPayload === 'show_accessories') {
            navigate('/accessories');
        }
    };

    const toggleChat = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className="chat-wrapper">
            <div className={`chat-container ${isMinimized ? 'minimized' : ''}`}>
                <div className="chat-header" onClick={toggleChat}>
                    <span>Chat</span>
                    <button>{isMinimized ? '↑' : '↓'}</button>
                </div>
                {!isMinimized && (
                    <>
                        <div className="chat-box" id="chat-box">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender}`}>
                                    {msg.text}
                                    {msg.buttons && (
                                        <div className="buttons">
                                            {msg.buttons.map((button, idx) => (
                                                <button key={idx} onClick={() => handleButtonClick(button.payload, button.title)}>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;
