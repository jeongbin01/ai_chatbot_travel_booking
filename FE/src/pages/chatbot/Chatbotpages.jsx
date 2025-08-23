// src/pages/chat/ChatGPTClone.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // ✅ 추가
import '../../styles/pages/Chatbot.css';
import botAvatar from '../../assets/images/Main/오리너구리.gif';

export default function ChatGPTClone() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', avatar: botAvatar }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // ✅ 중복 전송 방지

  // ✅ 레이아웃/스크롤 제어용 ref
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // 환경변수 기반 백엔드 URL (Vite 기준)
  const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://127.0.0.1:7000';

  // ✅ 새 메시지 렌더 후 항상 하단으로 이동
  const scrollToBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // ✅ iOS 키보드 열릴 때 입력창 가려짐/튀는 현상 완화 (visualViewport 사용)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const send = async () => {
    const txt = input.trim();
    if (!txt || loading) return; // ✅ 로딩 중엔 보내지 않기

    // 유저 메시지 추가
    setMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setInput('');
    setLoading(true);

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
    <div className="chatgpt-container" ref={containerRef}>
      <header className="chatgpt-header">ChatGPT Clone</header>

      <ul className="chatgpt-messageschatgpt-messages">
        {messages.map((m, i) => (
          <li key={i} className={`message ${m.sender}`}>
            {m.avatar && (
              <img
                src={m.avatar}
                alt={`${m.sender} avatar`}
                className="message-avatar"
              />
            )}
            <div className="message-content">
              {/* ✅ 문자열 또는 JSX 모두 지원 */}
              {m.text && (
                typeof m.text === 'string' ? <p>{m.text}</p> : <div>{m.text}</div>
              )}
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

        {/* 선택: 타이핑/로딩 표시 */}
        {loading && (
          <li className="message bot">
            <img src={botAvatar} alt="bot avatar" className="message-avatar" />
            <div className="message-content">
              <p>답변 작성 중...</p>
            </div>
          </li>
        )}
      </ul>

      <div className="chatgpt-input-area">
        <textarea
          className="chatgpt-textarea"
          rows={1}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading} // ✅ 로딩 중 입력 잠시 비활성화(선택)
        />
        <button className="chatgpt-button" onClick={send} disabled={loading}>
          {loading ? '전송 중...' : '전송'}
        </button>
      </div>
    </div>
  );
}