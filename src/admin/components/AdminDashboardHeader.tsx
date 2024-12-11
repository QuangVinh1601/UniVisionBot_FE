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
import Profile_Admin from '../../images/profile_admin.png';

const AdminDashboardHeader: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<string>('17 April 2024 - 21 May 2024');

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPeriod(event.target.value);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/'; // Chuyển hướng về trang chủ
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="flex flex-col items-center justify-center p-5">
          <div className="flex items-center justify-center">
            <img src={logo} alt="UNI VISION BOT" className="h-10" />
            <h2 className="ml-2 text-gray-800 text-lg font-bold">UNI VISION BOT</h2>
          </div>
          <p className="mt-1 text-gray-800 text-sm text-center">Admin Dashboard</p>
        </div>
        <nav>
          <ul className="p-0 m-0 list-none">
            <li className="mb-2">
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-800 hover:text-green-600"
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/careers"
                className="flex items-center p-2 text-gray-800 hover:text-green-600"
              >
                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                Các Ngành Nghề
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/what-to-study"
                className="flex items-center p-2 text-gray-800 hover:text-green-600"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                Học Nghề Gì
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/feedback"
                className="flex items-center p-2 text-gray-800 hover:text-green-600"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                Đánh Giá
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/account"
                className="flex items-center p-2 text-gray-800 hover:text-green-600"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Tài Khoản
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-gray-300 shadow-md p-4 flex items-center justify-between">
          {/* Filter Period */}
          <div className="flex items-center bg-white p-2 shadow rounded-lg">
            <label htmlFor="filter" className="mr-2 text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="mr-1" />
              Filter Period
            </label>
            <select
              id="filter"
              value={filterPeriod}
              onChange={handleFilterChange}
              className="p-1 border border-gray-400 rounded shadow-sm"
            >
              <option value="17 April 2024 - 21 May 2024">17 April 2024 - 21 May 2024</option>
              <option value="01 June 2024 - 30 June 2024">01 June 2024 - 30 June 2024</option>
              <option value="01 July 2024 - 31 July 2024">01 July 2024 - 31 July 2024</option>
            </select>
          </div>

          {/* Admin Info and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                <span className="text-gray-600">Hello, </span>
                <span className="font-bold">Trung</span>
              </h1>
              <img src={Profile_Admin} alt="Admin Profile" className="w-10 h-10 rounded-full ml-4" />
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet /> 
          {/* Render nội dung con dựa trên route */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
