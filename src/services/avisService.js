import api from "./axios";

const avisService = {

  createAvis: async (data) => {
    const response = await api.post("/avis", data);
    return response.data;
  },

  getAvisByArtisan: async (artisanId, page = 0, size = 10) => {
    const response = await api.get(`/avis/artisan/${artisanId}?page=${page}&size=${size}`);
    return response.data;
  },

  getMoyenneArtisan: async (artisanId) => {
    const response = await api.get(`/avis/artisan/${artisanId}/moyenne`);
    return response.data;
  },

  getNombreAvisArtisan: async (artisanId) => {
    const response = await api.get(`/avis/artisan/${artisanId}/count`);
    return response.data;
  },

  getAvisByReservation: async (reservationId) => {
    const response = await api.get(`/avis/reservation/${reservationId}`);
    return response.data;
  },

  checkAvisExists: async (reservationId) => {
    const response = await api.get(`/avis/reservation/${reservationId}/exists`);
    return response.data;
  },

};

export default avisService;