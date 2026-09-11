import api from './axios';

const authService = {
    
    login : async(data)=>{
        const response = await api.post('/auth/login' , data); 
        return response.data
    },

    RegisterArtisans : async(data)=>{
        const reponse = await api.post('/auth/register/artisan',data);
        return reponse.data
    }
}

export default authService;