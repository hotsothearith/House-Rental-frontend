
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { House } from '@/types/api';
import { MapPin, Bed, DollarSign, Home, Info } from 'lucide-react';

interface HouseDetailsModalProps {
  house: House | null;
  isOpen: boolean;
  onClose: () => void;
  onBook?: (house: House) => void;
}

const HouseDetailsModal: React.FC<HouseDetailsModalProps> = ({ 
  house, 
  isOpen, 
  onClose, 
  onBook 
}) => {
  if (!house) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {house.house_type} - ${house.price}/month
          </DialogTitle>
          <DialogDescription>
            Property details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Image */}
          {house.image && house.image !== 'house2.jpg' && house.image !== 'house3.jpg' && house.image !== 'villa2.jpg' ? (
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={house.image} 
                alt={house.house_type}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">No Image Available</div>';
                }}
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Image Available</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">{house.address}</p>
                  <p className="text-gray-600">{house.house_city}, {house.house_district}</p>
                  <p className="text-gray-600">{house.house_state}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Rooms</p>
                  <p className="text-gray-600">{house.rooms} rooms</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Price</p>
                  <p className="text-gray-600">${house.price} per month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{house.house_type}</Badge>
              {house.variation && <Badge variant="secondary">{house.variation}</Badge>}
            </div>

            {house.descriptions && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  <p className="font-medium">Description</p>
                </div>
                <p className="text-gray-600">{house.descriptions}</p>
              </div>
            )}

            {house.furnitures && (
              <div>
                <p className="font-medium mb-2">Furniture</p>
                <p className="text-gray-600">{house.furnitures}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {onBook && (
              <Button onClick={() => onBook(house)} className="flex-1">
                Book This Property
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HouseDetailsModal;
