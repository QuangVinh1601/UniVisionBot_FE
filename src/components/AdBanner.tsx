import React from 'react';
import duytan from '../images/duytan.png';
import kientruchanoi from '../images/kientruchanoi.jpeg';
import kinhtehcm from '../images/kinhtehcm.jpeg';
import vanlang from '../images/vanlang.jpg';

interface AdBannerProps {
  position: 'left' | 'right';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  return (
    <div className={`w-1/5 bg-white ${position === 'left' ? 'order-first' : 'order-last'}`}>
      <div className="p-4">
        <a href="https://duytan.edu.vn/tuyen-sinh/Page/Home.aspx" target="_blank" rel="noopener noreferrer">
          <img src={duytan} alt="Advertisement" className="cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105" />
        </a>
        <br />
        <a href="https://hau.edu.vn/thong-tin-tuyen-sinh-dai-hoc_c08/" target="_blank" rel="noopener noreferrer">
          <img src={kientruchanoi} alt="Advertisement" className="cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105" />
        </a>
        <br />
        <a href="https://tuyensinh.ueh.edu.vn/" target="_blank" rel="noopener noreferrer">
          <img src={kinhtehcm} alt="Advertisement" className="cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105" />
        </a>
        <br />
        <a href="https://tuyensinh.vlu.edu.vn/" target="_blank" rel="noopener noreferrer">
          <img src={vanlang} alt="Advertisement" className="cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105" />
        </a>
      </div>
    </div>
  );
};

export default AdBanner;
