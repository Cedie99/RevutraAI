import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import axios from 'axios';

// Markdown parsing function
const parseMarkdown = (text) => {
  text = text.replace(/^###\s*(.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^##\s*(.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/^#\s*(.+)$/gm, '<h1>$1</h1>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');
  text = text.replace(/^(?!<h\d>|<ul>|<li>|<p>|<strong>)(.+)$/gm, '<p>$1</p>');
  return text;
};

const Chatbot = ({ context }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Show summary context note at startup
  useEffect(() => {
    if (context && context.trim() && messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: `<p><i>This conversation is based on the <strong>summarized key points</strong> from your uploaded file. Ask anything to understand it better.</i></p>`
        }
      ]);
    }
  }, [context]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    const loaderMsg = { sender: 'loader' };

    setMessages(prev => [...prev, userMsg, loaderMsg]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:8000/api/chat', {
        question: `User asked: "${input}". Respond based on the following summarized key points:\n${context}`,
        context: context
      });

      const botMsg = {
        sender: 'bot',
        text: parseMarkdown(res.data.answer)
      };

      setMessages(prev => {
        const updated = [...prev];
        updated.pop(); // remove loader
        return [...updated, botMsg];
      });
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => {
        const updated = [...prev];
        updated.pop();
        return [...updated, {
          sender: 'bot',
          text: '<p><i>Oops! Something went wrong.</i></p>'
        }];
      });
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        Revutra AI
        
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => {
          if (msg.sender === 'loader') {
            return (
              <div key={index} className="chat-message bot loading">
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
              </div>
            );
          }

          return (
            <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
              <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              <span className="timestamp">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
