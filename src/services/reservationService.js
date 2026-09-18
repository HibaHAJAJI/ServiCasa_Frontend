import api from "./axios";

const reservationService = {

  getPendingReservations: async (page = 0, size = 10) => {
    const response = await api.get(
      `/reservations/artisan/demandes?page=${page}&size=${size}`
    );

    return response.data;
  },

  getLatestReservations : async (page = 0, size = 5) => {
  const response = await api.get(`/reservations/latest?page=${page}&size=${size}`);
  return response.data;
},


};

export default reservationService;