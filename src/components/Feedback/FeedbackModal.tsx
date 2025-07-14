
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Payment } from '@/types/api';
import { Star } from 'lucide-react';

interface FeedbackModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onFeedbackCreated?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  payment, 
  isOpen, 
  onClose, 
  onFeedbackCreated 
}) => {
  const [feedbackData, setFeedbackData] = useState({
    comment: '',
    rating: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payment || !feedbackData.comment || !feedbackData.rating) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createFeedback({
        payment_id: payment.id,
        comment: feedbackData.comment,
        rating: parseInt(feedbackData.rating)
      });

      toast({
        title: "Success",
        description: "Thank you for your feedback!"
      });

      setFeedbackData({
        comment: '',
        rating: ''
      });
      
      if (onFeedbackCreated) onFeedbackCreated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFeedbackData(prev => ({ ...prev, [field]: value }));
  };

  if (!payment) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Feedback</DialogTitle>
          <DialogDescription>
            Share your experience with this rental property
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating">Rating *</Label>
            <Select value={feedbackData.rating} onValueChange={(value) => handleInputChange('rating', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{num}</span>
                      <div className="flex">
                        {renderStars(num)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comment">Your Feedback *</Label>
            <Textarea
              id="comment"
              value={feedbackData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Tell us about your rental experience..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
