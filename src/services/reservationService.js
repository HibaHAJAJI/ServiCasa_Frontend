import api from "./axios";

const reservationService = {

  getPendingReservations: async (page = 0, size = 10) => {
    const response = await api.get(
      `/reservations/artisan/demandes?page=${page}&size=${size}`
    );

    return response.data;
  },

  getInterventions: async (page = 0, size = 10) => {
    const response = await api.get(
      `/reservations/artisan/interventions?page=${page}&size=${size}`
    );
    return response.data;
  },

  getLatestReservations : async (page = 0, size = 5) => {
    const response = await api.get(`/reservations/latest?page=${page}&size=${size}`);
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get("/reservations/client");
    return response.data;
  },

  createReservation: async (data) => {
    const response = await api.post("/reservations", data);
    return response.data;
  },

  accepterReservation: async (id) => {
    const response = await api.patch(`/reservations/${id}/accepter`);
    return response.data;
  },
  refuserReservation: async (id) => {
    const response = await api.patch(`/reservations/${id}/refuser`);
    return response.data;
  },

  cancelReservation: async (id) => {
    await api.delete(`/reservations/${id}/annuler`);
  },

};

export default reservationService;
