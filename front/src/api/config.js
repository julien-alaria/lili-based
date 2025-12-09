import axios from "axios";
//URL de l’API, headers par défaut

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`
});

instance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('accessToken')
  
      if (token !== null) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      console.log("une erreur est survenue:", error);
      return Promise.reject(new Error(error));
    }
  );
  
  
export default instance