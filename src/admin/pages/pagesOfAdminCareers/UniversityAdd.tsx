import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UniversityAdd: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    universityCode: '',
    scholarshipsAvailable: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    name: '',
    universityCode: '',
  });

  const location = useLocation();
  const navigate = useNavigate();
  // Lấy danh sách universityCode từ state của location
  const universityCodes: string[] = location.state?.universityCodes || [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue =
      type === 'checkbox' && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setFormData({
      ...formData,
      [name]: fieldValue,
    });

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (error[name as keyof typeof error]) {
      setError((prevError) => ({
        ...prevError,
        [name]: '',
        longNameMessage: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra các trường bắt buộc
    const newError = {
      name: formData.name ? '' : 'Tên trường là bắt buộc.',
      universityCode: formData.universityCode ? '' : 'Mã trường là bắt buộc.',
    };

    // Kiểm tra độ dài của Tên trường
    if (formData.name.length > 255) {
      newError.name = 'Vượt quá giới hạn ký tự!';
    } else if (formData.name.length === 255) {
      newError.name = 'University added with the long name (or truncated gracefully if specified).';
    }

    if (newError.name || newError.universityCode) {
      setError(newError);
      setLoading(false);
      return;
    }

    // Kiểm tra trùng lặp mã trường
    if (universityCodes.includes(formData.universityCode)) {
      setError((prevError) => ({
        ...prevError,
        universityCode: 'Mã trường này đã tồn tại',
      }));
      setLoading(false); // Dừng loading nếu có lỗi
      return;
    } else {
      // Nếu mã trường không bị trùng, xóa thông báo lỗi (nếu có)
      setError((prevError) => ({
        ...prevError,
        universityCode: '',
      }));
    }

    try {
      const response = await fetch('https://localhost:7230/api/University', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error('POST request failed:', await response.text());
        throw new Error('Không thể thêm trường đại học mới');
      }

      const responseData = await response.json();
      console.log('POST request succeeded:', responseData);

      navigate('/admin/careers', { state: { successMessage: 'University added successfully' } });
    } catch (err: any) {
      console.error('POST Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h1 className="text-lg font-bold mb-4">Thêm mới trường đại học</h1>

      {loading && <p>Đang xử lý...</p>}

      <form onSubmit={handleSubmit}>
        {/* Tên trường */}
        <div className="mb-4">
          <label htmlFor="name" className="block font-bold mb-1">
            Tên trường: <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full border p-2 rounded ${error.name ? 'border-red-500' : ''}`}
          />
          {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
          {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
        </div>

        {/* Địa điểm */}
        <div className="mb-4">
          <label htmlFor="location" className="block font-bold mb-1">
            Địa điểm:
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Mô tả */}
        <div className="mb-4">
          <label htmlFor="description" className="block font-bold mb-1">
            Mô tả:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        {/* Mã trường */}
        <div className="mb-4">
          <label htmlFor="universityCode" className="block font-bold mb-1">
            Mã trường: <span className="text-red-500">*</span>
          </label>
          <input
            id="universityCode"
            name="universityCode"
            type="text"
            value={formData.universityCode}
            onChange={handleInputChange}
            className={`w-full border p-2 rounded ${error.universityCode ? 'border-red-500' : ''}`}
          />
          {error.universityCode && <p className="text-red-500 text-sm mt-1">{error.universityCode}</p>}
        </div>

        {/* Học bổng */}
        <div className="mb-4">
          <label htmlFor="scholarshipsAvailable" className="block font-bold mb-1">
            Học bổng:
          </label>
          <input
            id="scholarshipsAvailable"
            name="scholarshipsAvailable"
            type="checkbox"
            checked={formData.scholarshipsAvailable}
            onChange={handleInputChange}
            className="mr-2"
          />
          <span>Có học bổng</span>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            disabled={loading}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/careers')}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default UniversityAdd;
