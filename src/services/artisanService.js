import api from "./axios";

const artisanService = {
  getAll: async (page = 0, size = 50) => {
    const response = await api.get(
      `/artisans?page=${page}&size=${size}`
    );
    return response.data;
  },

  findBySpecialite: async (specialite, page = 0, size = 50) => {
    const response = await api.get(
      `/artisans/specialite?specialite=${encodeURIComponent(specialite)}&page=${page}&size=${size}`
    );
    return response.data;
  },

  findByVille: async (ville, page = 0, size = 50) => {
    const response = await api.get(
      `/artisans/ville?ville=${encodeURIComponent(ville)}&page=${page}&size=${size}`
    );
    return response.data;
  },

  searchArtisans: async (specialite = "", ville = "") => {
    const s = (specialite || "").trim();
    const v = (ville || "").trim();

    let response;

    if (s && v) {
      response = await api.get(
        `/artisans/specialite-ville?specialite=${encodeURIComponent(s)}&ville=${encodeURIComponent(v)}&page=0&size=50`
      );
    } else if (s) {
      response = await api.get(
        `/artisans/specialite?specialite=${encodeURIComponent(s)}&page=0&size=50`
      );
    } else if (v) {
      response = await api.get(
        `/artisans/ville?ville=${encodeURIComponent(v)}&page=0&size=50`
      );
    } else {
      response = await api.get("/artisans?page=0&size=50");
    }

    return response.data;
  },
};

export default artisanService;