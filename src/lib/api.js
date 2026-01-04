// API Configuration and Utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with authentication
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// API request wrapper
export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body, includeAuth = true, isFormData = false } = options;

  const config = {
    method,
    headers: isFormData ? {} : getHeaders(includeAuth),
  };

  // Add Authorization header for FormData
  if (isFormData && includeAuth) {
    const token = getAuthToken();
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`
      };
    }
  }

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
    includeAuth: false,
  }),

  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
    includeAuth: false,
  }),

  getProfile: () => apiRequest('/auth/profile'),

  updateProfile: (data) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: data,
  }),

  getUserStats: () => apiRequest('/auth/stats'),
};

// Jobs API
export const jobsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/jobs${queryString ? `?${queryString}` : ''}`, {
      includeAuth: false,
    });
  },

  getById: (id) => apiRequest(`/jobs/${id}`, {
    includeAuth: false,
  }),

  create: (jobData) => apiRequest('/jobs', {
    method: 'POST',
    body: jobData,
  }),

  update: (id, jobData) => apiRequest(`/jobs/${id}`, {
    method: 'PUT',
    body: jobData,
  }),

  delete: (id) => apiRequest(`/jobs/${id}`, {
    method: 'DELETE',
  }),

  getRecruiterJobs: () => apiRequest('/jobs/recruiter/my-jobs'),
};

// Applications API
export const applicationsAPI = {
  submit: (applicationData) => apiRequest('/applications', {
    method: 'POST',
    body: applicationData,
  }),

  getMy: () => apiRequest('/applications/my-applications'),

  getForJob: (jobId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/applications/job/${jobId}${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiRequest(`/applications/${id}`),

  updateStatus: (id, statusData) => apiRequest(`/applications/${id}/status`, {
    method: 'PUT',
    body: statusData,
  }),

  withdraw: (id) => apiRequest(`/applications/${id}`, {
    method: 'DELETE',
  }),
};

// CV API
export const cvAPI = {
  upload: (formData) => apiRequest('/cv/upload', {
    method: 'POST',
    body: formData,
    isFormData: true,
  }),

  match: (jobId, formData) => apiRequest(`/cv/match/${jobId}`, {
    method: 'POST',
    body: formData,
    isFormData: true,
  }),

  analyze: (cvData) => apiRequest('/cv/analyze', {
    method: 'POST',
    body: cvData,
  }),

  uploadProfilePicture: (formData) => apiRequest('/cv/profile-picture', {
    method: 'POST',
    body: formData,
    isFormData: true,
  }),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/notifications${queryString ? `?${queryString}` : ''}`);
  },

  getUnreadCount: () => apiRequest('/notifications/unread-count'),

  markAsRead: (id) => apiRequest(`/notifications/${id}/read`, {
    method: 'PUT',
  }),

  markAllAsRead: () => apiRequest('/notifications/read-all', {
    method: 'PUT',
  }),

  delete: (id) => apiRequest(`/notifications/${id}`, {
    method: 'DELETE',
  }),

  deleteAll: () => apiRequest('/notifications/all', {
    method: 'DELETE',
  }),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message, conversationHistory = []) => apiRequest('/chatbot/chat', {
    method: 'POST',
    body: { message, conversationHistory },
  }),
};

// Admin API
export const adminAPI = {
  getStats: () => apiRequest('/admin/stats'),

  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  updateUser: (userId, updates) => apiRequest(`/admin/users/${userId}`, {
    method: 'PUT',
    body: updates,
  }),

  deleteUser: (userId) => apiRequest(`/admin/users/${userId}`, {
    method: 'DELETE',
  }),

  getJobs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/jobs${queryString ? `?${queryString}` : ''}`);
  },

  updateJob: (jobId, updates) => apiRequest(`/admin/jobs/${jobId}`, {
    method: 'PUT',
    body: updates,
  }),

  deleteJob: (jobId) => apiRequest(`/admin/jobs/${jobId}`, {
    method: 'DELETE',
  }),

  broadcast: (message) => apiRequest('/admin/broadcast', {
    method: 'POST',
    body: message,
  }),
};

export default {
  auth: authAPI,
  jobs: jobsAPI,
  applications: applicationsAPI,
  cv: cvAPI,
  notifications: notificationsAPI,
  chatbot: chatbotAPI,
  admin: adminAPI,
};

