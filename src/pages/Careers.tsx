
import React, { useState } from 'react';

const Careers: React.FC = () => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedMajor, setSelectedMajor] = useState<string>('');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tìm kiếm ngành học</h1>
      <div className="mb-4">
        <label htmlFor="field" className="block mb-2">Nhóm ngành:</label>
        <div className="relative">
          <input
            type="text"
            id="field"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            placeholder="Nhập nhóm ngành"
            className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          />
          {selectedField && (
            <button
              onClick={() => setSelectedField('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="major" className="block mb-2">Ngành:</label>
        <div className="relative">
          <input
            type="text"
            id="major"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            placeholder="Nhập ngành"
            className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          />
          {selectedMajor && (
            <button
              onClick={() => setSelectedMajor('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Tìm →
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Nhập lại
        </button>
      </div>
    </div>
  );
};

export default Careers;
