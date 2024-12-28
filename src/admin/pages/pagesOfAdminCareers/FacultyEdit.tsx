import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FacultyEdit: React.FC = () => {
  const { universityId, facultyId } = useParams<{ universityId: string; facultyId: string }>();
  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle form submission
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Kiểm tra nếu tên khoa trống
    if (!facultyName.trim()) {
      setError('Tên khoa không được để trống.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(
        `https://localhost:7230/api/universities/${universityId}/faculties/${facultyId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: facultyName }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Cập nhật khoa thất bại');
      }
  
      setSuccessMessage('Faculty name updated successfully.');
      setFacultyName(''); // Reset lại tên khoa sau khi lưu thành công
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật khoa');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa Khoa</h2>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Thông báo thành công */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <form onSubmit={handleSave}>
      <div className="mb-4">
        <label htmlFor="facultyName" className="block mb-2 font-bold">
          Tên Khoa
        </label>
        <input
          id="facultyName"
          type="text"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
          className={`w-full px-3 py-2 border rounded ${error ? 'border-red-500' : ''}`}
          placeholder="Nhập tên khoa"
        />
      </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/careers/university/${universityId}`)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyEdit;