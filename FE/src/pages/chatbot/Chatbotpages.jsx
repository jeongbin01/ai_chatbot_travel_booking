// src/pages/yourpath/ChatGPTClone.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // ✅ axios 사용
import '../../styles/pages/Chatbot.css';
// 아바타 로고 및 이미지 import
import botAvatar from '../../assets/images/Main/오리너구리.gif';

export default function ChatGPTClone() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', avatar: botAvatar }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false); 
  const endRef = useRef(null);

  /* ===== 스크롤 헬퍼: 맨 아래로 부드럽게 ===== */
  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

  // 새 메시지 추가 시 자동 스크롤 (typing은 제외)
  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const send = async () => {
    const txt = input.trim();
    if (!txt) return;

    // 유저 메시지 추가
    setMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setInput('');
    scrollToEnd(); // 입력 직후 한 번 내려주기

    let started = 0;
    try {
      setTyping(true); 
      started = Date.now();

      // FastAPI로 GET 요청 보내기
      const res = await axios.get(
        `http://127.0.0.1:7000/qa/${encodeURIComponent(txt)}`
      );

      // 봇 응답 추가
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          avatar: botAvatar,
          text: res?.data?.reply?.contents ?? '응답 형식이 올바르지 않습니다.'
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', avatar: botAvatar, text: '서버 연결 실패' }
      ]);
    } finally {
      // ✅ 최소 노출 시간 보장 (500ms)
      const MIN = 500;
      const elapsed = Date.now() - started;
      if (elapsed < MIN) {
        await new Promise(r => setTimeout(r, MIN - elapsed));
      }
      setTyping(false);
      scrollToEnd(); // 응답 렌더 직후 보장 스크롤
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

        {/* ✅ AI 타이핑 인디케이터 (봇 말풍선) */}
        {typing && (
          <li className="message bot">
            <img src={botAvatar} alt="bot avatar" className="message-avatar" />
            <div className="message-content">
              <p>
                <span className="typing"><i></i><i></i><i></i></span>
                {/* 필요하면 텍스트도 추가: &nbsp;입력중… */}
              </p>
            </div>
          </li>
        )}

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
          onFocus={scrollToEnd}  // ✅ 클릭/포커스 시 맨 아래로
          onInput={scrollToEnd}  // ✅ 입력 중에도 아래로
          onClick={scrollToEnd}  // ✅ 클릭 시에도 아래로
        />
        <button
          className="chatgpt-button"
          onClick={async () => {
            scrollToEnd(); // 클릭 즉시 한번
            await send();  // 메시지 추가 후 useEffect로 또 내려감
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}
