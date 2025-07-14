
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api';
import { House, Booking, Payment, Feedback, ApiResponse , Agreement} from '@/types/api';
import { Home, Calendar, DollarSign, FileText, Plus , MessageSquare} from 'lucide-react';

import AddHouseModal from '@/components/Houses/AddHouseModal';

const HouseOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddHouseModalOpen, setIsAddHouseModalOpen] = useState(false);

  // Fetch houses owned by the house owner
  const { data: housesResponse, isLoading: housesLoading, refetch: refetchHouses } = useQuery({
    queryKey: ['houses'],
    queryFn: () => apiClient.getHouses(),
  });

  // Fetch bookings for house owner
  const { data: bookingsResponse, isLoading: bookingsLoading } = useQuery({
    queryKey: ['house-owner-bookings'],
    queryFn: () => apiClient.getHouseOwnerBookings(),
  });

  // Fetch payments for house owner
  const { data: paymentsResponse, isLoading: paymentsLoading } = useQuery({
    queryKey: ['house-owner-payments'],
    queryFn: () => apiClient.getHouseOwnerPayments(),
  });

    const { data: feedbackResponse, isLoading: feedbackLoading } = useQuery<ApiResponse<Feedback[]>>({
     queryKey: ['house-owner-feedback'], // Changed query key to reflect house owner context
     queryFn: () => apiClient.getHouseOwnerFeedback(), // Calls the correct house owner specific API method
   });

  // Fetch agreements for house owner
  const { data: agreementsResponse, isLoading: agreementsLoading } = useQuery({
    queryKey: ['house-owner-agreements'],
    queryFn: () => apiClient.getHouseOwnerAgreements(),
  });

  const houses = (housesResponse as ApiResponse<House[]>)?.data || [];
  const bookings = (bookingsResponse as ApiResponse<Booking[]>)?.data || [];
  const payments = (paymentsResponse as ApiResponse<Payment[]>)?.data || [];
  const feedback = (feedbackResponse as ApiResponse<Feedback[]>)?.data || [];
  const agreements = (agreementsResponse as ApiResponse<any[]>)?.data || [];

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

  const handleUpdateBookingStatus = async (bookingId: number, status: number) => {
    try {
      await apiClient.updateBookingStatus(bookingId, status);
      // Refetch bookings to update the UI
      window.location.reload(); // Simple refresh - in production you'd use react-query's invalidation
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleHouseAdded = () => {
    refetchHouses();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">House Owner Dashboard</h1>
        <p className="text-gray-600">Manage your properties, bookings, and agreements</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="houses">My Houses</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {/* <TabsTrigger value="feedback">Users Feedback</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.filter(b => b.status === 1).length}</div>
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
            
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedback Entries</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedback.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agreements</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agreements.length}</div>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>

        <TabsContent value="houses">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Houses</h2>
            <Button onClick={() => setIsAddHouseModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New House
            </Button>
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No houses found.</p>
                <Button 
                  onClick={() => setIsAddHouseModalOpen(true)}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First House
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Booking Requests</h2>
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
                        <p className="text-gray-600 mb-1">From: {booking.from_date}</p>
                        <p className="text-gray-600 mb-1">To: {booking.to_date}</p>
                        {booking.message && (
                          <p className="text-gray-600 mb-2">Message: {booking.message}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getBookingStatusBadge(booking.status)}
                        {booking.status === 0 && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateBookingStatus(booking.id, 1)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleUpdateBookingStatus(booking.id, 2)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
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

        <TabsContent value="payments">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Payment History</h2>
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
                        <p className="text-gray-600 mb-1">Date: {payment.date_payment}</p>
                        {payment.details && (
                          <p className="text-gray-600">Details: {payment.details}</p>
                        )}
                      </div>
                      <Badge className="bg-green-500">Received</Badge>
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

             {/* <TabsContent value="feedback">
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
                    </TabsContent> */}

        <TabsContent value="agreements">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Agreements</h2>
          </div>
          
          <div className="space-y-4">
            {agreementsLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : agreements.length > 0 ? (
              agreements.map((agreement, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Agreement #{index + 1}</h3>
                    <p className="text-gray-600">Agreement details would be displayed here.</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No agreements found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add House Modal */}
      <AddHouseModal
        isOpen={isAddHouseModalOpen}
        onClose={() => setIsAddHouseModalOpen(false)}
        onHouseAdded={handleHouseAdded}
      />
    </div>
  );
};

export default HouseOwnerDashboard;
