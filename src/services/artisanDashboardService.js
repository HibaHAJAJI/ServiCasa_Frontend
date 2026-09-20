import api from "./axios";

const artisanDashboardService = {

  getDashboard: async () => {
    const response = await api.get("/dashboard/artisan");
    return response.data;
  },
  
    findBySpecialite: async (specialite, page = 0, size = 20) => {
    const response = await api.get(
      `/artisans/specialite?specialite=${encodeURIComponent(specialite)}&page=${page}&size=${size}`
    );
    return response.data;
  },

  findByVille: async (ville, page = 0, size = 20) => {
    const response = await api.get(
      `/artisans/ville?ville=${encodeURIComponent(ville)}&page=${page}&size=${size}`
    );
    return response.data;
  },
};

export default artisanDashboardService;