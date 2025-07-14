
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/api';
import { toast } from '@/components/ui/use-toast';

interface RegisterFormProps {
  userRole: UserRole;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ userRole }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email_address: '',
    username: '',
    full_name: '',
    owner_name: '',
    mobile_number: '',
    address: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  // Disable registration for administrators
  if (userRole === 'administrator') {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Registration Not Available</h3>
        <p className="text-sm text-gray-600 mb-4">
          Administrator accounts cannot be registered through this form.
        </p>
        <p className="text-xs text-gray-500">
          Please contact system administrator for account creation.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userData;
      
      switch (userRole) {
        case 'tenant':
          userData = {
            full_name: formData.full_name,
            email_address: formData.email_address,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
          };
          break;
        case 'house_owner':
          userData = {
            owner_name: formData.owner_name,
            email_address: formData.email_address,
            mobile_number: formData.mobile_number,
            address: formData.address,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
          };
          break;
      }

      await register(userRole, userData);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (userRole) {
      case 'tenant':
        return (
          <>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email_address}
                onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
                required
              />
            </div>
          </>
        );
      case 'house_owner':
        return (
          <>
            <div>
              <Label htmlFor="owner_name">Owner Name</Label>
              <Input
                id="owner_name"
                type="text"
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email_address}
                onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile_number}
                onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFields()}
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={8}
        />
      </div>

      <div>
        <Label htmlFor="password_confirmation">Confirm Password</Label>
        <Input
          id="password_confirmation"
          type="password"
          value={formData.password_confirmation}
          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;
