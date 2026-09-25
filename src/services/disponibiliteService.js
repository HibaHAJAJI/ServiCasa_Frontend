import api from "./axios";

const disponibiliteService = {

  getAll: async (page = 0, size = 20) => {
    const response = await api.get(`/disponibilites?page=${page}&size=${size}`);
    return response.data;
  },

  getByArtisan: async (artisanId) => {
    const response = await api.get(`/disponibilites/artisan/${artisanId}`);
    return response.data;
  },

  getByArtisanAndDate: async (artisanId, date) => {
    const response = await api.get(`/disponibilites/artisan/${artisanId}/date/${date}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/disponibilites", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/disponibilites/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/disponibilites/${id}`);
  },

};

export default disponibiliteService;