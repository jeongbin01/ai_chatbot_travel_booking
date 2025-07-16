import React from 'react';
import logo from '../../assets/images/Main/On_Comma.png';
import '../../styles/layout/Header.css'; 

const Header = () => {
  return (
    <header className="header-wrapper">

      {/* 탑 메뉴 */}
      <div className="top-menu">
        <div className="container right-align">
          <ul className="top-links">
            <li><a href="/login">로그인</a></li>
            <li><a href="/signup">회원가입</a></li>
            <li><a href="/company">고객센터</a></li>
          </ul>
        </div>
      </div>

      <div className="main-header container">
        {/* 로고 */}
        <div className="logo-area">
          <a href="/">
            <img src={logo} alt="OnComma Logo" />
          </a>
        </div>

        {/* 메인 네비게이션 */}
        <nav className="nav-menu">
          <ul>
            <li><a href="/accommodations?region=korea">국내 숙소</a></li>
            <li><a href="/accommodations?region=global">해외 숙소</a></li>
            <li><a href="/products?category=항공권">항공</a></li>
            <li><a href="/products?category=렌터카">렌터카</a></li>
            <li><a href="/mypage"> 액티비티 </a></li>
          </ul>
        </nav>

        {/* 아이콘 메뉴 */}
        <div className="icon-menu">
          <a href="/wishlist" title="찜하기">
            <i className="bi bi-heart"></i>
          </a>
          <a href="/notifications" title="알림">
            <i className="bi bi-bell"></i>
          </a>
          <a href="/profile" title="My">
            <i className="bi bi-person-circle"></i>
          </a>
          <a href='/menu' title='햄버거 메뉴'>
            <i className="bi bi-list"></i>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
