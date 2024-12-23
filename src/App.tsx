import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Careers from './pages/Careers';
import CareerGuidanceTest from './pages/CareerGuidanceTest/CareerGuidanceTest';
import ChatBotMess from './components/ChatBotMess';
import WhatToStudy from './pages/WhatToStudy';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ConsultantChat from './pages/ConsultantChat';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboardHeader from './admin/components/AdminDashboardHeader';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminCareers from './admin/pages/AdminCareers';
import AdminWhatToStudy from './admin/pages/pagesOfAdminArticle/AdminWhatToStudy';
import UniversityDetails from './admin/pages/pagesOfAdminCareers/UniversityDetails'; // Import trang chi tiết trường đại học
import UniversityEdit from './admin/pages/pagesOfAdminCareers/UniversityEdit';
import UniversityAdd from './admin/pages/pagesOfAdminCareers/UniversityAdd';
import FacultyAdd from './admin/pages/pagesOfAdminCareers/FacultyAdd';
import FacultyEdit from './admin/pages/pagesOfAdminCareers/FacultyEdit';
import FacultyMajors from './admin/pages/pagesOfAdminCareers/FacultyMajors';
import AddMajor from './admin/pages/pagesOfAdminCareers/MajorAdd';
import EditMajor from './admin/pages/pagesOfAdminCareers/EditMajor';
import ArticleEditor from './admin/pages/pagesOfAdminArticle/ArticleEditor';
import ArticleAdd from './admin/pages/pagesOfAdminArticle/ArticleAdd';
import ChatWindow from './components/ChatWindow'; // Import ChatWindow component
import { PrivateRoute } from './components/PrivateRoute';
import UserChat from './pages/UserChat';
import { FeedbackProvider } from './contexts/FeedbackContext';
import { FeedbackModal } from './components/FeedbackModal';
import AdminFeedback from './admin/pages/AdminFeedback';
import VisitorCounter from './components/VisitorCounter'; // Import useVisitorCounter hook
import NotFoundPage from './pages/NotFoundPage';
import { Navigate } from 'react-router-dom';
import { User } from 'lucide-react';
import UserManagement from './admin/pages/pagesOfAdminUser/User';
import EditUser from './admin/pages/pagesOfAdminUser/EditUser';
import { AD_Click } from './api/authApi';


function App() {
  const location = useLocation();
  const visitorCount = VisitorCounter();
  const role = localStorage.getItem('role');
  const isHaveBanner =
    location.pathname === '/' ||
    location.pathname === '/careers' ||
    location.pathname === '/career-guidance-test' ||
    location.pathname === '/what-to-study';

  const handleAdClick = async () => {
    try {
      await AD_Click();
      console.log('Ad click recorded');
    } catch (error) {
      console.error('Error recording ad click', error);
    }
  };

  const isPageAdmin =
    location.pathname === '/admin' ||
    location.pathname === '/admin/dashboard' ||
    location.pathname === '/admin/careers' ||
    location.pathname === '/admin/what-to-study' ||
    location.pathname === '/admin/feedback' ||
    location.pathname === '/admin/account' ||
    location.pathname === '/admin/careers/add' ||
    location.pathname.startsWith('/admin/careers/university') ||
    location.pathname.startsWith('/admin/careers/edit');

  const isAdminOrConsultant = role === 'ADMIN' || role === 'CONSULTANT';

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/admin' ||
    location.pathname === '/admin/feedback' ||
    location.pathname === '/admin/dashboard' ||
    location.pathname === '/admin/careers' ||
    location.pathname === '/admin/what-to-study' ||
    location.pathname === '/admin/account' ||
    location.pathname === '/admin/careers/add' ||
    location.pathname.startsWith('/admin/careers/university') ||
    location.pathname.startsWith('/admin/careers/edit') ||
    location.pathname === '/consultant-chat' ||
    location.pathname === '/UserChat'

  const is404 = location.pathname === '/404';
  const isUser = role === 'USER';

  return (
    <FeedbackProvider>
      <div className="flex flex-col min-h-screen">
        {!isPageAdmin && !isAdminOrConsultant && !is404 && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header />
            <hr className="border-t border-gray-300" />
          </div>
        )}
        <div
          className={`flex flex-1 ${isAuthPage ? 'justify-center' : ''} ${isHaveBanner ? 'mt-16' : ''
            }`}
        >
          {isHaveBanner && (
            <>
              <AdBanner position="left" onClick={handleAdClick} />
              <hr className="border-l border-gray-300" />
            </>
          )}
          <main className="flex-1">
            <Routes>
              <Route path="/404" element={<NotFoundPage />} />
              {/* Check if user is ADMIN or CONSULTANT, redirect Home to 404 */}
              <Route
                path="/"
                element={
                  isAdminOrConsultant ? (
                    <Navigate to="/404" replace />
                  ) : (
                    <Home />
                  )
                }
              />
              <Route path="/careers" element={<Careers />} />
              <Route path="/career-guidance-test" element={<CareerGuidanceTest />} />
              <Route path="/what-to-study" element={<WhatToStudy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected route for ConsultantChat */}
              <Route
                path="/consultant-chat"
                element={
                  <PrivateRoute role="CONSULTANT">
                    <ConsultantChat />
                  </PrivateRoute>
                }
              />

              {/* Admin Dashboard with nested routes */}
              <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminLayout /></PrivateRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="careers" element={<AdminCareers />} />
                <Route path="careers/add" element={<UniversityAdd />} />
                <Route path="careers/university/:id" element={<UniversityDetails />} />
                <Route path="careers/edit/:id" element={<UniversityEdit />} />
                <Route path="/admin/careers/university/:universityId/faculties/add" element={<FacultyAdd />} />
                <Route path="/admin/careers/university/:universityId/faculties/edit/:facultyId" element={<FacultyEdit />} />
                <Route path="/admin/careers/university/:universityId/faculties/:facultyId/majors" element={<FacultyMajors />} />
                <Route path="/admin/careers/university/:universityId/faculties/:facultyId/majors/add" element={<AddMajor />} />
                <Route path="/admin/careers/university/:universityId/faculties/:facultyId/majors/edit/:majorId" element={<EditMajor />} />
                <Route path="what-to-study" element={<AdminWhatToStudy />} />
                <Route path="what-to-study/edit/:id" element={<ArticleEditor />} />
                <Route path="account" element={<UserManagement />} />
                <Route path="account/:id" element={<EditUser />} />
                <Route path="what-to-study/add" element={< ArticleAdd/>} />
                <Route path="feedback" element={<AdminFeedback />} />
              </Route>
              {/* ChatBotMess for USER */}
              <Route
                path="/chat-bot-mess"
                element={
                  <PrivateRoute role="USER">
                    <ChatBotMess />
                  </PrivateRoute>
                }
              />
              <Route path="/UserChat" element={
                <PrivateRoute role="USER">
                  <UserChat />
                </PrivateRoute>
              }
              />
            </Routes>
          </main>
          {isHaveBanner && (
            <>
              <hr className="border-r border-gray-300" />
              <AdBanner position="right" onClick={handleAdClick} />
            </>
          )}
        </div>

        {(!isAuthPage && !is404) && (
          <>
            <hr className="border-t border-gray-300" />
            <Footer />
          </>
        )}

        {!isAuthPage && <FeedbackModal />}  {/* Add FeedbackModal here */}
        {(isUser) && <Chatbot />}
      </div>
    </FeedbackProvider>

  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
