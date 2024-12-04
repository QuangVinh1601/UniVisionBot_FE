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
  const [years, setYears] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ExamDetail | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchExamScores = async () => {
      try {
        const response = await fetch('https://localhost:7230/api/UniversityExamScore');
        if (!response.ok) throw new Error('Failed to fetch exam scores');
        const data: ExamScore[] = await response.json();
        setExamScores(data);
        setFilteredScores(data);

        const extractedYears = Array.from(new Set(data.map((score) => score.year)));
        setYears(extractedYears);
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

    if (value === '') {
      setFilteredScores(examScores);
    } else {
      const normalizedQuery = removeDiacritics(value.toLowerCase().trim());
      const filtered = examScores.filter((score) => {
        const normalizedUniversityName = removeDiacritics(score.universityName.toLowerCase());
        const normalizedUniversityCode = score.universityCode.toLowerCase();
        return normalizedUniversityName.includes(normalizedQuery) || normalizedUniversityCode.includes(normalizedQuery);
      });
      setFilteredScores(filtered);
    }
  };

  const handleSearch = () => {
    const normalizedQuery = removeDiacritics(searchQuery.toLowerCase().trim());
    const filtered = examScores.filter((score) => {
      const normalizedUniversityName = removeDiacritics(score.universityName.toLowerCase());
      const normalizedUniversityCode = score.universityCode.toLowerCase();
      return (normalizedUniversityName.includes(normalizedQuery) || normalizedUniversityCode.includes(normalizedQuery)) && (selectedYear === '' || score.year === selectedYear);
    });
    setFilteredScores(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentData = detail ? detail.majors.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : [];

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
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-2">Kết quả</h3>
        <div className="space-y-2">
          {filteredScores.map(({ title, universityName, universityCode, year }) => (
            <div key={`${universityCode}-${year}`} className="text-blue-600 hover:underline cursor-pointer" onClick={() => fetchExamDetail(universityCode, year)}>
              {title}
            </div>
          ))}
        </div>
      </div>

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
            {Array.from({ length: Math.ceil(detail.majors.length / rowsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Careers;
