import React from 'react';
import logo from '../../assets/images/On_Comma.png'; // 실제 경로에 맞게 조정
import '../../styles/layout/Header.css'; // 스타일 파일 연결

const Header = () => {
  return (
    <header className="header-wrapper">

      {/* 🔹 탑 메뉴 (로그인/회원가입/고객센터) */}
      <div className="top-menu">
        <div className="container right-align">
          <ul className="top-links">
            <li><a href="/login">로그인</a></li>
            <li><a href="/signup">회원가입</a></li>
          </ul>
        </div>
      </div>

      {/* 🔹 로고 + 메인 메뉴 + 아이콘 메뉴 */}
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
            <li><a href="/products">여행 상품</a></li>
            <li><a href="/products?category=항공권">항공권 예약</a></li>
            <li><a href="/products?category=렌터카">렌터카 예약</a></li>
            <li><a href="/mypage">마이페이지</a></li>
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
          <a href="/cart" title="장바구니">
            <i className="bi bi-cart3"></i>
          </a>
          <a href="/profile" title="프로필">
            <i className="bi bi-person-circle"></i>
          </a>
          <a href='/' title='햄버거 메뉴'>
            <i className="bi bi-list"></i>
          </a>
        </div>
      </div>

    </header>
  );
};

export default Header;
