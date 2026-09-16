import api from "./axios";

const artisanService = {

  searchBySpecialite: async (specialite, page = 0, size = 10) => {
    const response = await api.get("/artisans/specialite", { params: { specialite, page, size } });
    return response.data;
  },

  searchByVille: async (ville, page = 0, size = 10) => {
    const response = await api.get("/artisans/ville", { params: { ville, page, size } });
    return response.data;
  },



};

export default artisanService;
