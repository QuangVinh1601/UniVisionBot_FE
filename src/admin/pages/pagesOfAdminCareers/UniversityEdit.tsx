import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

interface UniversityDetails {
  id: number;
  name: string;
  universityCode: string;
  location: string;
  description: string;
  scholarshipsAvailable: boolean;
}

const UniversityEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorFields, setErrorFields] = useState<{ [key: string]: string }>({});
  const [initialUniversityCode, setInitialUniversityCode] = useState<string | null>(null); // Lưu mã trường ban đầu

  // Lấy danh sách các universityCode từ state truyền vào
  const universityCodes = location.state?.universityCodes || [];

  const fetchUniversityDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://localhost:7230/api/University/id?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải thông tin chi tiết trường');
      }

      const data = await response.json();
      setDetails(data);
      setInitialUniversityCode(data.universityCode); // Lưu lại mã trường ban đầu
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (details) {
      const { name, value, type } = e.target;

      setDetails({
        ...details,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });

      setErrorFields((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateFields = () => {
    const errors: { [key: string]: string } = {};

    if (!details?.name.trim()) {
      errors.name = 'Tên trường không được để trống';
    }

    if (!details?.universityCode.trim()) {
      errors.universityCode = 'Mã trường không được để trống';
    } else if (details.universityCode !== initialUniversityCode && universityCodes.includes(details.universityCode)) {
      // Kiểm tra trùng lặp chỉ khi mã trường thay đổi
      errors.universityCode = 'Mã trường này đã tồn tại';
    }

    setErrorFields(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!details) return;

    if (!validateFields()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`https://localhost:7230/api/University/id?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        throw new Error('Đã xảy ra lỗi khi lưu dữ liệu');
      }

      setSuccessMessage('University information updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUniversityDetails();
    }
  }, [id]);

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && details && (
        <form className="relative">
          <h1 className="text-xl font-bold mb-4">Chỉnh sửa thông tin trường</h1>

          {successMessage && (
            <p className="mb-4 text-green-500 font-semibold">{successMessage}</p>
          )}

          <label className="block mb-2 font-semibold">Tên Trường</label>
          <input
            type="text"
            name="name"
            value={details.name}
            onChange={handleInputChange}
            className={`w-full mb-2 p-2 border rounded ${errorFields.name ? 'border-red-500' : ''}`}
          />
          {errorFields.name && <p className="text-red-500 text-sm mb-4">{errorFields.name}</p>}

          <label className="block mb-2 font-semibold">Mã Trường</label>
          <input
            type="text"
            name="universityCode"
            value={details.universityCode}
            onChange={handleInputChange}
            className={`w-full mb-2 p-2 border rounded ${errorFields.universityCode ? 'border-red-500' : ''}`}
          />
          {errorFields.universityCode && <p className="text-red-500 text-sm mb-4">{errorFields.universityCode}</p>}

          <label className="block mb-2 font-semibold">Địa Điểm</label>
          <input
            type="text"
            name="location"
            value={details.location}
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border rounded"
          />

          <label className="block mb-2 font-semibold">Mô Tả</label>
          <textarea
            name="description"
            value={details.description}
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border rounded"
          />

          <label className="block mb-2 font-semibold">
            <input
              type="checkbox"
              name="scholarshipsAvailable"
              checked={details.scholarshipsAvailable}
              onChange={handleInputChange}
              className="mr-2"
            />
            Có Học Bổng
          </label>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 mt-4 rounded ${saving ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
            >
              {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>

            <button
              onClick={() => navigate('/admin/careers')}
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

export default UniversityEdit;
