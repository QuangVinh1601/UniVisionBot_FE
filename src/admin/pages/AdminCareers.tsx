import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface University {
  id: number;
  name: string;
  universityCode: string;
  location: string;
}

const AdminCareers: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const navigate = useNavigate();

  const fetchUniversities = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://localhost:7230/api/University?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách trường đại học');
      }

      const data: University[] = await response.json();
      setUniversities(data);
      const pageSize = 5;
      setHasNextPage(data.length === pageSize);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (hasNextPage) setCurrentPage((prev) => prev + 1);
  };

  const handleUniversityClick = (id: number) => {
    // Điều hướng đến trang chi tiết trường
    navigate(`/admin/careers/university/${id}`);
  };

  const handleAdd = () => {
    // console.log('đang tới trang add');
    navigate('/admin/careers/add');
  };

  const handleEdit = (id: number) => {
    // Điều hướng đến trang chỉnh sửa
    navigate(`/admin/careers/edit/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trường này?')) {
      try {
        const response = await fetch(`https://localhost:7230/api/University/id?id=${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Không thể xóa trường đại học này');
        }
  
        // Cập nhật danh sách sau khi xóa
        setUniversities((prev) => prev.filter((uni) => uni.id !== id));
        alert('Xóa trường đại học thành công');
      } catch (err: any) {
        alert(err.message || 'Đã xảy ra lỗi');
      }
    }
  };  

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h1 className="text-lg font-bold mb-4">Danh sách trường đại học</h1>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border p-2 text-left">STT</th>
                <th className="border p-2 text-left">Tên Trường</th>
                <th className="border p-2 text-left">Mã Trường</th>
                <th className="border p-2 text-left">Địa Điểm</th>
                <th className="border p-2 text-left w-40">Action</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((university, index) => (
                <tr key={university.id}>
                  <td className="border p-2">{(currentPage - 1) * 5 + index + 1}</td>
                  <td
                    className="border p-2 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleUniversityClick(university.id)}
                  >
                    {university.name}
                  </td>
                  <td className="border p-2">{university.universityCode}</td>
                  <td className="border p-2">{university.location}</td>
                  <td className="border">
                    {/* Thêm 2 nút Edit và Delete */}
                    <button
                      onClick={() => handleEdit(university.id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded mx-2 hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(university.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'
                }`}
              >
                Trang trước
              </button>
              <span>{currentPage}</span>
              <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className={`px-4 py-2 rounded ${
                  !hasNextPage ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'
                }`}
              >
                Trang sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCareers;
