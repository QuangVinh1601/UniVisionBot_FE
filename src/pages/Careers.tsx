import React from 'react';

const Careers: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Tra cứu điểm chuẩn theo trường</h2>
        <div className="flex gap-2 mt-2">
          <input 
            type="text"
            placeholder="Tên trường"
            className="border rounded px-3 py-1 flex-grow"
          />
          <select className="border rounded px-3 py-1">
            <option>Chọn năm</option>
            <option>2023</option>
            <option>2022</option>
            <option>2021</option>
          </select>
          <button className="bg-orange-400 text-white px-4 py-1 rounded">
            Tìm
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-2">Kết quả</h3>
        <div className="space-y-2">
          {[2023, 2022, 2021].map(year => (
            <div key={year} className="text-blue-600 hover:underline cursor-pointer">
              <span>Điểm chuẩn năm {year} - </span>
              <span>Trường Đại học Y Hà Nội</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;
