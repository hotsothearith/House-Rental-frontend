
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/api';
import { toast } from '@/components/ui/use-toast';

interface LoginFormProps {
  userRole: UserRole;
}

const LoginForm: React.FC<LoginFormProps> = ({ userRole }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email_address: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credentials = userRole === 'administrator' 
        ? { username: formData.username, password: formData.password }
        : { email_address: formData.email_address, password: formData.password };

      await login(userRole, credentials);
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {userRole === 'administrator' ? (
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
      ) : (
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
      )}
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
