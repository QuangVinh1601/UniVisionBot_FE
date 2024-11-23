import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Faculty {
  id: number;
  name: string;
}

interface UniversityDetails {
  id: number;
  name: string;
  universityCode: string;
  location: string;
  description: string;
  scholarshipsAvailable: boolean;
  faculties: Faculty[];
}

const UniversityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const navigate = useNavigate();
  const [details, setDetails] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversityDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Gọi API để lấy thông tin chi tiết của trường
      const universityResponse = await fetch(`https://localhost:7230/api/University/id?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!universityResponse.ok) {
        throw new Error('Không thể tải thông tin chi tiết trường');
      }

      const universityDetails = await universityResponse.json();

      // Gọi API để lấy danh sách ngành của trường
      const facultiesResponse = await fetch(`https://localhost:7230/api/universities/${id}/faculties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!facultiesResponse.ok) {
        throw new Error('Không thể tải danh sách ngành của trường');
      }

      const faculties = await facultiesResponse.json();

      // Lưu chi tiết trường và danh sách ngành vào state
      setDetails({ ...universityDetails, faculties });
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
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
            <>
            <h1 className="text-xl font-bold mb-4">Chi tiết trường: {details.name}</h1>
            <p><strong>Mã trường:</strong> {details.universityCode}</p>
            <p><strong>Địa điểm:</strong> {details.location}</p>
            <p><strong>Mô tả:</strong> {details.description}</p>
            <p>
                <strong>Học bổng:</strong> {details.scholarshipsAvailable ? 'Có' : 'Không'}
            </p>

            <h2 className="text-lg font-bold mt-4">Danh sách các Khoa:</h2>
            <ul className="list-disc pl-6">
                {details.faculties.length > 0 ? (
                details.faculties.map((faculty) => (
                    <li key={faculty.id}>
                    {faculty.name}
                    </li>
                ))
                ) : (
                <p>Không có ngành nào</p>
                )}
            </ul>
            </>
        )}
        <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
            Quay lại
      </button>
    </div>
  );
};

export default UniversityDetails;
