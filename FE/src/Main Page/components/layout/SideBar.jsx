// src/Main Page/components/layout/SideBar.jsx
import React from "react";
import "./SideBar.css"; // 스타일 분리

const SideBar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        <ul>
          <li><i className="bi bi-house-door" /> 홈</li>
          <li><i className="bi bi-geo-alt" /> 국내여행</li>
          <li><i className="bi bi-globe" /> 해외여행</li>
          <li><i className="bi bi-building" /> 숙소</li>
          <li><i className="bi bi-airplane" /> 항공권</li>
          <li><i className="bi bi-car-front" /> 렌터카</li>
          <li><i className="bi bi-map" /> 액티비티</li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
