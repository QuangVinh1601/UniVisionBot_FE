import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditMajor: React.FC = () => {
  const { universityId, facultyId, majorId } = useParams<{ universityId: string; facultyId: string; majorId: string }>();
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    level: '',
    duration: '',
    majorCode: '',
    subjectCombinations: '',
    entryScoreExam: '',
    entryScoreRecord: '',
    tuitionFee: '',
    notes: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch data for the major from the API
  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7230/api/faculties/${facultyId}/major/${majorId}`
        );

        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu ngành');
        }

        const data = await response.json();

        // Ensure that the data is not null or undefined before setting state
        setFormValues({
          name: data?.name || '',
          description: data?.description || '',
          level: data?.level || '',
          duration: data?.duration || '',
          majorCode: data?.majorCode || '',
          subjectCombinations: data?.subjectCombinations?.join(', ') || '',
          entryScoreExam: data?.entryScoreExam
            ? JSON.stringify(data.entryScoreExam) // Convert object to string for input
            : '',
          entryScoreRecord: data?.entryScoreRecord
            ? JSON.stringify(data.entryScoreRecord) // Convert object to string for input
            : '',
          tuitionFee: data?.tuitionFee || '',
          notes: data?.notes || '',
        });
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi lấy dữ liệu ngành');
      }
    };

    fetchMajorData();
  }, [facultyId, majorId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!facultyId || !majorId) {
      setError('Dữ liệu không hợp lệ.');
      return;
    }

    try {
      const entryScoreExamObj = JSON.parse(formValues.entryScoreExam || '{}');
      const entryScoreRecordObj = JSON.parse(formValues.entryScoreRecord || '{}');

      const response = await fetch(
        `https://localhost:7230/api/faculties/${facultyId}/major/${majorId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formValues,
            duration: Number(formValues.duration),
            tuitionFee: Number(formValues.tuitionFee),
            subjectCombinations: formValues.subjectCombinations
              .split(',')
              .map((combination) => combination.trim()),
            entryScoreExam: entryScoreExamObj,  // Pass object directly
            entryScoreRecord: entryScoreRecordObj,  // Pass object directly
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Không thể cập nhật ngành');
      }

      alert('Ngành đã được cập nhật thành công.');
      navigate(`/admin/careers/university/${universityId}/faculties/${facultyId}/majors`);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật ngành.');
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa Ngành</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Tên ngành:</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Mô tả:</label>
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Cấp độ:</label>
          <input
            type="text"
            name="level"
            value={formValues.level}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Thời lượng (năm):</label>
          <input
            type="number"
            name="duration"
            value={formValues.duration}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Mã ngành:</label>
          <input
            type="text"
            name="majorCode"
            value={formValues.majorCode}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Tổ hợp môn (phân cách bằng dấu phẩy):</label>
          <input
            type="text"
            name="subjectCombinations"
            value={formValues.subjectCombinations}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Điểm Chuẩn (Exam):</label>
          <input
            type="text"
            name="entryScoreExam"
            value={formValues.entryScoreExam}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Điểm Chuẩn (Record):</label>
          <input
            type="text"
            name="entryScoreRecord"
            value={formValues.entryScoreRecord}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Học phí (VND):</label>
          <input
            type="number"
            name="tuitionFee"
            value={formValues.tuitionFee}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Ghi chú:</label>
          <textarea
            name="notes"
            value={formValues.notes}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Lưu
        </button>
        <button
          type="button"
          onClick={() => navigate(`/admin/careers/university/${universityId}/faculties/${facultyId}/majors`)}
          className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Hủy
        </button>
      </form>
    </div>
  );
};

export default EditMajor;