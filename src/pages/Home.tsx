import React from 'react';
import image1 from '../images/image1.jpg'; 
import image2 from '../images/image2.jpg';
import image3 from '../images/image3.jpg';
const Home: React.FC = () => {
  return (
    <div className="relative ">
      <img src={image1} alt="Background" className="w-full h-full object-cover mb-4" />
      <h1 className="text-4xl font-semibold text-black text-center my-4">GIỚI THIỆU UNI VISION BOT</h1>
      <img src={image2} alt="Image2" className="w-full h-full object-cover my-4"/>
      <img src={image3} alt="Image3" className="w-full h-full object-cover my-4"/>
    </div>
  );
};

export default Home;
