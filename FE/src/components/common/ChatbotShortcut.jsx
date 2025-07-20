import React from 'react';
import '../../styles/components/ChatbotShortcut.css';

const ChatbotShortcut = () => {
  const handleClick = () => {
    // 실제 챗봇 동작 or 페이지 이동 로직 넣기
    alert('챗봇 열기 (예: 채팅창 팝업 또는 /chatbot 페이지로 이동)');
    // 또는: window.location.href = "/chatbot";
  };

  return (
    <button className="chatbot-button" onClick={handleClick} aria-label="챗봇 바로가기">
      <i className="bi bi-chat-dots-fill"></i>
    </button>
  );
};

export default ChatbotShortcut;
