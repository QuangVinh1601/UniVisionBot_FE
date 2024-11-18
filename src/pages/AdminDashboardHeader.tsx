// AdminDashboardHeader.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBriefcase, faClipboardList, faGraduationCap, faUser } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/logo.jpg';
import './AdminDashboardHeader.css'; // Import the CSS file


const AdminDashboardHeader: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const location = useLocation();
  const { UserId } = location.state || {};

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="UNI VISION BOT" />
            <h2>UNI VISION BOT</h2>
          </div>
          <p>Admin Dashboard</p>
          <p>ID của Admin: {UserId}</p> 
        </div>
        <nav>
          <ul>
            <li>
              <a
                href="#Dashboard"
                className={`nav-item ${activeItem === 'Dashboard' ? 'active' : ''}`}
                onClick={() => handleItemClick('Dashboard')}
              >
                <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '10px' }} />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#Careers"
                className={`nav-item ${activeItem === 'Careers' ? 'active' : ''}`}
                onClick={() => handleItemClick('Careers')}
              >
                <FontAwesomeIcon icon={faBriefcase} style={{ marginRight: '10px' }} />
                Các Ngành Nghề
              </a>
            </li>
            <li>
              <a
                href="#career-guidance-test"
                className={`nav-item ${activeItem === 'career-guidance-test' ? 'active' : ''}`}
                onClick={() => handleItemClick('career-guidance-test')}
              >
                <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '10px' }} />
                Trắc Nghiệm
              </a>
            </li>
            <li>
              <a
                href="#what-to-study"
                className={`nav-item ${activeItem === 'what-to-study' ? 'active' : ''}`}
                onClick={() => handleItemClick('what-to-study')}
              >
                <FontAwesomeIcon icon={faGraduationCap} style={{ marginRight: '10px' }} />
                Học Nghề Gì
              </a>
            </li>
            <li>
              <a
                href="#Account"
                className={`nav-item ${activeItem === 'Account' ? 'active' : ''}`}
                onClick={() => handleItemClick('Account')}
              >
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                Tài Khoản
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      {/* <main style={{ flex: 1, padding: '20px', background: '#D9D9D9' }}>
        <AdminDashboardMain />
      </main> */}
    </div>
  );
};

export default AdminDashboardHeader;