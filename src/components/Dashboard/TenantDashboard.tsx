import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api';
import { House, Booking, Payment, ApiResponse } from '@/types/api';
import HouseCard from '@/components/Houses/HouseCard';
import HouseDetailsModal from '@/components/Houses/HouseDetailsModal';
import BookingModal from '@/components/Houses/BookingModal';
import PaymentModal from '@/components/Payments/PaymentModal';
import FeedbackModal from '@/components/Feedback/FeedbackModal';
import { Calendar, DollarSign, MessageSquare, Home } from 'lucide-react';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    house_city: '',
    min_price: '',
    max_price: '',
    rooms: '',
    house_type: ''
  });
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const { data: housesResponse, isLoading: housesLoading, error: housesError, refetch: refetchHouses } = useQuery({
    queryKey: ['houses', filters],
    queryFn: () => apiClient.getHouses(filters),
  });

  const { data: bookingsResponse, isLoading: bookingsLoading, refetch: refetchBookings } = useQuery({
    queryKey: ['tenant-bookings'],
    queryFn: () => apiClient.getBookings(),
  });

  const { data: paymentsResponse, isLoading: paymentsLoading, refetch: refetchPayments } = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: () => apiClient.getTenantPayments(),
  });

  const houses = (housesResponse as ApiResponse<House[]>)?.data || [];
  const bookings = (bookingsResponse as ApiResponse<Booking[]>)?.data || [];
  const payments = (paymentsResponse as ApiResponse<Payment[]>)?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      house_city: searchTerm
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleViewHouse = (house: House) => {
    setSelectedHouse(house);
    setIsDetailsModalOpen(true);
  };

  const handleBookHouse = (house: House) => {
    setSelectedHouse(house);
    setIsBookingModalOpen(true);
  };

  const handleBookingCreated = () => {
    refetchBookings();
    refetchHouses();
  };

  const handleMakePayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentCreated = () => {
    refetchBookings();
    refetchPayments();
  };

  const handleGiveFeedback = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackCreated = () => {
    refetchBookings();
    refetchPayments();
  };

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

  const findPaymentForBooking = (bookingId: number) => {
    return payments.find(payment => payment.house_id === bookingId);
  };

  if (housesError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Dashboard</h1>
        <p className="text-gray-600">Browse properties, manage bookings, and track your rentals</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="browse">Browse Houses</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="payments">My Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find properties that match your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    placeholder="Search by city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Input
                    placeholder="Min price"
                    type="number"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  />
                  <Input
                    placeholder="Max price"
                    type="number"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  />
                  <Input
                    placeholder="Number of rooms"
                    type="number"
                    value={filters.rooms}
                    onChange={(e) => handleFilterChange('rooms', e.target.value)}
                  />
                  <Input
                    placeholder="House type"
                    value={filters.house_type}
                    onChange={(e) => handleFilterChange('house_type', e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </CardContent>
          </Card>

          {/* Houses Grid */}
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
                <HouseCard 
                  key={house.id} 
                  house={house} 
                  onView={handleViewHouse}
                  onBook={handleBookHouse}
                  showBookButton={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No houses found matching your criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <div className="space-y-6">
            {bookingsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : bookings.length > 0 ? (
              bookings.map((booking) => {
                const payment = findPaymentForBooking(booking.house_id);
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            Booking #{booking.booking_number}
                          </h3>
                          <p className="text-gray-600 mb-1">House ID: {booking.house_id}</p>
                          <p className="text-gray-600 mb-1">From: {booking.from_date}</p>
                          <p className="text-gray-600 mb-1">To: {booking.to_date}</p>
                          {booking.duration && (
                            <p className="text-gray-600 mb-1">Duration: {booking.duration}</p>
                          )}
                          {booking.message && (
                            <p className="text-gray-600 mb-2">Message: {booking.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getBookingStatusBadge(booking.status)}
                        </div>
                      </div>

                      {/* Show different actions based on booking status */}
                      {booking.status === 1 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Booking Approved!</h4>
                          {!payment ? (
                            <>
                              <p className="text-green-700 text-sm mb-3">
                                Your booking has been approved. Make payment to complete the process.
                              </p>
                              <Button 
                                onClick={() => handleMakePayment(booking)}
                                className="flex items-center gap-2"
                              >
                                <DollarSign className="h-4 w-4" />
                                Make Payment
                              </Button>
                            </>
                          ) : (
                            <>
                              <p className="text-green-700 text-sm mb-3">
                                Payment completed! You can now view your agreement and leave feedback.
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  View Agreement
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleGiveFeedback(payment)}
                                  className="flex items-center gap-1"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  Give Feedback
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-4">Start by browsing available properties</p>
                <Button onClick={() => setActiveTab('browse')}>
                  Browse Houses
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payment History</h2>
            {paymentsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
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
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold mb-2">Payment #{payment.id}</h3>
                        <p className="text-gray-600 mb-1">House ID: {payment.house_id}</p>
                        <p className="text-gray-600 mb-1">Date: {payment.date_payment}</p>
                        {payment.details && (
                          <p className="text-gray-600 mb-2">Details: {payment.details}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className="bg-green-500">Paid</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGiveFeedback(payment)}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                <p className="text-gray-500">Your payment history will appear here</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <HouseDetailsModal
        house={selectedHouse}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedHouse(null);
        }}
        onBook={handleBookHouse}
      />

      <BookingModal
        house={selectedHouse}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedHouse(null);
        }}
        onBookingCreated={handleBookingCreated}
      />

      <PaymentModal
        booking={selectedBooking}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedBooking(null);
        }}
        onPaymentCreated={handlePaymentCreated}
      />

      <FeedbackModal
        payment={selectedPayment}
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setSelectedPayment(null);
        }}
        onFeedbackCreated={handleFeedbackCreated}
      />
    </div>
  );
};

export default TenantDashboard;
