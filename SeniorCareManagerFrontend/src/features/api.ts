import axios from "axios";
import Cookies from "js-cookie";

// Centraliza a configuração do axios na aplicação
const api = axios.create({
  baseURL: "https://localhost:7053/api/v1/",
});

// Interceptor para adicionar o token JWT a cada requisição
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
