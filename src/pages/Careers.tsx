import React, { useEffect, useState } from 'react';

interface ExamScore {
  title: string;
  universityName: string;
  universityCode: string;
  year: string;
}

interface MajorDetail {
  majorName: string;
  majorCode: string;
  subjectCombinations: string[];
  entryScoreExam: number;
  entryScoreRecord: number;
  notes?: string;
}

interface ExamDetail {
  title: string;
  universityCode: string;
  universityName: string;
  year: string;
  majors: MajorDetail[];
}

const Careers: React.FC = () => {
  const [examScores, setExamScores] = useState<ExamScore[]>([]);
  const [filteredScores, setFilteredScores] = useState<ExamScore[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ExamDetail | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentSchoolPage, setCurrentSchoolPage] = useState<number>(1);

  const rowsPerPage = 10; // Rows per page for exam scores (schools)
  const rowsPerPageSchools = 10; // Rows per page for detailed major info

  const years = ["2021", "2022", "2023", "2024"]; // Set fixed years here

  useEffect(() => {
    const fetchExamScores = async () => {
      try {
        const response = await fetch('https://localhost:7230/api/UniversityExamScore');
        if (!response.ok) throw new Error('Failed to fetch exam scores');
        const data: ExamScore[] = await response.json();
        setExamScores(data);
        setFilteredScores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      }
    };

    fetchExamScores();
  }, []);

  const removeDiacritics = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  const handleSearch = async () => {
    try {
      // Tạo body cho request
      const requestBody = {
        searchTerm: searchQuery.trim(), // searchQuery từ input
        year: selectedYear || "", // selectedYear từ dropdown, gửi chuỗi rỗng nếu không chọn năm
      };
  
      console.log("Sending request with body:", requestBody);
  
      // Thực hiện fetch API
      const response = await fetch("https://localhost:7230/api/UniversityExamScore/searching", {
        method: "POST", // Phương thức POST
        headers: {
          "Content-Type": "application/json", // Chỉ định kiểu dữ liệu gửi
        },
        body: JSON.stringify(requestBody), // Chuyển đổi body sang JSON
      });
  
      // Xử lý phản hồi
      if (!response.ok) throw new Error("Failed to fetch search results");
      const data: ExamScore[] = await response.json();
      setFilteredScores(data); // Cập nhật kết quả tìm kiếm
      setCurrentSchoolPage(1); // Đặt lại trang hiện tại về 1
      setError(null); // Xóa lỗi nếu có lỗi trước đó
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };  

  const fetchExamDetail = async (universityCode: string, year: string) => {
    try {
      const response = await fetch(`https://localhost:7230/api/UniversityExamScore/getscore?universityCode=${encodeURIComponent(universityCode)}&year=${year}`);
      if (!response.ok) throw new Error('Failed to fetch exam detail');
      const detailData: ExamDetail = await response.json();
      setDetail(detailData);
      setCurrentPage(1); // Reset to the first page after selecting a new school
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleSchoolPageChange = (page: number) => {
    setCurrentSchoolPage(page);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filtered and paginated data for schools (exam scores)
  const currentSchoolData = filteredScores.slice(
    (currentSchoolPage - 1) * rowsPerPageSchools,
    currentSchoolPage * rowsPerPageSchools
  );

  // Paginated data for the detailed majors
  const currentData = detail ? detail.majors.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : [];

  const totalPages = Math.ceil(filteredScores.length / rowsPerPageSchools);
  const totalPagesForMajors = detail ? Math.ceil(detail.majors.length / rowsPerPage) : 1;

  // Function to generate page numbers
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first three pages
      pageNumbers.push(1, 2, 3);

      // Add the last page
      pageNumbers.push(totalPages);

      // If the current page is close to the first pages, show more pages starting from the current page
      if (currentSchoolPage > 3 && currentSchoolPage < totalPages - 2) {
        pageNumbers.splice(3, 0, currentSchoolPage - 1, currentSchoolPage, currentSchoolPage + 1);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Tra cứu điểm chuẩn theo trường</h2>
        <div className="flex gap-2 mt-2">
          <input type="text" placeholder="Tên trường hoặc mã trường" className="border rounded px-3 py-1 flex-grow" value={searchQuery} onChange={handleSearchChange} />
          <select className="border rounded px-3 py-1" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Chọn năm</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button className="bg-orange-400 text-white px-4 py-1 rounded" onClick={handleSearch}>
            Tìm
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>} {/* Display error message */}
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-2">Kết quả</h3>
        <div className="space-y-2">
          {currentSchoolData.map(({ title, universityName, universityCode, year }) => (
            <div key={`${universityCode}-${year}`} className="text-blue-600 hover:underline cursor-pointer" onClick={() => fetchExamDetail(universityCode, year)}>
              {title}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSchoolPageChange(currentSchoolPage - 1)}
            disabled={currentSchoolPage === 1}
            className="px-3 py-1 mx-1 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Prev
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handleSchoolPageChange(page)}
              className={`px-3 py-1 mx-1 rounded ${currentSchoolPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handleSchoolPageChange(currentSchoolPage + 1)}
            disabled={currentSchoolPage === totalPages}
            className="px-3 py-1 mx-1 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-8">
      {detail && (
        <div className="mt-8 bg-gray-100 p-4 rounded">
          <h3 className="text-xl font-bold">{detail.title}</h3>
          <p>
            <strong>Trường:</strong> {detail.universityName}
          </p>
          <p>
            <strong>Mã trường:</strong> {detail.universityCode}
          </p>
          <p>
            <strong>Năm:</strong> {detail.year}
          </p>

          <h4 className="mt-4 font-semibold">Danh sách ngành:</h4>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Tên ngành</th>
                <th className="border border-gray-300 p-2">Mã ngành</th>
                <th className="border border-gray-300 p-2">Tổ hợp môn</th>
                <th className="border border-gray-300 p-2">Điểm thi</th>
                <th className="border border-gray-300 p-2">Điểm học bạ</th>
                <th className="border border-gray-300 p-2">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((major, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{major.majorName}</td>
                  <td className="border border-gray-300 p-2">{major.majorCode}</td>
                  <td className="border border-gray-300 p-2">{major.subjectCombinations.join(', ')}</td>
                  <td className="border border-gray-300 p-2">{major.entryScoreExam}</td>
                  <td className="border border-gray-300 p-2">{major.entryScoreRecord}</td>
                  <td className="border border-gray-300 p-2">{major.notes || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-300 text-black rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, totalPagesForMajors) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPagesForMajors}
                className="px-3 py-1 mx-1 bg-gray-300 text-black rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Careers;
