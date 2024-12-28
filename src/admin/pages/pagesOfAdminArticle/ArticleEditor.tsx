import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const navigate = useNavigate();

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

    try {
      let response;
      
      if (formData.imageFile) {
        // If new image selected, use multipart/form-data
        const dataWithImage = new FormData();
        dataWithImage.append("Title", formData.title || "");
        dataWithImage.append("Author", formData.author || "");
        dataWithImage.append("Content", formData.content || "");
        dataWithImage.append("ImageFile", formData.imageFile);
        dataWithImage.append("PublicId", formData.publicId);
        response = await axios.put(
          `https://localhost:7230/api/Article/${id}`,
          dataWithImage,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
      } else {
        // If no new image, use JSON with existing PublicId
        const dataWithoutImage = {
          title: formData.title,
          author: formData.author,
          content: formData.content,
          publicId: formData.publicId
        };

        response = await axios.put(
          `https://localhost:7230/api/Article/${id}/update-without-image`,
          dataWithoutImage,
          {
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      console.log("Bài viết đã được chỉnh sửa thành công!", response.data);
      alert("Bài viết đã được chỉnh sửa thành công!");
      setIsSaved(true);
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

  // Xử lý khi nhấn nút Quay lại
  const handleBack = () => {
    if (isSaved) {
      const isConfirmed = window.confirm('Bạn có chắc muốn thoát không?');
      if (isConfirmed) {
        navigate('/admin/what-to-study');
      }
    } else {
      const isConfirmed = window.confirm('Bạn có chắc muốn quay lại? Các thay đổi sẽ không được lưu!');
      if (isConfirmed) {
        navigate('/admin/what-to-study');
      }
    }
  };

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold font-roboto">Chỉnh sửa bài viết</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="mb-4 font-roboto">
          <h2 className="text-xl font-bold mb-2">Tiêu đề</h2>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4 font-roboto">
          <h2 className="text-xl font-bold mb-2">Tác giả</h2>
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
              height: 300,
              menubar: false,
              plugins: ['lists', 'link', 'image', 'table', 'emoticons', 'code'],
              toolbar: 'undo redo | bold italic | link image | alignleft aligncenter alignright | numlist bullist | code',
              content_style: 'body { font-family:Roboto, sans-serif; font-size:16px; line-height:1.8 }',
              entity_encoding: 'raw',
            }}
            onEditorChange={(content) => handleChange("content", content)}
          />
        </div>

        <div>
          <label className="text-xl font-bold mb-2 font-roboto">Hình ảnh hiện tại</label>
          <img
            src={formData.imageUrl}
            alt="Hình ảnh bài viết"
            className="w-40 h-40 object-cover border border-gray-300 mt-2"
          />
          <label className="block mt-4 font-roboto">Chọn ảnh mới</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("imageFile", e.target.files?.[0])}
            className="mt-2 font-roboto"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Lưu
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

export default EditArticle;
