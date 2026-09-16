import api from "./axios";

const reservationService = {

  getReservationsByClient: async (clientId, page = 0, size = 5) => {
    const response = await api.get(`/reservations/client/${clientId}?page=${page}&size=${size}` );
    return response.data;
  }

};

export default reservationService;