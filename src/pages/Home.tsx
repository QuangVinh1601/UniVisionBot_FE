import React from 'react';
import { useLocation } from 'react-router-dom';
import image1 from '../images/image1.jpg'; 
import image2 from '../images/image2.jpg';
import aboutHomeImage from '../images/about_home.png';
import article1 from '../images/article1.jpg';
import image5 from '../images/image5.jpg';
import image6 from '../images/image6.png';
const Home: React.FC = () => {
  const location = useLocation();
  const { UserId } = location.state || {};
  return (
    <div className="relative">
      <img src={image1} alt="Background" className="w-full h-full object-cover mb-4" />
      <h1 className="text-4xl font-semibold text-black text-center my-4">GIỚI THIỆU UNI VISION BOT</h1>
      <img src={image2} alt="Image2" className="w-full h-full object-cover my-4"/>
      {/* Replacing image3 with the formatted HTML content */}
      <div className="container mx-auto my-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#F1F1F1] px-0.5">
          {/* Left Side - Image */}
          <div className="w-full">
            <img src={aboutHomeImage} alt="About UNI VISION BOT" className="w-full h-auto object-cover" />
          </div>

          {/* Right Side - Text Content */}
          <div className="w-full">
            <div className="flex items-center">
              <div>
                <h3 className="text-orange-600 font-bold text-3xl">QUY TRÌNH</h3>
                <h3 className="text-orange-600 font-bold text-3xl">HƯỚNG NGHIỆP ONLINE</h3>
              </div>
              <div className="ml-4">
                <span className="text-orange-600 text-5xl font-bold">5</span>
                <span className="text-orange-600 font-bold text-2xl block">BƯỚC</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-lg">Giúp cho người dùng đưa ra quyết định</p>
              <p className="text-lg font-bold">CHỌN NGÀNH NGHỀ, CHỌN TRƯỜNG</p>
              <p className="text-lg">phù hợp</p>
            </div>

            {/* Steps List */}
            <div className="mt-6 space-y-4">
              {[ // Danh sách các bước được tạo từ một mảng cho gọn gàng
                { number: "01", text: "Quy trình giúp \"can thiệp sớm\" trong việc định hướng nghề nghiệp cho học sinh" },
                { number: "02", text: "Quy trình cá nhân hóa cao đến từng người dùng" },
                { number: "03", text: "Luôn theo sát và hỗ trợ liên tục tới người dùng" },
                { number: "04", text: "Cung cấp đầy đủ thông tin chính thống, trọng tâm nhằm hỗ trợ việc chọn ngành nghề và chọn trường" },
                { number: "05", text: "Tư vấn hỗ trợ Hướng nghiệp Toàn diện" }
              ].map((step, index) => (
                <div key={index} className="grid grid-cols-[3rem_auto] items-center gap-4 bg-blue-100 p-3 rounded-md">
                  <div className="flex items-center justify-center bg-blue-800 text-white text-xl font-bold w-12 h-12 rounded-full">
                    {step.number}
                  </div>
                  <div className="text-blue-800">{step.text}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-right my-4">
              <a 
                className="px-6 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold rounded-full transition duration-300"
                href="/career-guidance-test"
              >
                Test để tham gia
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Articles section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Thẻ bài viết 1 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img
            src={article1}
            alt="Article 1"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Họa tiết sắc màu giúp bạn lựa chọn nghề nghiệp</h3>
            <p className="text-gray-700 mb-4">
              Nếu bạn đang chênh vênh chưa biết lựa chọn theo con đường nào sau này thì hãy làm thử bài trắc nghiệm vui này.
            </p>
            <a
              href='https://vnexpress.net/hoa-tiet-sac-mau-giup-ban-lua-chon-nghe-nghiep-4801995.html'
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto text-center">Xem
            </a>
          </div>
        </div>

        {/* Thẻ bài viết 2 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img
            src={image5}
            alt="Article 2"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Thaco sẽ tổ chức 2.500 khóa học cho nhân sự toàn hệ thống</h3>
            <p className="text-gray-700 mb-4">
              Tập đoàn Thaco sẽ phối hợp cùng Trường Cao đẳng Thaco, các trung tâm, trường đại học thực hiện gần 2.500 khóa học cho các nhân sự của toàn hệ thống, trong năm 2024.
            </p>
            <a
              href='https://vnexpress.net/thaco-se-to-chuc-2-500-khoa-hoc-cho-nhan-su-toan-he-thong-4753992.html'
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto text-center">Xem
            </a>
          </div>
        </div>

        {/* Thẻ bài viết 3 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <img
            src={image6}
            alt="Article 3"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">Đăng ký Du học nghề và có việc làm tại nước Đức</h3>
            <p className="text-gray-700 mb-4">
              Học nghề có lương tới 1000 Euro/tháng, nhận học bổng 63 triệu và việc làm tại Đức...
            </p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-auto">Xem</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
