import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
    headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (status === 403) {
      console.error("Erreur 403: Accès refusé (Droits insuffisants)");
    } else if (status === 400) {
      console.error("Erreur 400: Requête invalide");
    } else if (status >= 500) {
      console.error("Erreur 500: Erreur serveur interne");
    }

    return Promise.reject(error);
  }

  
);
export default api
