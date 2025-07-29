import React from 'react'
import { Link, useLocation } from "react-router-dom";

const MyPageAside = () => {
    const location = useLocation();
    return (
        <aside className="sidebar">
            <ul>
            <li className={location.pathname === "/mypage/bookings" ? "active" : ""}>
                <Link to="/mypage/bookings">예약 내역</Link>
            </li>
            <li className={location.pathname === "/mypage/wishlist" ? "active" : ""}>
                <Link to="/mypage/wishlist">찜 목록</Link>
            </li>
            <li className={location.pathname === "/mypage/profile" ? "active" : ""}>
                <Link to="/mypage/profile">내 정보 관리</Link>
            </li>
            </ul>
        </aside>
    )
}

export default MyPageAside



    