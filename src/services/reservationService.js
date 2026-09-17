import api from "./axios";

const reservationService = {
  getPendingReservations: async (page = 0, size = 10) => {
    const response = await api.get(
      `/reservations/artisan/demandes?page=${page}&size=${size}`
    );

    return response.data;
  },

};

export default reservationService;