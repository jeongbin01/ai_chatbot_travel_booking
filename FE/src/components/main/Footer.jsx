import React from "react";
import "../../styles/layout/Footer.css";
function Footer() {
  return (
    <footer className="footer-light">
      <div className="footer-container">
        {/* 상단 */}
        <div className="footer-top">
          <div className="footer-brand">
            <h5>온쉼 여행 플랫폼</h5>
            <p>
              편안한 여행의 시작, 온쉼과 함께 믿을 수 있는 예약 서비스를
              경험하세요.
            </p>
          </div>

          <div className="footer-links">
            <a href="#">회사소개</a>
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="#">고객센터</a>
          </div>
        </div>

        {/* 중단: 회사 정보 + SNS */}
        <div className="footer-bottom">
          <div className="company-info">
            <p>
              상호명: OnComma Inc. | 대표: 온쉼 팀 | 사업자등록번호:
              123-45-67890
            </p>
            <p>
              주소: 서울특별시 강남구 테헤란로 123 | 이메일: support@oncomma.com
            </p>
          </div>
          <div className="footer-sns">
            <a href="#">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#">
              <i className="bi bi-youtube"></i>
            </a>
          </div>
        </div>

        {/* 하단: 저작권 */}
        <div className="footer-copyright">
          <p>© 2025 OnComma Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
