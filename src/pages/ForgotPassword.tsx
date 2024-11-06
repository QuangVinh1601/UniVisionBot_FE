import React, { useState } from 'react';
import logo from '../images/logo.jpg';

const ForgotPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="w-1/2 bg-green-500 flex flex-col items-center justify-center text-white p-12">
          <div className="w-48 h-48 mb-5">
            <img src={logo} alt="UNI VISION BOT Logo" className="w-full h-full object-contain p-2"/>
          </div>
          <h1 className="text-2xl font-semibold text-center text-black mb-4">UNI VISION BOT</h1>
          <p className="text-center text-lg">
            "Chọn đúng trường, hướng đúng nghề – <br />
            Bước tới tương lai cùng hệ thống tư vấn <br />
            tuyển sinh trực tuyến!"
          </p>
        </div>

        <div className="w-1/2 bg-white p-8 mt-8">
          <h2 className="text-3xl font-bold mb-6">Đổi mật khẩu</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Địa chỉ Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                placeholder="Nhập email của bạn"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nhập mật khẩu mới<span className="text-red-500">*</span>
              </label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Nhập mật khẩu mới"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span 
                className="absolute right-3 top-10 text-sm text-blue-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              </span>
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nhập lại mật khẩu <span className="text-red-500">*</span>
              </label>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Nhập lại mật khẩu"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span 
                className="absolute right-3 top-10 text-sm text-blue-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              </span>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2 leading-tight" 
                />
                <span className="text-gray-700 text-sm">Nhớ mật khẩu</span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
