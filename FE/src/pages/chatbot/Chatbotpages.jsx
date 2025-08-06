import React, { useState, useEffect, useRef } from 'react';
import '../../styles/pages/Chatbot.css';
// 아바타 로고 및 이미지 import
import botAvatar from '../../assets/images/Main/오리너구리.gif';

export default function ChatGPTClone() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', avatar: botAvatar }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  // 새 메시지 자동 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const send = () => {
    const txt = input.trim();
    if (!txt) return;

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setInput('');

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', avatar: botAvatar, text: '여기에 봇의 답장 텍스트를 넣으세요' }
      ]);
    }, 600);
  };

  // 엔터키로 전송
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
            {/* 아바타 */}
            {m.avatar && (
              <img
                src={m.avatar}
                alt={`${m.sender} avatar`}
                className="message-avatar"
              />
            )}
            <div className="message-content">
              {/* 텍스트 메시지 */}
              {m.text && <p>{m.text}</p>}
              {/* 이미지 메시지 */}
              {m.image && (
                <img
                  src={m.image}
                  alt={m.alt || 'bot image'}
                  className="message-image"
                />
              )}
            </div>
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
