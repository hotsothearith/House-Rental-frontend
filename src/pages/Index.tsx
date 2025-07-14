
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthTabs from '@/components/Auth/AuthTabs';
import TenantDashboard from '@/components/Dashboard/TenantDashboard';
import HouseOwnerDashboard from '@/components/Dashboard/HouseOwnerDashboard';
import AdministratorDashboard from '@/components/Dashboard/AdministratorDashboard';
import Navbar from '@/components/Layout/Navbar';

const Index = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthTabs />;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'tenant':
        return <TenantDashboard />;
      case 'house_owner':
        return <HouseOwnerDashboard />;
      case 'administrator':
        return <AdministratorDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{renderDashboard()}</main>
    </div>
  );
};

export default Index;
