import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Major {
  id: string;
  name: string;
  description: string;
  level: string;
  duration: number;
  majorCode: string;
  subjectCombinations: string[];
  entryScoreExam: Record<string, number>;
  entryScoreRecord: Record<string, number>;
  tuitionFee: number;
  notes: string;
}

const FacultyMajors: React.FC = () => {
  const { universityId, facultyId } = useParams<{ universityId: string; facultyId: string }>();
  const [majors, setMajors] = useState<Major[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const navigate = useNavigate();

  // Fetch majors data
  const fetchMajors = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://localhost:7230/api/faculties/${facultyId}/major?page=${page}&size=5`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Không thể tải danh sách ngành');
      }

      const data: Major[] = await response.json();
      setMajors(data);

      // Kiểm tra xem có trang tiếp theo hay không
      setHasNextPage(data.length === 5);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyId) {
      fetchMajors(currentPage);
    }
  }, [facultyId, currentPage]);

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleAdd = () => {
    // console.log('đang tới trang add');
    navigate('add');
  };

  // Placeholder functions for Edit and Delete
  const handleEdit = (majorId: string) => {
    navigate(`edit/${majorId}`);
  };

  const handleDelete = async (majorId: string) => {
    if (!facultyId) {
      setError("Không xác định được Faculty ID.");
      return;
    }
  
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa ngành này?");
    if (!confirmed) return;
  
    try {
      const response = await fetch(
        `https://localhost:7230/api/faculties/${facultyId}/major/${majorId}`,
        {
          method: 'DELETE',
        }
      );
  
      if (!response.ok) {
        throw new Error("Không thể xóa ngành. Vui lòng thử lại.");
      }
  
      // Xóa ngành khỏi danh sách
      setMajors((prevMajors) => prevMajors.filter((major) => major.id !== majorId));
      alert("Ngành đã được xóa thành công.");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi xóa ngành.");
    }
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Danh sách Ngành</h2>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {majors.length > 0 ? (
        <table className="min-w-full border mt-4">
          <thead>
            <tr>
              <th className="border p-2 text-left">STT</th>
              <th className="border p-2 text-left">Tên Ngành</th>
              <th className="border p-2 text-left">Cấp độ</th>
              <th className="border p-2 text-left">Thời lượng</th>
              <th className="border p-2 text-left">Mã Ngành</th>
              <th className="border p-2 text-left">Tổ hợp môn</th>
              <th className="border p-2 text-left">Điểm Chuẩn (Exam)</th>
              <th className="border p-2 text-left">Điểm Chuẩn (Record)</th>
              <th className="border p-2 text-left">Học phí</th>
              <th className="border p-2 text-left">Ghi chú</th>
              <th className="border p-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {majors.map((major, index) => (
              <tr key={major.id}>
                <td className="border p-2">{index + 1 + (currentPage - 1) * 5}</td>
                <td className="border p-2">{major.name}</td>
                <td className="border p-2">{major.level}</td>
                <td className="border p-2">{major.duration} năm</td>
                <td className="border p-2">{major.majorCode}</td>
                <td className="border p-2">
                  {major.subjectCombinations.join(', ')}
                </td>
                <td className="border p-2">
                  {Object.entries(major.entryScoreExam)
                    .map(([year, score]) => `${year}: ${score}`)
                    .join(', ')}
                </td>
                <td className="border p-2">
                  {Object.entries(major.entryScoreRecord)
                    .map(([year, score]) => `${year}: ${score}`)
                    .join(', ')}
                </td>
                <td className="border p-2">{major.tuitionFee} VND</td>
                <td className="border p-2">{major.notes || 'N/A'}</td>
                <td className="border p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(major.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(major.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có ngành nào</p>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4 items-center">
          <button onClick={handleAdd}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-700'
            }`}
          >
            Trang trước
          </button>
          <span>{currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded ${
              !hasNextPage
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-700'
            }`}
          >
            Trang sau
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate(`/admin/careers/university/${universityId}`)}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
      >
        Quay lại
      </button>
    </div>
  );
};

export default FacultyMajors;