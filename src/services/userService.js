import API from "./axios";

const userService = {
  getCurrentUser: async () => {
    const response = await API.get("users/profile");
    return response.data;
  },

};

export default userService;