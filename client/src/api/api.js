import axios from 'axios';
import io from 'socket.io-client';


// AUTO-DETECT ENVIRONMENT
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://cyberlink-mp94.onrender.com'; // Your BACKEND URL

export const api = axios.create({
  baseURL: API_URL,
});

export const socket = io(API_URL, { autoConnect: false });



export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (credentials) => api.post('/auth/signup', credentials),
};