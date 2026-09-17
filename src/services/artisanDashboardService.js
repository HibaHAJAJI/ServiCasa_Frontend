import api from "./axios";

const artisanDashboardService = {

  getDashboard: async () => {
    const response = await api.get("/dashboard/artisan");
    return response.data;
  },
};

export default artisanDashboardService;