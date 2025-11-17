// API Configuration
// Change this URL based on your environment
// Development: http://localhost:5000
// Production: https://schedulink-backend.onrender.com

export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  events: `${API_BASE_URL}/api/events`,
  eventConflicts: `${API_BASE_URL}/api/events/check-conflicts`,
  notifications: `${API_BASE_URL}/api/notifications`,
  resources: `${API_BASE_URL}/api/resources`,
  venues: `${API_BASE_URL}/api/venues`,
  tasks: `${API_BASE_URL}/api/tasks`,
  reports: `${API_BASE_URL}/api/reports`,
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    admins: `${API_BASE_URL}/api/auth/admins`,
  },
  sse: `${API_BASE_URL}/api/sse`,
};
