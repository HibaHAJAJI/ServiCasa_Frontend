import api from "./axios";

const artisanDashboardService = {

  getDashboard: async (artisanId) => {
    const response = await api.get("/dashboards/artisan", { params: { artisanId },});
    return response.data;
  },
};

export default artisanDashboardService;