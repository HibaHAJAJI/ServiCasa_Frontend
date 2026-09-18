import api from "./axios";

const adminDashboardService ={

      getDashboard: async () => {
    const response = await api.get("/dashboard/admin");
    return response.data;
  },

 getPendingArtisans: async (page = 0, size = 10) => {
    const response = await api.get(`/dashboard/admin/pending?page=${page}&size=${size}`);
    return response.data;
  },

  updateArtisanStatus: async (id, statut) => {
    const response = await api.put(`/dashboard/admin/${id}/status?statut=${statut}`);
    return response.data;
  }
  
}
export default adminDashboardService;