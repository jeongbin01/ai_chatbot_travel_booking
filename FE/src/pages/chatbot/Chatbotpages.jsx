import React, { useState, useEffect, useRef } from 'react';
import '../../styles/pages/Chatbot.css';

export default function ChatGPTClone() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  // 새 메시지 자동 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    setMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setInput('');

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: `에코: ${txt}` }
      ]);
    }, 600);
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chatgpt-container">
      <header className="chatgpt-header">ChatGPT Clone</header>

      <ul className="chatgpt-messages">
        {messages.map((m, i) => (
          <li key={i} className={`message ${m.sender}`}>
            {m.text}
          </li>
        ))}
        <div ref={endRef} />
      </ul>

      <div className="chatgpt-input-area">
        <textarea
          className="chatgpt-textarea"
          rows={1}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="chatgpt-button" onClick={send}>
          전송
        </button>
      </div>
    </div>
  );
}
