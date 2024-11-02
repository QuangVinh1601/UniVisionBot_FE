import React from 'react';
import duytan from '../images/duytan.png';
import donga from '../images/donga.png';
import danang from '../images/danang.png';
import fptdanang from '../images/fptdanang.png';
interface AdBannerProps {
  position: 'left' | 'right';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  return (
    <div className={`w-1/5 bg-white ${position === 'left' ? 'order-first' : 'order-last'}`}>
      <div className="p-4">
        <a href="https://duytan.edu.vn/tuyen-sinh/Page/Home.aspx" target="_blank" rel="noopener noreferrer">
          <img
            src={duytan}
            alt="Advertisement"
            className="cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105"
          />
        </a>
        <br />
        <a href="https://donga.edu.vn/tuyensinh" target="_blank" rel="noopener noreferrer">
          <img
            src={donga} 
            alt="Advertisement"
            className="cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105"
          />
        </a>
        <br />
        <a href="https://dnuni.fpt.edu.vn/tuyen-sinh/quy-che-tuyen-sinh/" target="_blank" rel="noopener noreferrer">
          <img
            src={fptdanang} 
            alt="Advertisement"
            className="cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105"
          />
        </a>
        <br />
        <a href="https://ts.udn.vn/DHCD/Chinhquy" target="_blank" rel="noopener noreferrer">
          <img
            src={danang} 
            alt="Advertisement"
            className="cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105"
          />
        </a>
      </div>
    </div>
  );
};

export default AdBanner;