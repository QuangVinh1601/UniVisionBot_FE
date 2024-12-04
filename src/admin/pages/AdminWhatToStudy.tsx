import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const AdminWhatToStudy: React.FC = () => {
  const [articles, setArticles] = useState([
    { id: 1, title: "Một số lưu ý khi chọn nghề", date: "10/16/2024", views: 50, author: "Trung", content: "Học nghề có nhiều giá trị", selected: false },
    { id: 2, title: "Khóa Trung cấp chính quy công nghệ ô tô", date: "10/16/2024", views: 50, author: "Vinh", content: "Khóa học này cung cấp kiến thức chuyên sâu về công nghệ ô tô.", selected: false },
  ]);

  const [newArticle, setNewArticle] = useState({ title: '', date: '', views: 0, author: '', content: '' });

  const [isArticle, setIsArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const handleSelectArticle = (id: number) => {
    setArticles(articles.map((article) => (article.id === id ? { ...article, selected: !article.selected } : article)));
  };

  const handleArticleClick = (id: number) => {
    const article = articles.find((article) => article.id === id);
    if (article) {
      setIsArticle(true);
      setSelectedArticle(article);
    }
  };

  const handleAddArticle = () => {
    if (newArticle.title && newArticle.date && newArticle.author && newArticle.content) {
      const newId = articles.length ? Math.max(...articles.map((article) => article.id)) + 1 : 1;
      setArticles([...articles, { id: newId, ...newArticle, selected: false }]);
      setNewArticle({ title: '', date: '', views: 0, author: '', content: '' });
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleDeleteSelected = () => {
    const updatedArticles = articles.filter((article) => !article.selected);
    setArticles(updatedArticles);
  };

  const handleCancel = () => {
    setIsArticle(false);
    setSelectedArticle(null);
    setNewArticle({ title: '', date: '', views: 0, author: '', content: '' });
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      {!isArticle && (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              className="border p-1 mr-2"
            />
            <input
              type="date"
              value={newArticle.date}
              onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
              className="border p-1 mr-2"
            />
            <input
              type="number"
              placeholder="Views"
              value={newArticle.views}
              onChange={(e) => setNewArticle({ ...newArticle, views: Number(e.target.value) })}
              className="border p-1 mr-2"
            />
            <input
              type="text"
              placeholder="Author"
              value={newArticle.author}
              onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
              className="border p-1 mr-2"
            />
            <button onClick={handleAddArticle} className="p-1 bg-blue-500 text-white rounded">
              <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add
            </button>
          </div>
          <table className="min-w-full mt-4 border">
            <thead>
              <tr>
                <th className="border p-2 text-left">CHỌN</th>
                <th className="border p-2 text-left">TITLE</th>
                <th className="border p-2 text-left">DATE</th>
                <th className="border p-2 text-left">VIEW</th>
                <th className="border p-2 text-left">AUTHOR</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="border p-2">
                    <input
                      type="checkbox"
                      checked={article.selected}
                      onChange={() => handleSelectArticle(article.id)}
                    />
                  </td>
                  <td className="border p-2" onDoubleClick={() => handleArticleClick(article.id)}>
                    {article.title}
                  </td>
                  <td className="border p-2">{article.date}</td>
                  <td className="border p-2">{article.views}</td>
                  <td className="border p-2">{article.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDeleteSelected} className="mt-4 p-2 bg-red-500 text-white rounded">
            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete Selected
          </button>
        </>
      )}
      {isArticle && selectedArticle && (
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Title</h2>
            <textarea className="border p-1 w-full" value={selectedArticle.title} readOnly />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Nội dung</h2>
            <textarea className="border p-1 w-full" value={selectedArticle.content} readOnly />
          </div>
          <div className="mt-4">
            <button className="mr-2 p-2 bg-green-500 text-white rounded">Save</button>
            <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWhatToStudy;
