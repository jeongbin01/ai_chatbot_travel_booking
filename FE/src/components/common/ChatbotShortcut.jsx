import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import '../../styles/components/ChatbotShortcut.css';
import '../../assets/images/Main/오리너구리.gif';

const ChatbotShortcut = () => {
  const navigate = useNavigate(); // ✅ 훅 사용

  const handleClick = () => {
    navigate('/chatbot'); // ✅ 페이지 이동
  };

  return (
    <button
      className="chatbot-button"
      onClick={handleClick}
      aria-label="챗봇 바로가기"
    >
      <i className="bi bi-chat-dots-fill"></i>
    </button>
  );
};

export default ChatbotShortcut;
