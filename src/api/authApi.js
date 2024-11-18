import axios from 'axios';
// Hàm đăng ký
export const register = async (fullName, userName, email, password, confirmPassword) => {
  try {
    const response = await axios.post(`https://localhost:7230/api/Login/register/user`, {
      fullName,
      userName,  
      email,
      password,
      confirmPassword
    });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.error("Error registering:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Hàm đăng nhập
export const login = async (email, password) => {
  try {
    const response = await axios.post(`https://localhost:7230/api/Login/login`, {
      email,
      password
    });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.error("Error logging in:", error.response ? error.response.data : error.message);
    throw error;
  }
};
