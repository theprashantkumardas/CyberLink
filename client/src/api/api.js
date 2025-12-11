import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'https://cyberlink-mp94.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
});

export const socket = io(API_URL, { autoConnect: false });

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (credentials) => api.post('/auth/signup', credentials),
};