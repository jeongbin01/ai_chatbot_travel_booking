import React from 'react'
import logo from '../../assets/images/On_Comma.png';
import '../../styles/layout/Header.css'; 

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* 왼쪽: 로고 + 햄버거 */}
        <div className="left-section">
          <img src={logo} alt="OnComma Logo" className="logo" />
        </div>

        {/* 가운데: 메뉴 */}
        <nav className="center-section">
          <ul className="menu-list">
            <li>
              <span>국내여행</span>
            </li>
            <li>
              <span>해외여행</span>
            </li>
            <li>
              <span>숙소</span>
            </li>
            <li>
              <span>항공권</span>
            </li>
            <li>
              <span>렌트카</span>
            </li>
            <li>
              <span>액티비티</span>
            </li>
          </ul>
        </nav>

        {/* 왼쪽: 메뉴 */}
        <ul className="right-section">
          <li>
            <span>로그인／회원가입</span>
          </li>
          <li>
            <i className="bi bi-person-circle" />
            <span>My</span>
          </li>
          <li>
            <i className="bi-calendar-check" />
            <span>예약내역</span>
          </li>
          <li>
            <i className="bi bi-ticket-detailed-fill" />
            <span>이벤트/쿠폰</span>
          </li>
        </ul>
      </div>
    </header>

  )
}

export default Header