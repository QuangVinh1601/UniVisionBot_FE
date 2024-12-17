import React from 'react';
import './NotFoundPage.css';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') {
      navigate('/admin'); // Chuyển hướng về trang admin
    } else if (role === 'CONSULTANT') {
      navigate('/consultant-chat'); // Chuyển hướng về trang consultant
    } else {
      navigate('/'); // Chuyển hướng về trang Home
    }
  };

  return (
    <div className="NotFound-container">
      <div className="NotFound-error">
        <h1>Uh Ohh!</h1>
        <p>We couldn't find the page that you're looking for :(</p>
        <div className="NotFound-cta">
          <button className="NotFound-cta-back" onClick={handleBackClick}>
            Quay lại
          </button>
        </div>
      </div>
      <img
        src="https://github.com/smthari/404-page-using-html-css/blob/Starter/Images/404.png?raw=true"
        alt="home image"
        className="NotFound-hero-img"
      />
    </div>
  );
};

export default NotFoundPage;
