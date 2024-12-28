import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  urlImage?: string;
}

const WhatToStudy: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Thêm useNavigate để chuyển hướng

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://localhost:7230/api/Article');
        setArticles(response.data);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-8">
      {/* Articles section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
            <img
              src={article.urlImage ? Object.values(article.urlImage)[0] : 'https://via.placeholder.com/150'}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-gray-500 mb-2">Tác giả: {article.author}</p>
              <p className="text-gray-700 mb-4">
                {article.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
              </p>
              <button
                onClick={() => navigate(`/what-to-study/articleDetails/${article.id}`)} // Chuyển hướng khi click
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-green-500 hover:to-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mt-auto"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatToStudy;
