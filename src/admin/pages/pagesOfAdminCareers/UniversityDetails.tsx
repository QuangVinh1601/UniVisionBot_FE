import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Faculty {
  id: string;
  name: string;
}

const UniversityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Fetch faculties
  const fetchFaculties = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://localhost:7230/api/universities/${id}/faculties?page=${page}&size=5`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Không thể tải danh sách khoa');
      }

      const data: Faculty[] = await response.json();
      setFaculties(data);

      // Nếu dữ liệu trả về ít hơn 5 bản ghi thì không có trang kế tiếp
      setHasNextPage(data.length === 5);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Delete faculty
  const handleDeleteFaculty = async (facultyId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoa này?')) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://localhost:7230/api/universities/${id}/faculties/${facultyId}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!response.ok) {
          throw new Error('Xóa khoa thất bại');
        }

        // Xử lý sau khi xóa
        if (faculties.length === 1 && currentPage > 1) {
          // Nếu xóa xong danh sách trống và không phải trang đầu, quay lại trang trước
          const newPage = currentPage - 1;
          setCurrentPage(newPage);
          fetchFaculties(newPage);
          alert('Đã xóa thành công!');
        } else {
          // Tải lại danh sách khoa của trang hiện tại
          fetchFaculties(currentPage);
        }
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi xóa khoa');
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchFaculties(currentPage);
    }
  }, [id, currentPage]);

  const handleAdd = () => {
    console.log(id)
    // console.log('đang tới trang add');
    navigate('faculties/add');
  };

  // Handle page navigation
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

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Danh sách các Khoa</h2>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {faculties.length > 0 ? (
        <table className="min-w-full border mt-4">
          <thead>
            <tr>
              <th className="border p-2 text-left">STT</th>
              <th className="border p-2 text-left">Tên Khoa</th>
              <th className="border p-2 text-left w-40">Action</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty, index) => (
              <tr key={faculty.id}>
                <td className="border p-2">
                  {index + 1 + (currentPage - 1) * 5}
                </td>
                <td onClick={() => navigate(`faculties/${faculty.id}/majors`)}
                    className="border p-2 cursor-pointer text-blue-600 hover:underline"
                  >{faculty.name}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => navigate(`faculties/edit/${faculty.id}`)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded mx-2 hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFaculty(faculty.id)}
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
        onClick={() => navigate('/admin/careers')}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
      >
        Quay lại
      </button>
    </div>
  );
};

export default UniversityDetails;
