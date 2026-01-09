import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export const setToken = (token: string) => {
    Cookies.set('token', token, { expires: 1 });
};

export const removeToken = () => {
    Cookies.remove('token');
};

export const getToken = () => {
    return Cookies.get('token');
};

export default api;
