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
import ChatWindow from './components/ChatWindow'; // Import ChatWindow component
import AdminDashboard from './admin/components/AdminDashboardHeader';
import { PrivateRoute } from './components/PrivateRoute';
import UserChat from './pages/UserChat';

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/consultant-chat' ||
    location.pathname === '/admin-dashboard';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
        <hr className="border-t border-gray-300" />
      </div>
      <div className={`flex flex-1 mt-16 ${isAuthPage ? 'justify-center' : ''}`}>
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
            {/* <Route path="/consultant-chat" element={<PrivateRoute role="CONSULTANT"><ConsultantChat /></PrivateRoute>} />
            <Route path="/admin-dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} /> */}
            <Route path="/UserChat" element={<UserChat />} /> {/* Add this route */}
            <Route
              path="/consultant-chat"
              element={
                <PrivateRoute role="CONSULTANT">
                  {' '}
                  {/* Add role prop here */}
                  <ConsultantChat />
                </PrivateRoute>
              }
            />
            <Route path="/admin-dashboard" element={<PrivateRoute role="ADMIN">
              {" "}
              {/* Add role prop here */}
              <AdminDashboard />
            </PrivateRoute>}
            />

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
