import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FacultyAdd: React.FC = () => {
  const [facultyName, setFacultyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { universityId } = useParams<{ universityId: string }>(); // Lấy universityId từ URL
  const handleSave = async () => {
    if (!facultyName.trim()) {
      setError('Tên Khoa không được để trống');
      return;
    }

    if (!universityId) {
      setError('Không tìm thấy ID trường. Vui lòng kiểm tra lại.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://localhost:7230/api/universities/${universityId}/faculties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: facultyName }),
      });

      if (!response.ok) {
        throw new Error('Không thể thêm Khoa');
      }
      setSuccessMessage('Faculty added successfully.'); // Hiển thị thông báo thành công
      setFacultyName(''); // Reset lại tên khoa sau khi lưu thành công
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/admin/careers/university/${universityId}`); // Quay lại trang trước
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h1 className="text-lg font-bold mb-4">Thêm Khoa Mới</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Thông báo thành công */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="facultyName">
          Tên Khoa
        </label>
        <input
          type="text"
          id="facultyName"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Nhập tên Khoa"
        />
      </div>

      <div className="flex justify-start gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-4 py-2 text-white rounded ${
            loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default FacultyAdd;
