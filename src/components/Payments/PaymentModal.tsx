
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/types/api';

interface PaymentModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentCreated?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  booking, 
  isOpen, 
  onClose, 
  onPaymentCreated 
}) => {
  const [paymentData, setPaymentData] = useState({
    details: '',
    date_payment: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking || !paymentData.date_payment) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createPayment({
        house_id: booking.house_id,
        house_owner_id: booking.house?.house_owner_id,
        details: paymentData.details,
        date_payment: paymentData.date_payment
      });

      toast({
        title: "Success",
        description: "Payment recorded successfully!"
      });

      setPaymentData({
        details: '',
        date_payment: new Date().toISOString().split('T')[0]
      });
      
      if (onPaymentCreated) onPaymentCreated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Record payment for booking #{booking.booking_number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date_payment">Payment Date *</Label>
            <Input
              id="date_payment"
              type="date"
              value={paymentData.date_payment}
              onChange={(e) => handleInputChange('date_payment', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="details">Payment Details</Label>
            <Textarea
              id="details"
              value={paymentData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder="Payment method, transaction ID, notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
