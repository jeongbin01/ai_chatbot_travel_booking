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
  const send = async () => {
    const txt = input.trim();
    if (!txt) return;

    // 유저 메시지 추가
    setMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setInput('');

    try {
      // FastAPI로 GET 요청 보내기
      const res = await axios.get(
        `http://127.0.0.1:7000/qa/${encodeURIComponent(txt)}`
      );

      // 봇 응답 추가
      setMessages(prev => [
        ...prev,
        { sender: 'bot', avatar: botAvatar, text: res.data.reply.contents }
      ]);
    } catch (err) {
      console.error(err);

      setMessages(prev => [
        ...prev,
        { sender: 'bot', avatar: botAvatar, text: "서버 연결 실패 😢" }
      ]);
    }
  };

  // 엔터키 전송
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chatgpt-container">
      <header className="chatgpt-header">ChatGPT Clone</header>

      <ul className="chatgpt-messageschatgpt-messages">
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