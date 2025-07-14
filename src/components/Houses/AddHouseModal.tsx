import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api'; // Ensure this path is correct
import { useToast } from '@/hooks/use-toast';

interface AddHouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHouseAdded: () => void;
}

const AddHouseModal: React.FC<AddHouseModalProps> = ({ isOpen, onClose, onHouseAdded }) => {
  const [houseData, setHouseData] = useState({
    address: '',
    house_city: '',
    house_district: '',
    house_state: '',
    descriptions: '',
    price: '',
    house_type: '',
    rooms: '',
    furnitures: '',
    variation: '',
    image: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected image file
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setHouseData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!houseData.address || !houseData.house_city || !houseData.price || !houseData.house_type || !houseData.rooms) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    // Append all text fields
    formData.append('address', houseData.address);
    formData.append('house_city', houseData.house_city);
    formData.append('house_district', houseData.house_district);
    formData.append('house_state', houseData.house_state);
    formData.append('descriptions', houseData.descriptions);
    formData.append('price', parseFloat(houseData.price).toString()); // Ensure numbers are strings for FormData
    formData.append('house_type', houseData.house_type);
    formData.append('rooms', parseInt(houseData.rooms).toString()); // Ensure numbers are strings for FormData
    formData.append('furnitures', houseData.furnitures);
    formData.append('variation', houseData.variation);

    // Append the selected image file
    if (selectedFile) {
      formData.append('image', selectedFile, selectedFile.name);
    }

    try {
      await apiClient.createHouse(formData); // Call API with FormData

      toast({
        title: "Success",
        description: "House added successfully!"
      });

      // Reset form data and selected file state
      setHouseData({
        address: '',
        house_city: '',
        house_district: '',
        house_state: '',
        descriptions: '',
        price: '',
        house_type: '',
        rooms: '',
        furnitures: '',
        variation: '',
        image: '',
      });
      setSelectedFile(null); // Reset the file input visually

          const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      onHouseAdded(); // Trigger re-fetch of houses
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add house:", error);
      toast({
        title: "Error",
        description: `Failed to add house: ${(error as Error).message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New House</DialogTitle>
          <DialogDescription>
            Fill in the details for your new property listing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={houseData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter property address"
                required
              />
            </div>
            <div>
              <Label htmlFor="house_city">City *</Label>
              <Input
                id="house_city"
                value={houseData.house_city}
                onChange={(e) => handleInputChange('house_city', e.target.value)}
                placeholder="Enter city"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="house_district">District</Label>
              <Input
                id="house_district"
                value={houseData.house_district}
                onChange={(e) => handleInputChange('house_district', e.target.value)}
                placeholder="Enter district"
              />
            </div>
            <div>
              <Label htmlFor="house_state">State</Label>
              <Input
                id="house_state"
                value={houseData.house_state}
                onChange={(e) => handleInputChange('house_state', e.target.value)}
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="house_type">House Type *</Label>
              <Select value={houseData.house_type} onValueChange={(value) => handleInputChange('house_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rooms">Number of Rooms *</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={houseData.rooms}
                onChange={(e) => handleInputChange('rooms', e.target.value)}
                placeholder="e.g., 3"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price per Month ($) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={houseData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="e.g., 1200"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descriptions">Description</Label>
            <Textarea
              id="descriptions"
              value={houseData.descriptions}
              onChange={(e) => handleInputChange('descriptions', e.target.value)}
              placeholder="Describe your property..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="furnitures">Furniture Details</Label>
            <Textarea
              id="furnitures"
              value={houseData.furnitures}
              onChange={(e) => handleInputChange('furnitures', e.target.value)}
              placeholder="List available furniture..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="variation">Variation</Label>
              <Input
                id="variation"
                value={houseData.variation}
                onChange={(e) => handleInputChange('variation', e.target.value)}
                placeholder="e.g., Balcony, Garden"
              />
            </div>
            <div>
              <Label htmlFor="image">House Image</Label>
              <Input
                id="image"
                type="file" // Changed type to file
                accept="image/jpeg,image/png,image/gif,image/svg+xml" // Specify accepted file types
                onChange={handleFileChange} // Added file change handler
              />
              {selectedFile && (
                <p className="text-sm text-gray-500 mt-1">Selected: {selectedFile.name}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Adding...' : 'Add House'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHouseModal;