
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { House } from '@/types/api';

interface BookingModalProps {
  house: House | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  house, 
  isOpen, 
  onClose, 
  onBookingCreated 
}) => {
  const [bookingData, setBookingData] = useState({
    from_date: '',
    to_date: '',
    duration: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!house || !bookingData.from_date || !bookingData.to_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createBooking({
        house_id: house.id,
        from_date: bookingData.from_date,
        to_date: bookingData.to_date,
        duration: bookingData.duration,
        message: bookingData.message
      });

      toast({
        title: "Success",
        description: "Booking request submitted successfully! Please wait for approval."
      });

      setBookingData({
        from_date: '',
        to_date: '',
        duration: '',
        message: ''
      });
      
      if (onBookingCreated) onBookingCreated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  if (!house) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Property</DialogTitle>
          <DialogDescription>
            Submit a booking request for {house.house_type} at {house.address}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="from_date">From Date *</Label>
            <Input
              id="from_date"
              type="date"
              value={bookingData.from_date}
              onChange={(e) => handleInputChange('from_date', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="to_date">To Date *</Label>
            <Input
              id="to_date"
              type="date"
              value={bookingData.to_date}
              onChange={(e) => handleInputChange('to_date', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={bookingData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g., 6 months"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={bookingData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Any special requests or notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
