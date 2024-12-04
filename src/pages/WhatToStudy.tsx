import React from 'react';
import image4 from '../images/image4.jpeg';
import image5 from '../images/image5.jpg';
import image6 from '../images/image6.png';

const WhatToStudy = () => {
  return (
    <div className="container mx-auto p-8">
      {/* Banner section */}
      <div className="relative h-[400px] w-[900px] mb-8 border-2 border-black border-solid">
        <img
          src="https://png.pngtree.com/thumb_back/fh260/background/20230715/pngtree-d-cartoon-illustration-of-diverse-professions-in-an-industrial-construction-team-image_3877024.jpg"
          alt="Banner Background"
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="text-center bg-white bg-opacity-70 p-8 rounded-lg w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Chuyên mục HỌC NGHỀ GÌ</h2>
            <p className="text-lg mb-4 text-gray-700">Cùng các bạn đi hỏi nghề, hỏi nơi học nghề, giúp các bạn tìm được con đường học nghề phù hợp.</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Đăng ký nhờ hỏi Nghề</button>
          </div>
        </div>
      </div>

      {/* Articles section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Thẻ bài viết 1 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img src={image4} alt="Article 1" className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Một vài lưu ý nhỏ khi chọn theo học nghề</h3>
            <p className="text-gray-700 mb-4">Học nghề mang lại giá trị quan trọng không chỉ cho bản thân mà còn cho cộng đồng xã hội...</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto">Xem</button>
          </div>
        </div>

        {/* Thẻ bài viết 2 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img src={image5} alt="Article 2" className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Khoá trung cấp chính quy Công nghệ ô tô 2023</h3>
            <p className="text-gray-700 mb-4">Mở đăng từ 11/09/2023. Bảo trợ 100% học phí, hỗ trợ việc làm tại các công ty hàng đầu...</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto">Xem</button>
          </div>
        </div>

        {/* Thẻ bài viết 3 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img src={image6} alt="Article 3" className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Đăng ký Du học nghề và có việc làm tại nước Đức</h3>
            <p className="text-gray-700 mb-4">Học nghề có lương tới 1000 Euro/tháng, nhận học bổng 63 triệu và việc làm tại Đức...</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto">Xem</button>
          </div>
        </div>

        {/* Thẻ bài viết 1 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img src={image4} alt="Article 1" className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Một vài lưu ý nhỏ khi chọn theo học nghề</h3>
            <p className="text-gray-700 mb-4">Học nghề mang lại giá trị quan trọng không chỉ cho bản thân mà còn cho cộng đồng xã hội...</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto">Xem</button>
          </div>
        </div>

        {/* Thẻ bài viết 2 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img src={image5} alt="Article 2" className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Khoá trung cấp chính quy Công nghệ ô tô 2023</h3>
            <p className="text-gray-700 mb-4">Mở đăng từ 11/09/2023. Bảo trợ 100% học phí, hỗ trợ việc làm tại các công ty hàng đầu...</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto">Xem</button>
          </div>
        </div>

        {/* Thẻ bài viết 3 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img src={image6} alt="Article 3" className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Đăng ký Du học nghề và có việc làm tại nước Đức</h3>
            <p className="text-gray-700 mb-4">Học nghề có lương tới 1000 Euro/tháng, nhận học bổng 63 triệu và việc làm tại Đức...</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto">Xem</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatToStudy;
