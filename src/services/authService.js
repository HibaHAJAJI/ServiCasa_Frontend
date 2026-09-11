import api from './axios';

const authService = {
    
    login : async(data)=>{
        const response = await api.post('/auth/login' , data); 
        return response.data
    },

    RegisterArtisan : async(data)=>{
        const reponse = await api.post('/auth/register/artisan',data);
        return reponse.data
    },
    
     RegisterClient : async(data)=>{
        const reponse = await api.post('/auth/register/client',data);
        return reponse.data
    }
}

export default authService;