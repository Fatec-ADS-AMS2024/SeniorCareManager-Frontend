import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse } from './types';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7053/api/v1/',
});

let activeRequests = 0;

const dispatchLoadingEvent = (isLoading: boolean) => {
  window.dispatchEvent(new CustomEvent('api-loading', { detail: { isLoading } }));
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (activeRequests === 0) {
      dispatchLoadingEvent(true);
    }
    activeRequests++;

    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      dispatchLoadingEvent(false);
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) {
      dispatchLoadingEvent(false);
    }
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      dispatchLoadingEvent(false);
    }
    return Promise.reject(error);
  }
);

const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.get(url, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
  post: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.post(url, data, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
  put: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.put(url, data, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.delete(url, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
  patch: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.patch(url, data, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
};

export default api;