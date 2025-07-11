import { Link } from 'react-router-dom';
import logo from '../../assets/images/On_Comma.png';
import '../../styles/layout/Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">
          <img src={logo} alt="On Comma Logo" />
        </Link>
       
      </div>
    </header>
  );
}
