import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ApiError {
  message?: string;
  status?: number;
}

function forceLogout() {
  localStorage.removeItem('neuron_token');
  localStorage.removeItem('neuron_user');
  window.location.href = '/login';
}

export class ApiErrorHandler {
  static handle(error: AxiosError) {
    const apiError = error.response?.data as ApiError;
    const status = error.response?.status;

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        toast.error(apiError?.message || 'Bad request. Please check your input.');
        break;

      case 401:
        toast.error(apiError?.message || 'Session expired. Please log in again.');
        forceLogout();
        break;

      case 403:
        toast.error(apiError?.message || "You don't have permission to access this resource");
        break;

      case 404:
        toast.error('Requested resource not found.');
        break;

      case 500:
        toast.error('Server error. Please try again later.');
        break;

      default:
        toast.error(apiError?.message || 'An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
}
