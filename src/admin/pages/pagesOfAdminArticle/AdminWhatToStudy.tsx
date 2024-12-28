import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Article {
  id: string; 
  title: string;
  author: string;
  content: string;
  urlImage?: string;
  publicId?: string;
}

const AdminWhatToStudy: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const articlesPerPage = 5; // Mỗi trang hiển thị 5 bài viết
  const navigate = useNavigate();

  // Fetch danh sách bài viết khi component được mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("https://localhost:7230/api/Article");
        if (response.data.length === 0) {
          setError("Không có bài viết nào.");
        } else {
          setArticles(response.data);
          // Tính toán số trang
          setTotalPages(Math.ceil(response.data.length / articlesPerPage));
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Hàm chuyển hướng tới trang Edit
  const handleTitleClick = (id: string) => {
    navigate(`edit/${id}`);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?');

      if (!isConfirmed) {
        return;
      }
      const article = articles.find(a => a.id === id);
      if (article) {
      // Get first key from dictionary
      let url = `https://localhost:7230/api/Article/${id}`;
      if (article.urlImage) {
        const publicId = Object.keys(article.urlImage)[0] || '';
        if (publicId) {
          const encodedPublicId = encodeURIComponent(publicId);
          url += `/${encodedPublicId}`;
        }
      }
      const response = await axios.delete(url);
      if(response.status == 200){
        setArticles(prev => prev.filter( a => a.id != id));
        alert('Xóa bài viết thành công!');
      }
      else {
        throw new Error('Xóa bài viết thất bại');
      }
      }
    }
    catch(error) {
      console.error('Error deleting article:', error);
      alert('Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại!');
    }
  }

  // Hàm chuyển hướng tới trang Add
  const handleAddClick = () => {
    navigate("add");
  };

  // Tính toán các bài viết hiển thị trên trang hiện tại
  const currentArticles = articles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);

  // Hàm chuyển sang trang trước
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      navigate(`?page=${currentPage - 1}`);
    }
  };

  // Hàm chuyển sang trang sau
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      navigate(`?page=${currentPage + 1}`);
    }
  };

  // Hàm chuyển sang trang đầu
  const handleFirstPage = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
      navigate(`?page=1`);
    }
  };

  // Hàm chuyển sang trang cuối
  const handleLastPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
      navigate(`?page=${totalPages}`);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h1 className="text-xl font-bold mb-4">Danh sách bài viết</h1>
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center">STT</th>
              <th className="border border-gray-300 px-4 py-2">Tiêu đề</th>
              <th className="border border-gray-300 px-4 py-2">Tác giả</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentArticles.map((article, index) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">{(currentPage - 1) * articlesPerPage + index + 1}</td>
                <td
                  className="border border-gray-300 px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                  onClick={() => handleTitleClick(article.id)}
                >
                  {article.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">{article.author}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                    onClick={() => handleTitleClick(article.id)}
                  >
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded ml-1" onClick={() => {handleDeleteClick(article.id)}}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
        <div className="flex items-center">
          <button 
            onClick={handleFirstPage} 
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-3 rounded mr-2"
            disabled={currentPage === 1}
            style={{ display: currentPage === 1 ? "none" : "inline-block"}}
          >
            Trang đầu
          </button>
          <button 
            onClick={handlePreviousPage} 
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-3 rounded mr-2"
            disabled={currentPage === 1}
            style={{ display: currentPage === 1 ? "none" : "inline-block"}}
          >
            Trang trước
          </button>
          <span className="font-bold">{currentPage}</span>
          <button 
            onClick={handleNextPage} 
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-3 rounded ml-2"
            disabled={currentPage === totalPages}
            style={{ display: currentPage === totalPages ? "none" : "inline-block"}}
          >
            Trang sau
          </button>
          <button 
            onClick={handleLastPage} 
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-3 rounded ml-2"
            disabled={currentPage === totalPages}
            style={{ display: currentPage === totalPages ? "none" : "inline-block"}}
          >
            Trang cuối
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWhatToStudy;
