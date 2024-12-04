import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboardHeader from './AdminDashboardHeader';

const AdminLayout: React.FC = () => {
  return (
    <div>
      <AdminDashboardHeader />
    </div>
  );
};

export default AdminLayout;
