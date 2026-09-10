import api from './axios';

const authService = {
    
    login : async(data)=>{
        const response = await api.post('/auth/login' , data); 
        return response.data
    },
}

export default authService;