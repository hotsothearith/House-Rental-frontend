export interface User {
  id: number;
  email_address?: string;
  full_name?: string; // Used for Tenant's full name
  owner_name?: string; // Used for HouseOwner's name
  username?: string;
  mobile_number?: string;
  address?: string;
}

export interface House {
  id: number;
  address: string;
  house_city: string;
  house_district: string;
  house_state: string;
  descriptions?: string;
  price: number;
  house_type: string;
  rooms: number;
  furnitures?: string;
  variation?: string;
  image?: string;
  house_owner_id: number;
  houseOwner?: User; // Relationship for the house owner
  image_url?: string;
}

export interface Booking {
  id: number;
  house_id: number;
  tenant_email: string; // This might become a nested tenant object in a resource
  from_date: string;
  to_date: string;
  duration?: string;
  message?: string;
  status: number;
  booking_number: number;
  house?: House; // Nested house details
  tenant?: User; // Nested tenant details
}

export interface Payment {
  id: number;
  house_id: number;
  house_owner_id: number;
  user_email: string; // This might also become a nested user/tenant/house_owner object
  details?: string;
  date_payment: string;
}

// **--- CORRECTED FEEDBACK INTERFACE ---**
export interface Feedback {
  id: number;
  message: string; // Changed from 'comment' to 'message' to match Laravel resource
  rating?: number;
  
  // These fields are expected from the Laravel FeedbackResource's 'whenLoaded' logic
  tenant_full_name?: string; // Full name of the tenant who left feedback
  house_address?: string;   // Address of the house the feedback is for

  // Add these if your FeedbackResource also includes them directly,
  // otherwise, they might be derived or unnecessary on the frontend for house owner feedback.
  // user_id?: number; // The ID of the user (tenant) who left feedback
  // house_id?: number; // The ID of the house the feedback is for
  
  // Dates from Laravel resource
  created_at?: string;
  updated_at?: string;
}

export interface Agreement {
  id: number;
  booking_no: number; // This might be 'booking_id' in Laravel and then accessed via `booking->booking_no`
  house_id: number;
  house_owner_id: number;
  user_email: string; // This might be `tenant->email_address` in the resource
  admin_id?: number | null;
  remember?: string | null;
  created_at?: string;
  updated_at?: string;

  // Nested relationships - These look good as they match common Laravel resource practices
  booking?: Booking; // Made optional as `whenLoaded` might make them null
  house?: House;     // Made optional
  house_owner?: User; // Made optional
  tenant?: User;     // Made optional
}

export interface AuthResponse {
  message: string;
  access_token?: string;
  token?: string; // Sometimes 'token' is used instead of 'access_token'
  token_type: string;
  tenant?: User;
  house_owner?: User;
  administrator?: User;
}

export interface ApiResponse<T> {
  success?: boolean; // Often included in Laravel API responses
  data: T;
  message?: string; // Often included for single responses or errors
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export type UserRole = 'tenant' | 'house_owner' | 'administrator';