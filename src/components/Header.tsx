import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.jpg';
import { useFeedback } from '../contexts/FeedbackContext';

const Header: React.FC = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('fullName');
  const { openModal } = useFeedback();

  const handleLogout = () => {
    // Remove token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('UserId');

    // Refresh the page and redirect to homepage
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="UNI VISION BOT" className="h-10 w-auto" />
          <h2 className="text-2xl font-semibold text-black ml-2">UNI VISION BOT</h2>
        </Link>
        <nav>
          <ul className="flex space-x-10 items-center">
            {/* Display only the "Đăng xuất" button for Admin and Consultant roles */}
            {token && (role === 'ADMIN' || role === 'CONSULTANT') ? (
              <li>
                <button onClick={handleLogout} className="bg-green-500 text-white px-4 py-2 rounded flex items-center text-lg font-semibold">
                  Đăng xuất
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/" className="text-gray-700 hover:text-green-500 text-lg font-semibold">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-700 hover:text-green-500 text-lg font-semibold">
                    Tra cứu điểm thi
                  </Link>
                </li>
                <li>
                  <Link to="/career-guidance-test" className="text-gray-700 hover:text-green-500 text-lg font-semibold">
                    Trắc nghiệm hướng nghiệp
                  </Link>
                </li>
                <li>
                  <Link to="/what-to-study" className="text-gray-700 hover:text-green-500 text-lg font-semibold">
                    Bài viết
                  </Link>
                </li>
                {token && role === 'USER' && (<li>
                  <button onClick={openModal} className="bg-green-500 text-white px-4 py-2 rounded flex items-center text-lg font-semibold">
                    Đánh giá
                  </button>
                </li>)}

                {/* Display "Đăng nhập" and "Đăng ký" for other users or if not logged in */}
                {token && role === 'USER'? (
                <>
                  <li>
                    <span className="text-gray-700 text-sm font-semibold">
                      Xin chào, {name}
                    </span>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="bg-green-500 text-white px-4 py-2 rounded flex items-center text-lg font-semibold"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-700 hover:text-green-500 text-lg font-semibold">
                        Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded flex items-center text-lg font-semibold">
                        Đăng ký
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
            
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
