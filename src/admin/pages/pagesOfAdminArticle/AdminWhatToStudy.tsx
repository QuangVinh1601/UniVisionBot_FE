import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Article {
  id: string; 
  title: string;
  author: string;
  content: string;
  urlImage: string;
  publicId: string;
}

const AdminWhatToStudy: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch danh sách bài viết khi component được mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("https://localhost:7230/api/Article");
        setArticles(response.data);
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

  // Hàm chuyển hướng tới trang Add
  const handleAddClick = () => {
    navigate("add");
  };

  const handleDelete = async (id: string, publicId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?");
    if (!confirmDelete) return;
  
    try {
      const encodedPublicId = encodeURIComponent(publicId);
      const url = `https://localhost:7230/api/Article/${id}/${encodedPublicId}`;
      console.log("URL:", url); // Debug xem URL có đúng không
      await axios.delete(url);
  
      // Cập nhật lại danh sách bài viết sau khi xóa
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== id)
      );
  
      alert("Xóa bài viết thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      alert("Có lỗi xảy ra khi xóa bài viết!");
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
            {articles.map((article, index) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td
                  className="border border-gray-300 px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                  onClick={() => handleTitleClick(article.id)}
                >
                  {article.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">{article.author}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded mr-2"
                    onClick={() => handleTitleClick(article.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                    onClick={() => handleDelete(article.id, article.publicId)}
                  >
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
          <button className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-3 rounded mr-2">
            Trang trước
          </button>
          <span className="font-bold">1</span>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded ml-2">
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWhatToStudy;
