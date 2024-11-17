import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBriefcase, faGraduationCap, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo.jpg';
import Profile_Admin from '../../images/profile_admin.png';
import AdminCareers from '../pages/AdminCareers';
import AdminDashboard from '../pages/AdminDashboard';
import AdminAccount from '../pages/AdminAccount';
import AdminWhatToStudy from '../pages/AdminWhatToStudy';

const AdminDashboardHeader: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const [filterPeriod, setFilterPeriod] = useState<string>('17 April 2024 - 21 May 2024');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPeriod(event.target.value);
  };

  return (
    <div className="flex h-screen">
      <aside>
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
              <a
                href="#Dashboard"
                className={`flex items-center p-2 text-gray-800 hover:text-green-600 active:font-bold ${activeItem === 'Dashboard' ? 'text-green-600' : ''}`}
                onClick={() => handleItemClick('Dashboard')}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
                Dashboard
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#Careers"
                className={`flex items-center p-2 text-gray-800 hover:text-green-600 active:font-bold ${activeItem === 'Careers' ? 'text-green-600' : ''}`}
                onClick={() => handleItemClick('Careers')}
              >
                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                Các Ngành Nghề
              </a>
            </li>

            <li className="mb-2">
              <a
                href="#what-to-study"
                className={`flex items-center p-2 text-gray-800 hover:text-green-600 active:font-bold ${activeItem === 'what-to-study' ? 'text-green-600' : ''}`}
                onClick={() => handleItemClick('what-to-study')}
              >
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                Học Nghề Gì
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#Account"
                className={`flex items-center p-2 text-gray-800 hover:text-green-600 active:font-bold ${activeItem === 'Account' ? 'text-green-600' : ''}`}
                onClick={() => handleItemClick('Account')}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Tài Khoản
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <header className="flex-1 bg-gray-300">
        <div className="flex flex-col justify-between items-end mt-2 mr-2">
          <div className="flex items-center justify-between space-x-4">
            <h1 className="text-xl font-bold text-gray-800">
              <span className="text-gray-600">Hello, </span>
              <span className="font-bold">Trung</span>
            </h1>
            <img src={Profile_Admin} alt="" />
          </div>
          <div className="flex items-center mt-4 bg-white p-2 shadow rounded-lg">
            <label htmlFor="filter" className="mr-2 text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="mr-1" />
              Filter Period
            </label>
            <select id="filter" value={filterPeriod} onChange={handleFilterChange} className="p-1 border border-gray-400 rounded shadow-sm">
              <option value="17 April 2024 - 21 May 2024">17 April 2024 - 21 May 2024</option>
              <option value="01 June 2024 - 30 June 2024">01 June 2024 - 30 June 2024</option>
              <option value="01 July 2024 - 31 July 2024">01 July 2024 - 31 July 2024</option>
            </select>
          </div>
        </div>
        <br></br>
        {activeItem === 'Careers' && <AdminCareers />}
        {activeItem === 'Dashboard' && <AdminDashboard />}
        {activeItem === 'Account' && <AdminAccount />}
        {activeItem === 'what-to-study' && <AdminWhatToStudy />}
      </header>
      {/* Render CareerList when active item is Careers */}
    </div>
  );
};

export default AdminDashboardHeader;
