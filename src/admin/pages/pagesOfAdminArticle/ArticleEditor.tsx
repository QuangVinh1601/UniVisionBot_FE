import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

const EditArticle: React.FC = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<any>({
    title: "",
    author: "",
    content: "",
    imageFile: null,
    imageUrl: "",
    publicId: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bài viết từ API khi component được load
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://localhost:7230/api/Article/${id}`);
        const data = response.data;

        // Trích xuất imageUrl từ urlImage object
        const imageUrl = data.urlImage ? Object.values(data.urlImage)[0] : "";

        setFormData({
          title: data.title || "",
          author: data.author || "",
          content: data.content || "",
          imageUrl: imageUrl || "",
          publicId: Object.keys(data.urlImage || {})[0] || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải bài viết.");
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Xử lý khi nhấn nút Lưu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Tạo FormData để gửi dữ liệu
    const dataToSend = new FormData();
    dataToSend.append("Title", formData.title || "");
    dataToSend.append("Author", formData.author || "");
    dataToSend.append("Content", formData.content || "");
    
    // Nếu người dùng không chọn ảnh mới, gửi PublicId thay vì ImageFile
    if (formData.imageFile) {
      dataToSend.append("ImageFile", formData.imageFile);
    } else {
      dataToSend.append("PublicId", formData.publicId); // Gửi thông tin PublicId để giữ ảnh cũ
    }
  
    try {
      const response = await axios.put(`https://localhost:7230/api/Article/${id}`, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Bài viết đã được chỉnh sửa thành công!", response.data);
      alert("Bài viết đã được chỉnh sửa thành công!");
    } catch (err: any) {
      console.error("Có lỗi xảy ra:", err.response?.data);
      alert("Không thể chỉnh sửa bài viết. Vui lòng kiểm tra lại thông tin.");
    }
  };

  // Xử lý khi chỉnh sửa một trường
  const handleChange = (field: string, value: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Tiêu đề</h2>
          <Editor
            apiKey="qtng98b7gdl3y5notdw50gnwtrrpjazmqeojga1dq6w76tce"
            value={formData.title}
            init={{
              height: 200,
              menubar: false,
              plugins: [],
              toolbar: 'undo redo | bold italic',
              content_style: 'body { font-family:Arial, sans-serif; font-size:14px; line-height:1.6 }',
              entity_encoding: 'raw',
            }}
            onEditorChange={(content) => handleChange("title", content)}
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Tác giả</h2>
          <Editor
            apiKey="qtng98b7gdl3y5notdw50gnwtrrpjazmqeojga1dq6w76tce"
            value={formData.author}
            init={{
              height: 200,
              menubar: false,
              plugins: [],
              toolbar: 'undo redo | bold italic',
              content_style: 'body { font-family:Arial, sans-serif; font-size:14px; line-height:1.6 }',
              entity_encoding: 'raw',
            }}
            onEditorChange={(content) => handleChange("author", content)}
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Nội dung</h2>
          <Editor
            apiKey="qtng98b7gdl3y5notdw50gnwtrrpjazmqeojga1dq6w76tce"
            value={formData.content}
            init={{
              height: 300,
              menubar: false,
              plugins: ['lists', 'link', 'image', 'table', 'emoticons', 'code'],
              toolbar: 'undo redo | bold italic | link image | alignleft aligncenter alignright | numlist bullist | code',
              content_style: 'body { font-family:Arial, sans-serif; font-size:14px; line-height:1.6 }',
              entity_encoding: 'raw',
            }}
            onEditorChange={(content) => handleChange("content", content)}
          />
        </div>

        <div>
          <label className="block mt-4">Hình ảnh hiện tại</label>
          <img
            src={formData.imageUrl}
            alt="Hình ảnh bài viết"
            className="w-40 h-40 object-cover border border-gray-300 mt-2"
          />
          <label className="block mt-4">Chọn ảnh mới</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("imageFile", e.target.files?.[0])}
            className="mt-2"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Lưu
        </button>
      </form>
    </div>
  );
};

export default EditArticle;
