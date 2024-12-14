import React from 'react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="NotFound-container">
      <div className="NotFound-error">
        <h1>Uh Ohh!</h1>
        <p>We couldn't find the page that you're looking for :(</p>
        <div className="NotFound-cta">
          <button className="NotFound-cta-back" onClick={() => window.history.back()}>Go Back</button>
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
