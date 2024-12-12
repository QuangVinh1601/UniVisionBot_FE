import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddMajor: React.FC = () => {
  const { universityId, facultyId } = useParams<{ universityId: string; facultyId: string }>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "",
    duration: 0,
    majorCode: "",
    subjectCombinations: "",
    entryScoreExam: "",
    entryScoreRecord: "",
    tuitionFee: 0,
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

  // Parse subject combinations và entry scores
const parsedSubjectCombinations = formData.subjectCombinations
.split(",")
.map((item) => item.trim());

// Chuyển key thành số nguyên (int) và giữ giá trị là chuỗi (string)
const parsedEntryScoreExam = Object.fromEntries(
formData.entryScoreExam
  .split(",")
  .map((item) => {
    const [key, value] = item.split(":").map((val) => val.trim());
    return [parseInt(key, 10), value]; // Key là số nguyên, Value là chuỗi
  })
);

const parsedEntryScoreRecord = Object.fromEntries(
formData.entryScoreRecord
  .split(",")
  .map((item) => {
    const [key, value] = item.split(":").map((val) => val.trim());
    return [parseInt(key, 10), value]; // Key là số nguyên, Value là chuỗi
  })
);

  try {
    const response = await fetch(
      `https://localhost:7230/api/faculties/${facultyId}/major`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId,
          name: formData.name,
          description: formData.description || "",
          level: formData.level,
          duration: formData.duration,
          majorCode: formData.majorCode,
          subjectCombinations: parsedSubjectCombinations,
          entryScoreExam: parsedEntryScoreExam, // Gửi dưới dạng Dictionary<string, string>
          entryScoreRecord: parsedEntryScoreRecord, // Gửi dưới dạng Dictionary<string, string>
          tuitionFee: formData.tuitionFee,
          notes: formData.notes || "",
        }),
      }
    );

      if (!response.ok) {
        throw new Error("Thêm ngành thất bại. Vui lòng kiểm tra thông tin.");
      }

      navigate(`/admin/careers/university/${universityId}/faculties/${facultyId}/majors`);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi trong quá trình thêm ngành.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Thêm Ngành Mới</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold mb-2">Tên ngành:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Cấp độ:</label>
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Thời lượng (năm):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Mã ngành:</label>
          <input
            type="text"
            name="majorCode"
            value={formData.majorCode}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Tổ hợp môn:</label>
          <input
            type="text"
            name="subjectCombinations"
            value={formData.subjectCombinations}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="C00, D01, A00"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Điểm Chuẩn (Exam):</label>
          <input
            type="text"
            name="entryScoreExam"
            value={formData.entryScoreExam}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="2024:18, 2023:20"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Điểm Chuẩn (Record):</label>
          <input
            type="text"
            name="entryScoreRecord"
            value={formData.entryScoreRecord}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="2024:16, 2023:19"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Học phí:</label>
          <input
            type="number"
            name="tuitionFee"
            value={formData.tuitionFee}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Ghi chú:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Ghi chú (nếu có)"
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thêm Ngành"}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMajor;