import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                refreshToken
              });

              const { token, refreshToken: newRefreshToken } = refreshResponse.data;
              localStorage.setItem('token', token);
              localStorage.setItem('refreshToken', newRefreshToken);

              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              this.logout();
            }
          } else {
            this.logout();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }

  get(endpoint) {
    return this.client.get(endpoint);
  }

  post(endpoint, data) {
    return this.client.post(endpoint, data);
  }

  put(endpoint, data) {
    return this.client.put(endpoint, data);
  }

  patch(endpoint, data) {
    return this.client.patch(endpoint, data);
  }

  delete(endpoint) {
    return this.client.delete(endpoint);
  }
}

export default new ApiClient();
