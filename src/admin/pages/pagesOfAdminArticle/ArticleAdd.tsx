import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const ArticleAdd: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "", 
    imageFile: null as File | null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cập nhật giá trị từ TinyMCE vào state
  const handleEditorChange = (content: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: content, // Cập nhật nội dung bài viết
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Kiểm tra nếu các trường bắt buộc không được điền và không hợp lệ
    if (!formData.title || !formData.content || !formData.author) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      setLoading(false);
      return;
    }
  
    if (formData.author.length < 3 || formData.author.length > 100) {
      setError("Tên tác giả phải từ 3 đến 100 ký tự.");
      setLoading(false);
      return;
    }
  
    if (formData.title.length < 5 || formData.title.length > 100){
      setError("Tiêu đề phải từ 5 đến 100 ký tự.");
      setLoading(false);
      return;
    }
    if (formData.content.length < 50) {
      setError("Nội dung phải có ít nhất 50 ký tự.");
      setLoading(false);
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("Content", formData.content);
      formDataToSend.append("Author", formData.author);
  
      // Đảm bảo trường ImageFile nhận đúng dữ liệu nhị phân
      if (formData.imageFile) {
        formDataToSend.append("ImageFile", formData.imageFile); // Dữ liệu ảnh dạng file
      }
  
      const response = await axios.post("https://localhost:7230/api/Article", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log(response); // Kiểm tra phản hồi từ API
      alert("Bài viết đã được thêm thành công!");
      navigate("/admin/what-to-study");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra khi thêm bài viết.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý khi nhấn nút Quay lại
  const handleBack = () => {
    const isConfirmed = window.confirm('Bạn có chắc muốn quay lại? Các thay đổi sẽ không được lưu!');
    if (isConfirmed) {
      navigate('/admin/what-to-study');
    }
  };

  // Xử lý thay đổi trong các trường nhập liệu
  const handleChange = (field: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold font-roboto">Thêm bài viết mới</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <br />
      <form onSubmit={handleSubmit}>
        <div className="mb-4 font-roboto">
          <label className="text-xl font-bold mb-2">Tiêu đề</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4 font-roboto">
          <label className="text-xl font-bold mb-2">Tác giả</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleChange("author", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 font-roboto">Nội dung</h2>
          <Editor
            apiKey="qtng98b7gdl3y5notdw50gnwtrrpjazmqeojga1dq6w76tce"
            value={formData.content}
            init={{
              height: 600,
              menubar: false,
              plugins: ['lists', 'link', 'image', 'table', 'emoticons', 'code'],
              toolbar: 'undo redo | bold italic | link image | alignleft aligncenter alignright | numlist bullist | code',
              content_style: 'body { font-family:Roboto, sans-serif; font-size:16px; line-height:1.8 }',
              entity_encoding: 'raw',
            }}
            onEditorChange={handleEditorChange}  // Cập nhật giá trị khi thay đổi nội dung
          />
        </div>
        <label className="block mt-4 font-roboto">Chọn ảnh mới (không bắt buộc)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("imageFile", e.target.files?.[0])}
            className="mt-2 font-roboto"
          />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white font-bold py-2 px-4 rounded`}
          >
            {loading ? "Đang thêm..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Quay lại
          </button>
        </div>
      </form>
     
    </div>
    
  );
};

export default ArticleAdd;
