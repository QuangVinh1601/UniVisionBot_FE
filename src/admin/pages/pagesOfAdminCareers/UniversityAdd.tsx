import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UniversityAdd: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    universityCode: '',
    scholarshipsAvailable: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' && e.target instanceof HTMLInputElement 
      ? e.target.checked 
      : value;
  
    setFormData({
      ...formData,
      [name]: fieldValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('Starting POST request with data:', formData);
  
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
  
      console.log('POST request succeeded:', await response.json());
      alert('Thêm trường đại học thành công');
      navigate(-1); // Quay lại trang trước
    } catch (err: any) {
      console.error('POST Error:', err.message);
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h1 className="text-lg font-bold mb-4">Thêm mới trường đại học</h1>

      {loading && <p>Đang xử lý...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Tên trường */}
        <div className="mb-4">
          <label htmlFor="name" className="block font-bold mb-1">
            Tên trường:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
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
            required
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
            required
          />
        </div>

        {/* Mã trường */}
        <div className="mb-4">
          <label htmlFor="universityCode" className="block font-bold mb-1">
            Mã trường:
          </label>
          <input
            id="universityCode"
            name="universityCode"
            type="text"
            value={formData.universityCode}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
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
        <div className='flex justify-between'>
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
