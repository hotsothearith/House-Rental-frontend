import { AuthResponse, House, Booking, Payment, Feedback, ApiResponse, User } from '@/types/api';

const API_BASE_URL = 'http://localhost:8000/api'; // !! Make sure this matches your Laravel API URL

class ApiClient {
  private getAuthHeaders(isFormData: boolean = false) {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    // Crucial: DO NOT set Content-Type for FormData requests.
    // The browser will automatically set 'Content-Type: multipart/form-data' with the correct boundary.
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Determine if the request body is FormData
    const isFormData = options?.body instanceof FormData;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(isFormData), // Pass the isFormData flag
        ...options?.headers, // Allow overriding headers for specific requests if needed
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error or non-JSON response' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle responses that might be empty (e.g., successful DELETE)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // For non-JSON responses (like 204 No Content), return an empty object or null
      return {} as T;
    }
  }

  // --- Authentication ---
  async login(userType: 'tenant' | 'house-owner' | 'admin', credentials: any): Promise<AuthResponse> {
    return this.request<AuthResponse>(`/${userType}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userType: 'tenant' | 'house-owner', userData: any): Promise<AuthResponse> {
    return this.request<AuthResponse>(`/${userType}/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(userType: 'tenant' | 'house-owner' | 'admin'): Promise<void> {
    return this.request<void>(`/${userType}/logout`, {
      method: 'POST',
    });
  }

  // --- Houses - Public endpoints ---
  async getHouses(filters?: Record<string, string>): Promise<ApiResponse<House[]>> {
    const cleanFilters: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          cleanFilters[key] = value;
        }
      });
    }

    const queryParams = new URLSearchParams(cleanFilters).toString();
    const endpoint = queryParams ? `/houses?${queryParams}` : '/houses';
    return this.request<ApiResponse<House[]>>(endpoint);
  }

  async getHouse(id: number): Promise<House> {
    return this.request<House>(`/houses/${id}`);
  }

  // --- Houses - House Owner endpoints (Modified for FormData) ---
  async createHouse(houseData: FormData): Promise<House> { // Accepts FormData
    return this.request<House>('/houses', {
      method: 'POST',
      body: houseData, // Directly pass FormData
    });
  }

  async updateHouse(id: number, houseData: FormData): Promise<House> { // Accepts FormData
    // Laravel expects _method: 'PUT' or 'PATCH' in FormData for PUT/PATCH requests
    return this.request<House>(`/houses/${id}`, {
      method: 'POST', // Send as POST, _method will handle verb
      body: houseData,
    });
  }

  async deleteHouse(id: number): Promise<void> {
    return this.request<void>(`/houses/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Bookings - Public endpoints ---
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<ApiResponse<Booking[]>>('/bookings');
  }

  async getBooking(id: number): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`);
  }

  // --- Bookings - Tenant endpoints ---
  async createBooking(bookingData: any): Promise<Booking> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(id: number, bookingData: any): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  async deleteBooking(id: number): Promise<void> {
    return this.request<void>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // --- House Owner specific endpoints ---
  async getHouseOwnerBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<ApiResponse<Booking[]>>('/house-owner/bookings');
  }

  async updateBookingStatus(id: number, status: number): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getHouseOwnerAgreements(): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>('/house-owner/agreements');
  }

  async getHouseOwnerPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<ApiResponse<Payment[]>>('/house-owner/payments');
  }
async getHouseOwnerFeedback(): Promise<ApiResponse<Feedback[]>> {
    return this.request<ApiResponse<Feedback[]>>('/house-owner/feedback'); // Corrected type
  }
  // --- Payments - Tenant endpoints ---
  async createPayment(paymentData: any): Promise<Payment> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getTenantPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<ApiResponse<Payment[]>>('/tenant/payments');
  }

  async getPayment(id: number): Promise<Payment> {
    return this.request<Payment>(`/payments/${id}`);
  }

  async updatePayment(id: number, paymentData: any): Promise<Payment> {
    return this.request<Payment>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id: number): Promise<void> {
    return this.request<void>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Feedback - Tenant endpoints ---
  async createFeedback(feedbackData: any): Promise<Feedback> {
    return this.request<Feedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async getFeedback(id: number): Promise<Feedback> {
    return this.request<Feedback>(`/feedback/${id}`);
  }

  // --- Administrator specific endpoints ---
  async getAdminHouses(): Promise<ApiResponse<House[]>> {
    return this.request<ApiResponse<House[]>>('/admin/houses');
  }

  async getAdminBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<ApiResponse<Booking[]>>('/admin/bookings');
  }

  async getAdminPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<ApiResponse<Payment[]>>('/admin/payments');
  }

  async getAdminFeedback(): Promise<ApiResponse<Feedback[]>> {
    return this.request<ApiResponse<Feedback[]>>('/admin/feedback');
  }

  async getAdminTenants(): Promise<ApiResponse<User[]>> {
    return this.request<ApiResponse<User[]>>('/admin/tenants');
  }

  async getAdminHouseOwners(): Promise<ApiResponse<User[]>> {
    return this.request<ApiResponse<User[]>>('/admin/house-owners');
  }

  async deleteAdminHouse(id: number): Promise<void> {
    return this.request<void>(`/admin/houses/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Agreements - Admin endpoints ---
  async createAgreement(agreementData: any): Promise<any> {
    return this.request<any>('/agreements', {
      method: 'POST',
      body: JSON.stringify(agreementData),
    });
  }

  async getAgreements(): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>('/agreements');
  }

  async getAgreement(id: number): Promise<any> {
    return this.request<any>(`/agreements/${id}`);
  }

  async updateAgreement(id: number, agreementData: any): Promise<any> {
    return this.request<any>(`/agreements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agreementData),
    });
  }

  async deleteAgreement(id: number): Promise<void> {
    return this.request<void>(`/agreements/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();