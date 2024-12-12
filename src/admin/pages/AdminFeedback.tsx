// AdminFeedback.tsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Feedback {
  id: string;
  userId: string;
  overallFeedback: string;
  fullname : string;
  rating: number;
  instance: {
    userInterface: number;
    functionality: number;
    performance: number;
    usefulness: number;
  };
  createdAt: string;
}

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFeedbacks();
  }, [page]);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`https://localhost:7230/api/Feedback?page=${page}`);
      const data = await response.json();
      setFeedbacks(data);
      setTotalPages(Math.ceil(data.totalCount / 10));
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý phản hồi</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phản hồi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.fullname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.rating}/5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.overallFeedback.substring(0, 50)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(feedback.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => setSelectedFeedback(feedback)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Feedback Detail Modal */}
          {selectedFeedback && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Chi tiết phản hồi</h2>
                <div className="space-y-4">
                  <p><strong>ID Người dùng:</strong> {selectedFeedback.userId}</p>
                  <p><strong>Người dùng:</strong> {selectedFeedback.fullname}</p>
                  <p><strong>Đánh giá chung:</strong> {selectedFeedback.rating}/5</p>
                  <p><strong>Phản hồi:</strong> {selectedFeedback.overallFeedback}</p>
                  <div className="space-y-2">
                    <p><strong>Chi tiết đánh giá:</strong></p>
                    <p>Giao diện: {selectedFeedback.instance.userInterface}/5</p>
                    <p>Chức năng: {selectedFeedback.instance.functionality}/5</p>
                    <p>Hiệu suất: {selectedFeedback.instance.performance}/5</p>
                    <p>Hữu ích: {selectedFeedback.instance.usefulness}/5</p>
                  </div>
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminFeedback;