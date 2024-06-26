import axios from 'axios';
require('dotenv').config();

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        withCredentials: true,
    },
    responseType: 'json',
    timeout: 10000 // Optional: sets a timeout for requests
});

export default axiosInstance;
