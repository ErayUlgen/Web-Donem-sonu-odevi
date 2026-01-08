import axios from 'axios';

// Vite projelerinde çevre değişkenleri import.meta.env ile alınır
// Eğer .env dosyasında VITE_API_URL tanımlıysa onu kullanır, yoksa localhost'u varsayar.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
});

export default api;
