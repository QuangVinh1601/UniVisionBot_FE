import React, { useState } from 'react';
import logo from '../images/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('Required email');
      return false;
    }

    // Check if first character is uppercase
    if (email[0] === email[0].toUpperCase()) {
      setEmailError('Invalid format');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid format');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Required password');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    try {
      const response = await login(email, password);
      if(!response.success){
        setPasswordError("Incorrect password");
      }
      const token = response.token;
      
      const role = response.roleUser; // Get role directly from response

    
      // Debug log to check response structure
      console.log('Full response:', response);
      const UserId = response.userId;


      // Debug log before storing
      console.log('Values to store:', {
        token,
        role,
        UserId
      });

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('UserId', UserId);
      localStorage.setItem('fullName', response.fullName);


      // Verify storage immediately after setting
      console.log('Stored values:', {
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        userId: localStorage.getItem('UserId')
      });

      // Redirect user based on role
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'CONSULTANT') {
        navigate('/consultant-chat',{ state: { UserId } });
      } else if (role === 'USER' ) {
        navigate('/',{ state: { UserId } });
      } else {
        // Handle unknown role more gracefully
        console.error('Unknown role:', role);
        setError('An error occurred during login.');
      }
    } catch (error: any) {
      // Provide a more user-friendly error message if possible
      setError(error.message || 'Login unsuccessful. Please try again.');
    }
    e.preventDefault();
    setError(null); // Clear any previous errors
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

        {/* Right Side - Login Form */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-8">Đăng Nhập</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    emailError ? 'border-red-500' : ''
                  }`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type='password'
                  placeholder="Nhập mật khẩu"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    passwordError ? 'border-red-500' : ''
                  }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <button type="submit" className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors">
                Đăng nhập
              </button>

              <div className="text-center">
                <Link to="/forgot-password" className="text-blue-500 hover:underline">
                  Quên Mật Khẩu
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
