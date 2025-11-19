import axios from "axios";
import { refreshToken } from "../utils/auth";

const api = axios.create({
  baseURL: "https://douceurwebback.onrender.com/api", // URL del backend
  //baseURL: "http://localhost:8000/api", // URL del backend en desarrollo
  headers: {
    "Content-Type": "application/json"
  }
});
// Interceptor para añadir el token a las solicitudes
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores 401 (token expirado)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        // Asegurarse de que el token se actualice en localStorage
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error al refrescar el token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Método para obtener todos los productos (endpoint público)
// Obtener todos los productos: usar el endpoint público que existe en el backend.
// El backend expone `catalogo-productos/` que devuelve una lista plana de productos.
export const getTodosProductos = () => api.get("catalogo-productos/");
