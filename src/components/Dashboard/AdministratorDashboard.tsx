
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api';
import { House, Booking, Payment, Feedback, User, ApiResponse } from '@/types/api';
import { Home, Calendar, DollarSign, FileText, Users, MessageSquare } from 'lucide-react';

const AdministratorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all data for admin overview
  const { data: housesResponse, isLoading: housesLoading } = useQuery({
    queryKey: ['admin-houses'],
    queryFn: () => apiClient.getAdminHouses(),
  });

  const { data: bookingsResponse, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => apiClient.getAdminBookings(),
  });

  const { data: paymentsResponse, isLoading: paymentsLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: () => apiClient.getAdminPayments(),
  });

  const { data: feedbackResponse, isLoading: feedbackLoading } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: () => apiClient.getAdminFeedback(),
  });

  const { data: tenantsResponse, isLoading: tenantsLoading } = useQuery({
    queryKey: ['admin-tenants'],
    queryFn: () => apiClient.getAdminTenants(),
  });

  const { data: houseOwnersResponse, isLoading: houseOwnersLoading } = useQuery({
    queryKey: ['admin-house-owners'],
    queryFn: () => apiClient.getAdminHouseOwners(),
  });

  const houses = (housesResponse as ApiResponse<House[]>)?.data || [];
  const bookings = (bookingsResponse as ApiResponse<Booking[]>)?.data || [];
  const payments = (paymentsResponse as ApiResponse<Payment[]>)?.data || [];
  const feedback = (feedbackResponse as ApiResponse<Feedback[]>)?.data || [];
  const tenants = (tenantsResponse as ApiResponse<User[]>)?.data || [];
  const houseOwners = (houseOwnersResponse as ApiResponse<User[]>)?.data || [];

  const getBookingStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary">Pending</Badge>;
      case 1:
        return <Badge className="bg-green-500">Approved</Badge>;
      case 2:
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleDeleteHouse = async (houseId: number) => {
    try {
      await apiClient.deleteAdminHouse(houseId);
      window.location.reload(); // Simple refresh - in production you'd use react-query's invalidation
    } catch (error) {
      console.error('Error deleting house:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrator Dashboard</h1>
        <p className="text-gray-600">Manage users, properties, and system settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="houses">All Houses</TabsTrigger>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Houses</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{houses.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payments.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Tenants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tenants.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">House Owners</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{houseOwners.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedback Entries</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedback.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="houses">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">All Houses in System</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {housesLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))
            ) : houses.length > 0 ? (
              houses.map((house) => (
                <Card key={house.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{house.house_type}</h3>
                    <p className="text-gray-600 mb-2">{house.address}</p>
                    <p className="text-gray-600 mb-2">{house.house_city}, {house.house_state}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Rooms: {house.rooms}</span>
                      <span className="font-bold text-lg">${house.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Owner ID: {house.house_owner_id}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteHouse(house.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No houses found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">All Bookings</h2>
          </div>
          
          <div className="space-y-4">
            {bookingsLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold mb-2">Booking #{booking.booking_number}</h3>
                        <p className="text-gray-600 mb-1">Tenant: {booking.tenant_email}</p>
                        <p className="text-gray-600 mb-1">House ID: {booking.house_id}</p>
                        <p className="text-gray-600 mb-1">From: {booking.from_date}</p>
                        <p className="text-gray-600 mb-1">To: {booking.to_date}</p>
                        {booking.message && (
                          <p className="text-gray-600 mb-2">Message: {booking.message}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getBookingStatusBadge(booking.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No bookings found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tenants ({tenants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tenantsLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-16 w-full" />
                    ))
                  ) : tenants.length > 0 ? (
                    tenants.map((tenant) => (
                      <div key={tenant.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{tenant.full_name}</p>
                          <p className="text-sm text-gray-600">{tenant.email_address}</p>
                        </div>
                        <Badge variant="outline">Tenant</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No tenants found.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>House Owners ({houseOwners.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {houseOwnersLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-16 w-full" />
                    ))
                  ) : houseOwners.length > 0 ? (
                    houseOwners.map((owner) => (
                      <div key={owner.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{owner.owner_name}</p>
                          <p className="text-sm text-gray-600">{owner.email_address}</p>
                          {owner.mobile_number && (
                            <p className="text-sm text-gray-600">{owner.mobile_number}</p>
                          )}
                        </div>
                        <Badge variant="outline">Owner</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No house owners found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">All Payments</h2>
          </div>
          
          <div className="space-y-4">
            {paymentsLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold mb-2">Payment #{payment.id}</h3>
                        <p className="text-gray-600 mb-1">From: {payment.user_email}</p>
                        <p className="text-gray-600 mb-1">House ID: {payment.house_id}</p>
                        <p className="text-gray-600 mb-1">Owner ID: {payment.house_owner_id}</p>
                        <p className="text-gray-600 mb-1">Date: {payment.date_payment}</p>
                        {payment.details && (
                          <p className="text-gray-600">Details: {payment.details}</p>
                        )}
                      </div>
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No payments found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">User Feedback</h2>
          </div>
          
          <div className="space-y-4">
            {feedbackLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : feedback.length > 0 ? (
              feedback.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold mb-2">Feedback #{item.id}</h3>
                        <p className="text-gray-600 mb-1">From: {item.user_email}</p>
                        <p className="text-gray-600 mb-1">Payment ID: {item.payment_id}</p>
                        <p className="text-gray-600 mb-2">Comment: {item.comment}</p>
                        {item.rating && (
                          <p className="text-gray-600">Rating: {item.rating}/5</p>
                        )}
                      </div>
                      <Badge variant="outline">Feedback</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No feedback found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministratorDashboard;
