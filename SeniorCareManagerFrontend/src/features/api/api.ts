import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse } from './types';

// Centraliza a configuração do axios na aplicação
const axiosInstance = axios.create({
  baseURL: 'https://localhost:7053/api/v1/',
});

// Interceptor para adicionar o token JWT a cada requisição
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exporta um encapsulamento para uso na aplicação
const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    return (await axiosInstance.get(url, config)) as AxiosResponse<
      ApiResponse<T>
    >;
  },
  post: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    return (await axiosInstance.post(url, data, config)) as AxiosResponse<
      ApiResponse<T>
    >;
  },
  put: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    return (await axiosInstance.put(url, data, config)) as AxiosResponse<
      ApiResponse<T>
    >;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    return (await axiosInstance.delete(url, config)) as AxiosResponse<
      ApiResponse<T>
    >;
  },
  patch: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    return (await axiosInstance.patch(url, data, config)) as AxiosResponse<
      ApiResponse<T>
    >;
  },
};

export default api;
