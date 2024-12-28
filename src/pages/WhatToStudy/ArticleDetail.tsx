import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  urlImage?: string;
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://localhost:7230/api/Article/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError('Không thể tải dữ liệu bài viết.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const articleContentStyles = `
    .article-content {
      /* Định dạng chung */
      font-family: inherit;
      line-height: 1.6;
      
      /* Định dạng cho các thẻ */
      strong { font-weight: bold; }
      em { font-style: italic; }
      u { text-decoration: underline; }
      h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
      h2 { font-size: 1.5em; font-weight: bold; margin: 0.83em 0; }
      h3 { font-size: 1.17em; font-weight: bold; margin: 1em 0; }
      ul { list-style-type: disc; padding-left: 2em; }
      ol { list-style-type: decimal; padding-left: 2em; }
      blockquote { 
        border-left: 4px solid #ddd;
        margin: 1em 0;
        padding-left: 1em;
      }
    }
  `;

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  if (!article) return <p>Bài viết không tồn tại.</p>;

  return (
    <div className="container mx-auto p-8 bg-white shadow-2xl rounded-lg overflow-hidden font-roboto">
        <style>{articleContentStyles}</style>
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">{article.title}</h1>
        <img
            src={article.urlImage ? Object.values(article.urlImage)[0] : 'https://via.placeholder.com/150'}
            alt={article.title}
            className="w-full h-80 object-cover mb-4 rounded-lg"
         />
        <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <br/>
        <p className="text-sm text-gray-700 mb-4 text-right">Tác giả: {article.author}</p>
        <button 
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => navigate(-1)}
        >
            Quay lại
        </button>
    </div>
  );
};

export default ArticleDetail