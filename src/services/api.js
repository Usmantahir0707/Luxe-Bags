// API service for Luxe Bags
const BASE_URL = import.meta.env.VITE_BASEURL;

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function to create headers with auth
const getAuthHeaders = (contentType = 'application/json') => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': contentType,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(options.contentType),
    ...options,
  };

  try {
    console.log('Making API call to:', url, 'with config:', { ...config, headers: config.headers });
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        // If JSON parsing fails, try to get text content
        const textContent = await response.text();
        console.error('Raw response text:', textContent);
        throw new Error(`Invalid JSON response: ${textContent.substring(0, 200)}`);
      }
    } else {
      // Handle non-JSON responses
      const textContent = await response.text();
      console.warn('Non-JSON response received:', textContent.substring(0, 200));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${textContent || response.statusText}`);
      }
      // For successful non-JSON responses, return as text
      return textContent;
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`;
      console.error('API error response:', { status: response.status, data });
      throw new Error(errorMessage);
    }

    console.log('API call successful, response:', data);
    return data;
  } catch (error) {
    console.error('API call failed:', {
      endpoint,
      url,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Auth API
export const authAPI = {
  // Register user
  register: (userData) => apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Verify email
  verifyEmail: (token) => apiCall('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),

  // Resend verification email
  resendVerification: (email) => apiCall('/api/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Login user
  login: (credentials) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Get current user
  getCurrentUser: () => apiCall('/api/auth/me'),

  // Update current user
  updateUser: (userData) => apiCall('/api/auth/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  // Delete current user
  deleteUser: () => apiCall('/api/auth/me', {
    method: 'DELETE',
  }),

  // Google OAuth (redirect handled by backend)
  googleLogin: () => window.location.href = `${BASE_URL}/api/auth/google`,

  // Facebook OAuth (redirect handled by backend)
  facebookLogin: () => window.location.href = `${BASE_URL}/api/auth/facebook`,

  // Forgot Password
  forgotPassword: (email) => apiCall('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Reset Password
  resetPassword: (token, password) => apiCall('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  }),
};
// Products API
export const productsAPI = {
  // Get all products (with optional query params)
  getAllProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
    return apiCall(endpoint);
  },

  // Get single product
  getProduct: (id) => apiCall(`/api/products/${id}`),

  // Create product (admin only)
  createProduct: (productData) => apiCall('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  // Update product (admin only)
  updateProduct: (id, productData) => apiCall(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),

  // Delete product (admin only)
  deleteProduct: (id) => apiCall(`/api/products/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  // Create order
  createOrder: (orderData) => apiCall('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  // Get order by ID
  getOrder: (id) => apiCall(`/api/orders/${id}`),

  // Cancel order (customer)
  cancelOrder: (id) => apiCall(`/api/orders/${id}/cancel`, {
    method: 'PUT',
  }),

  // Get all orders (admin only)
  getAllOrders: () => apiCall('/api/orders'),

  // Update order status (admin only)
  updateOrderStatus: (id, statusData) => apiCall(`/api/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),

  // Cancel order (admin only)
  adminCancelOrder: (id) => apiCall(`/api/orders/${id}/admin-cancel`, {
    method: 'PUT',
  }),
};

// Upload API
export const uploadAPI = {
  // Upload image (admin only)
  uploadImage: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return apiCall('/api/uploads', {
      method: 'POST',
      body: formData,
      contentType: null, // Let browser set multipart/form-data
    });
  },
};

// Auth utilities
export const authUtils = {
  // Store token
  setToken: (token) => localStorage.setItem('token', token),

  // Get token
  getToken: () => localStorage.getItem('token'),

  // Remove token
  removeToken: () => localStorage.removeItem('token'),

  // Check if user is authenticated
  isAuthenticated: () => !!getAuthToken(),

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    // Optional: redirect to login or home
  },
};
