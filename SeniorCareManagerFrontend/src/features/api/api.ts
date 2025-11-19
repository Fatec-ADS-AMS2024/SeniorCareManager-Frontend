import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse } from './types';

// Centraliza a configuração do axios na aplicação
// Em desenvolvimento, usa o proxy do Vite (/api) para evitar CORS
// Em produção, usa a URL completa do backend
const baseURL = import.meta.env.DEV 
  ? '/api/v1/' 
  : 'https://localhost:7053/api/v1/';

const axiosInstance = axios.create({
  baseURL,
  validateStatus: function (status) {
    // Aceita todos os status codes para que possamos tratar no interceptor
    return status >= 200 && status < 600;
  },
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

// Interceptor de resposta para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => {
    // Se for 404 em endpoints que podem não ter dados, tratar como sucesso vazio
    const status = response.status;
    const config = response.config || {};
    const requestUrl = config.url || '';
    const baseUrl = config.baseURL || '';
    const fullUrl = (baseUrl + requestUrl).toLowerCase();
    const method = (config.method || '').toLowerCase();
    
    if (status === 404 && method === 'get') {
      const suppressPatterns = ['/allergies', '/relatives'];
      const shouldSuppress = suppressPatterns.some(pattern => 
        fullUrl.includes(pattern.toLowerCase())
      );
      
      if (shouldSuppress) {
        return {
          ...response,
          data: {
            success: false,
            message: 'Nenhum dado encontrado',
            data: [],
          },
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<ApiResponse<any>>;
      }
    }
    
    return response;
  },
  (error) => {
    const config = error.config || {};
    const requestUrl = config.url || '';
    const baseUrl = config.baseURL || '';
    const fullUrl = (baseUrl + requestUrl).toLowerCase();
    const method = (config.method || '').toLowerCase();
    const status = error.response?.status;
    
    // Tratar 404 de endpoints que podem não ter dados
    if (status === 404 && method === 'get') {
      const suppressPatterns = ['/allergies', '/relatives'];
      const shouldSuppress = suppressPatterns.some(pattern => 
        fullUrl.includes(pattern.toLowerCase())
      );
      
      if (shouldSuppress) {
        const mockResponse = {
          data: {
            success: false,
            message: 'Nenhum dado encontrado',
            data: [],
          },
          status: 200,
          statusText: 'OK',
          headers: error.response?.headers || {},
          config: config,
          request: error.request,
        };
        
        return Promise.resolve(mockResponse as AxiosResponse<ApiResponse<any>>);
      }
    }
    
    return Promise.reject(error);
  }
);

// Exporta um encapsulamento para uso na aplicação
const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.get(url, config);
      return response as AxiosResponse<ApiResponse<T>>;
    } catch (error: any) {
      // Se for 404 em endpoints que podem não ter dados, retornar resposta vazia silenciosamente
      const fullUrl = ((config?.baseURL || baseURL) + url).toLowerCase();
      const is404 = error?.response?.status === 404;
      const suppressPatterns = ['/allergies', '/relatives'];
      const shouldSuppress = is404 && suppressPatterns.some(pattern => 
        fullUrl.includes(pattern.toLowerCase())
      );
      
      if (shouldSuppress) {
        return {
          data: {
            success: false,
            message: 'Nenhum dado encontrado',
            data: [],
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config || {},
        } as AxiosResponse<ApiResponse<T>>;
      }
      
      throw error;
    }
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
