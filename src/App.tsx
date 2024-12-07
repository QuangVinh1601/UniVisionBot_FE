import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import ChatBot from './components/Chatbot';
import Home from './pages/Home';
import Careers from './pages/Careers';
import CareerGuidanceTest from './pages/CareerGuidanceTest/CareerGuidanceTest';
import WhatToStudy from './pages/WhatToStudy';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ConsultantChat from './pages/ConsultantChat';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboardHeader from './admin/components/AdminDashboardHeader';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminCareers from './admin/pages/AdminCareers';
import AdminAccount from './admin/pages/AdminAccount';
import AdminWhatToStudy from './admin/pages/AdminWhatToStudy';
import UniversityDetails from './admin/pages/pagesOfAdminCareers/UniversityDetails'; // Import trang chi tiết trường đại học
import UniversityEdit from './admin/pages/pagesOfAdminCareers/UniversityEdit';
import UniversityAdd from './admin/pages/pagesOfAdminCareers/UniversityAdd';
import FacultyAdd from './admin/pages/pagesOfAdminCareers/FacultyAdd';
import FacultyEdit from './admin/pages/pagesOfAdminCareers/FacultyEdit';
import FacultyMajors from './admin/pages/pagesOfAdminCareers/FacultyMajors';
import AddMajor from './admin/pages/pagesOfAdminCareers/MajorAdd';
import EditMajor from './admin/pages/pagesOfAdminCareers/EditMajor';
import ChatWindow from './components/ChatWindow'; // Import ChatWindow component
import { PrivateRoute } from './components/PrivateRoute';
import UserChat from './pages/UserChat';

function App() {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const isPageAdmin = 
    location.pathname === '/admin'||
    location.pathname === '/admin/dashboard' ||
    location.pathname === '/admin/careers' ||
    location.pathname === '/admin/what-to-study' ||
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
    location.pathname === '/admin/dashboard' ||
    location.pathname === '/admin/careers' ||
    location.pathname === '/admin/what-to-study' ||
    location.pathname === '/admin/account' ||
    location.pathname === '/admin/careers/add' ||
    location.pathname.startsWith('/admin/careers/university') ||
    location.pathname.startsWith('/admin/careers/edit');

    location.pathname === '/consultant-chat' ||

    location.pathname === '/UserChat'; // Add UserChat to isAuthPage check

  return (
    <div className="flex flex-col min-h-screen">
      {!isPageAdmin && !isAdminOrConsultant && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
          <hr className="border-t border-gray-300" />
        </div>
      )}
      <div
        className={`flex flex-1 ${isAuthPage ? 'justify-center' : ''} ${
          isPageAdmin ? '' : 'mt-16'
        }`}
      >
        {!isAuthPage && (
          <>
            <AdBanner position="left" />
            <hr className="border-l border-gray-300" />
          </>
        )}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/career-guidance-test" element={<CareerGuidanceTest />} />
            <Route path="/what-to-study" element={<WhatToStudy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/consultant-chat" element={<PrivateRoute role="CONSULTANT"><ConsultantChat /></PrivateRoute>} />
            
            <Route path="/UserChat" element={<UserChat />} />

            {/* Admin Dashboard with nested routes */}
            <Route path="/admin" element={<AdminLayout />}>
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
              <Route path="account" element={<AdminAccount />} />
            </Route>
          </Routes>
        </main>
        {!isAuthPage && (
          <>
            <hr className="border-r border-gray-300" />
            <AdBanner position="right" />
          </>
        )}
      </div>

      {!isAuthPage && (
        <>
          <hr className="border-t border-gray-300" />
          <Footer />
        </>
      )}
      {!isAuthPage && <ChatBot />}
    </div>
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
