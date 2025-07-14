
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Home, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, userRole, logout, isAuthenticated } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'tenant':
        return 'Tenant';
      case 'house_owner':
        return 'House Owner';
      case 'administrator':
        return 'Administrator';
      default:
        return '';
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.full_name || user.owner_name || user.username || 'User';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-gray-900">RentEase</span>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{getUserDisplayName()}</div>
                  <div className="text-gray-500">{getRoleDisplayName(userRole!)}</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
