import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiErrorInfo {
  statusCode: number;
  category:
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'SERVICE_UNAVAILABLE'
    | 'CLIENT_ERROR'
    | 'UNKNOWN';
  message: string;
  code?: string;
  referenceId?: string;
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('bp_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor to handle responses and classify errors accurately
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;

    let category: ApiErrorInfo['category'] = 'UNKNOWN';
    let friendlyMessage = 'An unexpected error occurred.';

    switch (status) {
      case 401:
        category = 'UNAUTHORIZED';
        friendlyMessage = responseData?.message || 'Authentication required. Please sign in to continue.';
        if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/') {
          localStorage.removeItem('bp_token');
          localStorage.removeItem('bp_user');
          window.location.href = '/login?expired=1';
        }
        break;

      case 403:
        category = 'FORBIDDEN';
        friendlyMessage =
          responseData?.message ||
          "Access restricted. Your current account doesn't have permission to access this resource.";
        break;

      case 404:
        category = 'NOT_FOUND';
        friendlyMessage = responseData?.message || 'The requested resource could not be found.';
        break;

      case 500:
        category = 'SERVER_ERROR';
        friendlyMessage =
          responseData?.message ||
          "We couldn't complete your request due to an internal server issue. Please try again.";
        break;

      case 503:
        category = 'SERVICE_UNAVAILABLE';
        friendlyMessage =
          responseData?.message ||
          'Brownie Points is temporarily unavailable. Please try again shortly.';
        break;

      default:
        if (status >= 400 && status < 500) {
          category = 'CLIENT_ERROR';
          friendlyMessage = responseData?.message || 'Invalid request.';
        } else if (status >= 500) {
          category = 'SERVER_ERROR';
          friendlyMessage = 'Server error. Please try again later.';
        }
    }

    const apiErrorInfo: ApiErrorInfo = {
      statusCode: status || 0,
      category,
      message: friendlyMessage,
      code: responseData?.code,
      referenceId: responseData?.referenceId,
    };

    // Attach categorized error to error object
    error.apiErrorInfo = apiErrorInfo;

    return Promise.reject(error);
  },
);

export default api;
