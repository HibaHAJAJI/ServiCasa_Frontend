import api from "./axios";

const serviceArtisanService = {

  create: async (data) => {
    const response = await api.post("/services-artisan", data);
    return response.data;
  },

  getByArtisan: async (artisanId) => {
    const response = await api.get(`/services-artisan/artisan/${artisanId}`);
    return response.data;
  },

  getMyServices: async () => {
    const response = await api.get("/services-artisan/mes-services");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/services-artisan/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/services-artisan/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/services-artisan/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
};

export default serviceArtisanService;