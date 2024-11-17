import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AdminCareers: React.FC = () => {
  const [careers, setCareers] = useState([
    {
      name: 'Đại Học Duy Tân',
      code: 'DTT',
      region: 'Miền Trung',
      selected: false,
    },
    {
      name: 'Trường Đại học Kiến Trúc',
      code: 'KTD',
      region: 'Miền Trung',
      selected: false,
    },
    {
      name: 'Đại học Bách Khoa',
      code: 'DDK',
      region: 'Miền Trung',
      selected: false,
    },
    {
      name: 'Đại học Kinh tế',
      code: 'DDQ',
      region: 'Miền Trung',
      selected: false,
    },
  ]);

  const [newCareer, setNewCareer] = useState({
    name: '',
    code: '',
    region: '',
  });

  const [isUniversity, setIsUniversity] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [isFaculty, setIsFaculty] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [isMajor, setIsMajor] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);

  const handleAdd = () => {
    if (newCareer.name && newCareer.code && newCareer.region) {
      setCareers([...careers, { ...newCareer, selected: false }]);
      setNewCareer({ name: '', code: '', region: '' }); // Reset the input fields
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleDeleteSelected = () => {
    const updatedCareers = careers.filter((career) => !career.selected);
    setCareers(updatedCareers);
  };

  const handleSelectCareer = (index: number) => {
    const updatedCareers = careers.map((career, i) => (i === index ? { ...career, selected: !career.selected } : career));
    setCareers(updatedCareers);
  };

  const handleUniversityClick = (universityName: string) => {
    console.log('Starting the university information...');
    setSelectedUniversity(universityName);
    setIsUniversity(true);
  };

  const handleFacultyClick = (facultyName: string) => {
    console.log('Starting the faculty information...');
    setSelectedFaculty(facultyName);
    setIsFaculty(true);
  };

  const handleMajorClick = (majorName: string) => {
    console.log('Starting the major information...');
    setSelectedMajor(majorName);
    setIsMajor(true);
  };

  const handleSave = () => {
    alert('Saved successfully!');
  };

  const handleCancel = () => {
    setNewCareer({ name: '', code: '', region: '' });
    setIsUniversity(false);
    setIsFaculty(false);
    setIsMajor(false);
    setSelectedUniversity(null);
    setSelectedFaculty(null);
    setSelectedMajor(null);
  };

  const [faculties, setFaculties] = useState<string[]>(['Công nghệ thông tin', 'Đào Tạo Quốc tế']);

  const handleDeleteFaculty = (facultyName: string) => {
    if (faculties.includes(facultyName)) {
      const confirmDelete = window.confirm('Bạn có chắc muốn xoá khoa này không?');
      if (confirmDelete) {
        const updatedFaculties = faculties.filter((faculty) => faculty !== facultyName);
        setFaculties(updatedFaculties);
      }
    } else {
      alert('Không thể xoá, chưa chọn khoa nào');
    }
  };

  const [facultiesWithMajors, setFacultiesWithMajors] = useState<{ faculty: string; majors: string[] }[]>([
    { faculty: 'Công nghệ thông tin', majors: ['Khoa học máy tính', 'An ninh mạng'] },
    { faculty: 'Đào Tạo Quốc tế', majors: ['Quản trị kinh doanh', 'Kinh tế quốc tế'] },
  ]);

  const handleDeleteMajor = (facultyName: string, majorName: string) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xoá ngành này không?');
    if (confirmDelete) {
      setFacultiesWithMajors((prev) =>
        prev.map((faculty) => {
          if (faculty.faculty === facultyName) {
            return {
              ...faculty,
              majors: faculty.majors.filter((major) => major !== majorName), // Loại ngành khỏi danh sách
            };
          }
          return faculty;
        }),
      );
      alert(`Đã xoá ngành: ${majorName} khỏi khoa: ${facultyName}`);
    }
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      {!isUniversity && !isFaculty && !isMajor && (
        <>
          <div className="mb-4">
            <input type="text" placeholder="Tên Trường" value={newCareer.name} onChange={(e) => setNewCareer({ ...newCareer, name: e.target.value })} className="border p-1 mr-2" />
            <input type="text" placeholder="Mã Trường" value={newCareer.code} onChange={(e) => setNewCareer({ ...newCareer, code: e.target.value })} className="border p-1 mr-2" />
            <input
              type="text"
              placeholder="Khu Vực"
              value={newCareer.region}
              onChange={(e) => setNewCareer({ ...newCareer, region: e.target.value })}
              className="border p-1 mr-2"
            />
            <button onClick={handleAdd} className="p-1 bg-blue-500 text-white rounded">
              <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add
            </button>
          </div>
          <table className="min-w-full mt-4 border">
            <thead>
              <tr>
                <th className="border p-2 text-left">CHỌN</th>
                <th className="border p-2 text-left">TRƯỜNG</th>
                <th className="border p-2 text-left">MÃ TRƯỜNG</th>
                <th className="border p-2 text-left">KHU VỰC</th>
              </tr>
            </thead>
            <tbody>
              {careers.map((career, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input type="checkbox" checked={career.selected} onChange={() => handleSelectCareer(index)} />
                  </td>
                  <td className="border p-2" onDoubleClick={() => handleUniversityClick(career.name)}>
                    {career.name}
                  </td>
                  <td className="border p-2">{career.code}</td>
                  <td className="border p-2">{career.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDeleteSelected} className="mt-4 p-2 bg-red-500 text-white rounded">
            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete Selected
          </button>
        </>
      )}
      {isUniversity && !isFaculty && !isMajor && (
        <div className="p-4">
          <button
            onClick={() => {
              setIsUniversity(false);
              setSelectedUniversity(null);
            }}
            className="mb-4 p-2 bg-gray-300 text-black rounded"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Quay lại
          </button>
          <h2 className="text-xl font-bold mb-2">Trường</h2>
          <p className="mb-2 bg-gray-200 p-2 rounded-lg">{selectedUniversity}</p>
          <h2 className="text-xl font-bold mb-2">Thông Tin</h2>
          <textarea
            className="mb-2 bg-gray-200 p-2 rounded-lg w-full"
            rows={5}
            defaultValue={`"name": "ĐH",\n"location": "Đà Nẵng"\n"description": "Trường Đại học Top 500 thế giới"\n"university_code": "DTU"\n"scholarship_available": true`}
          />
          <h2 className="text-xl font-bold mb-2">Khoa</h2>
          <div className="flex space-x-4">
            {faculties.map((faculty) => (
              <div key={faculty} className="flex items-center space-x-2">
                <p className="bg-gray-200 py-2 px-4 rounded cursor-pointer" onDoubleClick={() => handleFacultyClick(faculty)}>
                  {faculty}
                </p>
                <button onClick={() => handleDeleteFaculty(faculty)} className="p-1 bg-red-500 text-white rounded">
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button onClick={handleSave} className="mr-2 p-2 bg-green-500 text-white rounded">
              Save
            </button>
            <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
      {isFaculty && !isMajor && (
        <div className="p-4">
          <button
            onClick={() => {
              setIsFaculty(false);
              setSelectedFaculty(null);
            }}
            className="mb-4 p-2 bg-gray-300 text-black rounded"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Quay lại
          </button>
          <h2 className="text-xl font-bold mb-2">Khoa</h2>
          <p className="mb-2 bg-gray-200 p-2 rounded-lg">{selectedFaculty}</p>
          <h2 className="text-xl font-bold mb-2">Thông Tin</h2>
          <textarea
            className="mb-2 bg-gray-200 p-2 rounded-lg w-full"
            rows={5}
            defaultValue={`"name": "ĐH",\n"location": "Đà Nẵng"\n"description": "Trường Đại học Top 500 thế giới"\n"university_code": "DTU"\n"scholarship_available": true`}
          />
          <h2 className="text-xl font-bold mb-2">Ngành</h2>
          <div className="flex space-y-4">
            {facultiesWithMajors
              .filter((faculty) => faculty.faculty === selectedFaculty)
              .map((faculty) => (
                <div key={faculty.faculty} className="flex items-center space-x-4">
                  {faculty.majors.map((major) => (
                    <div key={major} className="flex items-center">
                      <p className="bg-gray-200 py-2 px-4 rounded cursor-pointer" onDoubleClick={() => handleMajorClick(major)}>
                        {major}
                      </p>
                      <button onClick={() => handleDeleteMajor(faculty.faculty, major)} className="p-1 bg-red-500 text-white rounded ml-2">
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <div className="mt-4">
            <button onClick={handleSave} className="mr-2 p-2 bg-green-500 text-white rounded">
              Save
            </button>
            <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
      {isMajor && (
        <div className="p-4">
          <button
            onClick={() => {
              setIsMajor(false);
              setSelectedMajor(null);
            }}
            className="mb-4 p-2 bg-gray-300 text-black rounded"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Quay lại
          </button>
          <h2 className="text-xl font-bold mb-2">Ngành</h2>
          <p className="mb-2 bg-gray-200 p-2 rounded-lg">{selectedMajor}</p>
          <h2 className="text-xl font-bold mb-2">Thông Tin</h2>
          <textarea
            className="mb-2 bg-gray-200 p-2 rounded-lg w-full"
            rows={5}
            defaultValue={`"name": "ĐH",\n"location": "Đà Nẵng"\n"description": "Trường Đại học Top 500 thế giới"\n"university_code": "DTU"\n"scholarship_available": true`}
          />
          <div className="mt-4">
            <button onClick={handleSave} className="mr-2 p-2 bg-green-500 text-white rounded">
              Save
            </button>
            <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareers;
