import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { House } from '@/types/api'; // Make sure this type is updated

import { MapPin, Bed, DollarSign } from 'lucide-react';

interface HouseCardProps {
  house: House;
  id?: number; // `id` is part of `house` object, so not strictly needed as separate prop
  onView?: (house: House) => void;
  onBook?: (house: House) => void;
  onEdit?: (house: House) => void;
  onDelete?: (house: House) => void;
  showBookButton?: boolean;
  showOwnerActions?: boolean;
  // image_url?: string; // This prop is redundant if it's part of the 'house' object
}

const HouseCard: React.FC<HouseCardProps> = ({
  house,
  onView,
  onBook,
  onEdit,
  onDelete,
  showBookButton = false,
  showOwnerActions = false
}) => {
  // Define a fallback image URL. This path should be relative to your React app's public folder.
  const defaultHouseImage = '/images/default_house.jpg'; // Make sure you have this image in your public/images folder

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Error loading image:", e.currentTarget.src, e);
    // Set a fallback image on error
    e.currentTarget.src = defaultHouseImage;
    // Optionally, prevent further attempts to load if the fallback itself fails
    e.currentTarget.onerror = null;
  };

  // Determine the image source: use house.image_url if available, otherwise use default
const imageUrlToDisplay = house.image_url || '/images/default_house.jpg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
            <img
        src={imageUrlToDisplay}
        alt="House"
        onError={handleError}
        className="w-full h-full object-cover"
      />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{house.house_type}</h3>

          <div className="flex items-start text-gray-600">
            <MapPin className="h-4 w-4 mt-0.5 mr-1 flex-shrink-0" />
            <span className="text-sm">{house.address}, {house.house_city}, {house.house_state}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{house.rooms} rooms</span>
            </div>
            <div className="flex items-center font-bold text-lg text-green-600">
              <DollarSign className="h-4 w-4" />
              <span>{house.price}</span>
            </div>
          </div>

          {house.descriptions && ( // Changed from descriptions to description based on your resource
            <p className="text-gray-600 text-sm line-clamp-2">{house.descriptions}</p>
          )}

          <div className="flex gap-2 pt-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(house)}>
                View Details
              </Button>
            )}

            {showBookButton && onBook && (
              <Button size="sm" onClick={() => onBook(house)}>
                Book Now
              </Button>
            )}

            {showOwnerActions && (
              <>
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(house)}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button variant="destructive" size="sm" onClick={() => onDelete(house)}>
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HouseCard;