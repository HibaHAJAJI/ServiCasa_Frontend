import api from "./axios";

const toParamValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return String(value.nom ?? value.name ?? value.id ?? "").trim();
  }

  return String(value).trim();
};

const artisanService = {
  getAll: async (page = 0, size = 50) => {
    const response = await api.get(
      `/artisans?page=${page}&size=${size}`
    );
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/artisans/${id}`);
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

  getVilles: async () => {
    const response = await api.get("/villes");
    return response.data;
  },

  getSpecialites: async () => {
    const response = await api.get("/specialites");
    return response.data;
  },

  getSpecialitesAndVille: async (ville, specialite, page = 0, size = 50) => {
    const response = await api.get(
      `/artisans/search?ville=${encodeURIComponent(toParamValue(ville))}&specialite=${encodeURIComponent(toParamValue(specialite))}&page=${page}&size=${size}`
    );
    return response.data;
  },

  searchArtisans: async (specialite = "", ville = "", page = 0, size = 50) => {
    const special = toParamValue(specialite);
    const villes = toParamValue(ville);

    if (special && ville) {
      return artisanService.getSpecialitesAndVille(villes, special, page, size);
    }

    if (special) {
      return artisanService.findBySpecialite(special, page, size);
    }

    if (villes) {
      return artisanService.findByVille(villes, page, size);
    }

    return artisanService.getAll(page, size);
  },
};

export default artisanService;