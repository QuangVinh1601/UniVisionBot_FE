import axios from 'axios';

const API_BASE_URL = 'https://localhost:7230/api/Login'; // Thay bằng URL API .NET của bạn

// Hàm đăng ký
export const register = async (fullName, userName, email, password, confirmPassword) => {
  try {
    const response = await axios.post('https://localhost:7230/api/Login/register/user', {
      fullName,
      userName,
      email,
      password,
      confirmPassword,
    });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.error('Error registering:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Hàm đăng nhập
export const login = async (email, password) => {
  try {
    const response = await axios.post('https://localhost:7230/api/Login/login', {
      email,
      password,
    });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Hàm gửi tin nhắn
export const sendMessage = async (message, chatId, chatCode) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/send_message', {
      message,
      chatId,
      chatCode,
    });
    console.log('Message sent:', response.data);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Hàm thêm cuộc trò chuyện đang chờ
export const addPendingConversation = async (status, user_Id, fullName) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/add_pending_conversation', {
      status,
      user_Id,
      fullName,
    });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.error('Error adding pending conversation:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Hàm thêm tin nhắn
export const addMessage = async (conversationId, message, sender, receiverId) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/add_message', {
      conversationId,
      message,
      sender,
      receiverId,
    });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.error('Error adding message:', error.response ? error.response.data : error.message);
    throw error;
  }
};
