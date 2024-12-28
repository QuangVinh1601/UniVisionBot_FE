import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faBriefcase,
  faGraduationCap,
  faUser,
  faCalendar,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Link, Outlet } from 'react-router-dom';
import logo from '../../images/logo.jpg';
// import Profile_Admin from '../../images/profile_admin.png';

const AdminDashboardHeader: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<string>('17 April 2024 - 21 May 2024');

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPeriod(event.target.value);
  };

  const name = localStorage.getItem('fullName');

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('UserId');
    window.location.href = '/'; // Chuyển hướng về trang chủ
  };

  return (
    <div className="flex h-screen w-full relative">
      {/* Sidebar - Made collapsible and responsive */}
      <aside className="w-64 md:w-72 flex-none bg-white shadow-xl border-r border-gray-200 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="flex items-center p-4 space-x-2">
            <img src={logo} alt="UNI VISION BOT" className="h-8 w-8 object-contain" />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-800 truncate">UNI VISION BOT</h2>
              <p className="text-xs text-gray-600">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="truncate">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/careers"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4 mr-3" />
                <span>Các Ngành Nghề</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/what-to-study"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 mr-3" />
                <span>Học Nghề Gì</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/feedback"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 mr-3" />
                <span>Đánh Giá</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/account"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3" />
                <span>Tài Khoản</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content - Made responsive */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Made responsive */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 flex-none">
          <div className="flex items-center justify-end h-14 px-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 hidden sm:inline">
                Xin chào, {name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-3.5 h-3.5 mr-2" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area - Made responsive */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto p-4 max-w-full xl:max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
