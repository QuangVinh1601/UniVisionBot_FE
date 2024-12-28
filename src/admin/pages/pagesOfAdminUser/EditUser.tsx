import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  roleUser: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const MAX_LENGTH = 255;
  const [details, setDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    userName: '',
    fullName: '',
    email: ''
  });

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://localhost:7230/api/User/${id}`);
      setDetails(response.data);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (details) {
      const { name, value } = e.target;
      setDetails({
        ...details,
        [name]: value,
      });
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      userName: '',
      fullName: '',
      email: ''
    };
    
    if (!details?.userName.trim()) {
      errors.userName = 'Required username';
    } else if (details.userName.length > MAX_LENGTH) {
      errors.userName = `Username cannot exceed ${MAX_LENGTH} characters`;
    }
    
    // Fullname validation
    if (!details?.fullName.trim()) {
      errors.fullName = 'Required fullname';
    } else if (details.fullName.length > MAX_LENGTH) {
      errors.fullName = `Fullname cannot exceed ${MAX_LENGTH} characters`;
    }
    
    // Email validation
    if (!details?.email.trim()) {
      errors.email = 'Required email';
    } else if (details.email.length > MAX_LENGTH) {
      errors.email = `Email cannot exceed ${MAX_LENGTH} characters`;
    }
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };
  

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await axios.put(`https://localhost:7230/api/User/${id}`, details);
      alert('Thông tin đã được cập nhật thành công!');
      navigate('/admin/account');
    } catch (err: any) {
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        
        const newValidationErrors = {
          userName: '',
          fullName: '',
          email: ''
        };

        if (errorData.includes('Username already exists')) {
          newValidationErrors.userName = 'existed username';
        }
        if (errorData.includes('Email already exists')) {
          newValidationErrors.email = 'existed email';
        }

        setValidationErrors(newValidationErrors);
      } else {
        setError('Đã xảy ra lỗi khi lưu dữ liệu');
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && details && (
        <form onSubmit={handleSave} className="relative">
          <h1 className="text-xl font-bold mb-4">Chỉnh sửa thông tin người dùng</h1>

          <label className="block mb-2 font-semibold">Username</label>
          <input
            type="text"
            name="userName"
            value={details.userName}
            onChange={handleInputChange}
            className={`w-full mb-1 p-2 border rounded ${validationErrors.userName ? 'border-red-500' : ''}`}
          />
          {validationErrors.userName && (
            <p className="text-red-500 text-sm mb-4">{validationErrors.userName}</p>
          )}

          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={details.email}
            onChange={handleInputChange}
            className={`w-full mb-1 p-2 border rounded ${validationErrors.email ? 'border-red-500' : ''}`}
          />
           {validationErrors.email && (
            <p className="text-red-500 text-sm mb-4">{validationErrors.email}</p>
          )}

          <label className="block mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={details.fullName}
            onChange={handleInputChange}
            className={`w-full mb-1 p-2 border rounded ${validationErrors.fullName ? 'border-red-500' : ''}`}
          />
          {validationErrors.fullName && (
            <p className="text-red-500 text-sm mb-4">{validationErrors.fullName}</p>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 mt-4 rounded ${
                saving
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-700'
              }`}
            >
              {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/account')}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Quay lại
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditUser;