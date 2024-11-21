import React, { useEffect, useState } from 'react';

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

  const fetchUniversities = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://localhost:7230/api/University?page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

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

  // const handleCheckboxChange = (id: number) => {
  //   setSelectedIds((prev) =>
  //     prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
  //   );
  // };  

  // const handleDelete = async () => {
  //   if (selectedIds.length === 0) {
  //     alert('Vui lòng chọn ít nhất một trường để xóa.');
  //     return;
  //   }

  //   try {
  //     for (const id of selectedIds) {
  //       const response = await fetch(`https://localhost:7230/api/University/${id}`, {
  //         method: 'DELETE',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Không thể xóa trường với ID: ${id}`);
  //       }
  //     }

  //     setUniversities((prev) => prev.filter((uni) => !selectedIds.includes(uni.id)));
  //     setSelectedIds([]);
  //     alert('Đã xóa thành công các trường được chọn.');
  //   } catch (error) {
  //     alert('Không thể xóa các trường đã chọn. Vui lòng thử lại.');
  //   }
  // };

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
              </tr>
            </thead>
            <tbody>
              {universities.map((university, index) => (
                <tr key={university.id}>
                  <td className="border p-2">
                    {(currentPage - 1) * 5 + index + 1}
                  </td>
                  <td className="border p-2">{university.name}</td>
                  <td className="border p-2">{university.universityCode}</td>
                  <td className="border p-2">{university.location}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4 items-center">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 "
              >
                Add
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
            
            <div className="flex gap-4 items-center">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
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
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-700'
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