
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { UserRole } from '@/types/api';

const AuthTabs: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('tenant');

  const roleOptions = [
    { value: 'tenant' as UserRole, label: 'Tenant', description: 'Looking for a place to rent' },
    { value: 'house_owner' as UserRole, label: 'House Owner', description: 'Have properties to rent out' },
    { value: 'administrator' as UserRole, label: 'Administrator', description: 'Manage the platform' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to RentEase</h2>
          <p className="mt-2 text-gray-600">Your property rental management platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Choose your role and sign in or create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">I am a:</label>
                <div className="mt-2 space-y-2">
                  {roleOptions.map((role) => (
                    <div
                      key={role.value}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedRole === role.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRole(role.value)}
                    >
                      <div className="font-medium">{role.label}</div>
                      <div className="text-sm text-gray-500">{role.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm userRole={selectedRole} />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm userRole={selectedRole} />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTabs;
