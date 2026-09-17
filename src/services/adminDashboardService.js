import api from "./axios";

const adminDashboardService ={

      getDashboard: async () => {
    const response = await api.get("/dashboard/admin");
    return response.data;
  },
}
export default adminDashboardService;