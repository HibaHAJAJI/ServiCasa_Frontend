import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './PrivateNavbar.css';

const PrivateNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <Link to="/client" className="navbar-brand">
          <span className="brand-name">Servi</span>
          <span className="brand-plus">Casa</span>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/client/profile" className="profile-btn">
          <FaUserCircle className="profile-icon" />
          <span>{user?.username || "Mon profil"}</span>
        </Link>
      </div>

    </nav>
  );
};

export default PrivateNavbar;