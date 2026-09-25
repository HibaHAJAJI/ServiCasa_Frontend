import api from "./axios";

const paiementService = {
  getAll: async () => {
    const response = await api.get("/paiements");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/paiements/${id}`);
    return response.data;
  },

  getByReservation: async (reservationId) => {
    try {
      const response = await api.get(`/paiements/reservation/${reservationId}`);
      if (response.status === 204 || !response.data) {
        return null;
      }
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404 || status === 204) {
        return null;
      }
      if (status >= 500) {
        throw error;
      }
      if (status === 401 || status === 403) {
        throw error;
      }
      throw error;
    }
  },

  create: async (data) => {
    const response = await api.post("/paiements", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/paiements/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    await api.delete(`/paiements/${id}`);
  },

  count: async () => {
    const response = await api.get("/paiements/count");
    return response.data;
  },
};

export default paiementService;
