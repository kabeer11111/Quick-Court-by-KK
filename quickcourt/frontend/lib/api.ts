// In lib/api.ts - Fix API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const request = async (endpoint: string, method: string = 'GET', body: any = null, isFormData: boolean = false) => {
  const headers: HeadersInit = {};
  
  const token = localStorage.getItem('quickcourt_token'); // Match your token key
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (isFormData) {
      config.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An API error occurred');
    }

    return data;
  } catch (error: any) {
    console.error(`API Error on ${method} ${endpoint}:`, error);
    throw new Error(error.message || "Network error or server is unreachable.");
  }
};

export const api = {
  // AUTH - Fixed endpoints
  register: (data: any) => request('/auth/signup', 'POST', data), // Fixed
  verifyOtp: (data: any) => request('/auth/verify-otp', 'POST', data),
  login: (data: any) => request('/auth/login', 'POST', data),
  
  // AVATAR
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request('/users/avatar', 'POST', formData, true);
  },
  
  // BOOKINGS - Real database operations
  createBooking: (data: any) => request('/bookings', 'POST', data),
  getMyBookings: () => request('/bookings/my-bookings'),
  
  // VENUES
  getVenues: (filters: any = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/venues${query ? `?${query}` : ''}`);
  },
  getVenueDetails: (id: string) => request(`/venues/${id}`),
  
  // OWNER
  createVenue: (data: any) => request('/venues', 'POST', data),
  getMyVenues: () => request('/venues/my-venues'),
  
  // ADMIN
  getPendingVenues: () => request('/admin/venues/pending'),
  approveVenue: (id: string, data: any) => request(`/admin/venues/${id}/status`, 'PATCH', data),
};
