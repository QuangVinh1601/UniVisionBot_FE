import React, { useState } from 'react';
import logo from '../images/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fullNameError, setFullNameError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  const validateFullName = (value: string): boolean => {
    if (!value.trim()) {
      setFullNameError('Required full name');
      return false;
    }
    setFullNameError('');
    return true;
  };

  const validateUserName = (value: string): boolean => {
    if (!value.trim()) {
      setUserNameError('Required username');
      return false;
    }
    setUserNameError('');
    return true;
  };

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Required email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Required password');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setConfirmPasswordError('Required confirm password');
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isFullNameValid = validateFullName(fullName);
    const isUserNameValid = validateUserName(userName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isFullNameValid || !isUserNameValid || !isEmailValid || 
        !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      const response = await register(fullName, userName, email, password, confirmPassword);
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.');
      setError(null);
      navigate('/login');
    } catch (err) {
      setError('Đăng ký không thành công. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Login Content */}
      <div className="flex-1 flex">
        {/* Left Side - Green Background with Logo */}
        <div className="w-1/2 bg-green-500 flex flex-col items-center justify-center text-white p-12">
          <div className="w-48 h-48 mb-5">
            <img src={logo} alt="UNI VISION BOT Logo" className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-2xl font-semibold text-center text-black mb-4">UNI VISION BOT</h1>
          <p className="text-center text-lg">
            "Chọn đúng trường, hướng đúng nghề – <br />
            Bước tới tương lai cùng hệ thống tư vấn <br />
            tuyển sinh trực tuyến!"
          </p>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-1/2 bg-white p-8 mt-8">
          <h2 className="text-3xl font-bold mb-6">Tạo tài khoản</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fullNameError ? 'border-red-500' : ''}`}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  validateFullName(e.target.value);
                }}
                onBlur={() => validateFullName(fullName)}
              />
              {fullNameError && <p className="text-red-500 text-sm">{fullNameError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tên người dùng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên người dùng"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${userNameError ? 'border-red-500' : ''}`}
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  validateUserName(e.target.value);
                }}
                onBlur={() => validateUserName(userName)}
              />
              {userNameError && <p className="text-red-500 text-sm">{userNameError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Địa chỉ Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${emailError ? 'border-red-500' : ''}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${passwordError ? 'border-red-500' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nhập lại mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${confirmPasswordError ? 'border-red-500' : ''}`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
              />
              {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 leading-tight" />
                <span className="text-gray-700 text-sm">Nhớ mật khẩu</span>
              </label>
            </div>

            <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
              Tạo tài khoản
            </button>

            <p className="mt-4 text-center text-sm">
              Bạn đã có tài khoản?{' '}
              <a href="/login" className="text-blue-500 font-bold">
                Đăng Nhập
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
