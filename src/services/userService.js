import api from "./axios";

const userService = {
  getCurrentUser: async () => {
    const response = await api.get("users/profile");
    return response.data;
  },

  updateProfile: async (data) => {
  const response = await api.put("/users/profile", data);
  return response.data;
},

  updateClientProfile: async (data) => {
    const response = await api.put("/users/client/profile", data);
    return response.data;
  },

  updateArtisanProfile: async (data) => {
    const response = await api.put("/users/artisan/profile", data);
    return response.data;
  },

};

export default userService;