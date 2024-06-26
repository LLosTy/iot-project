import axios from 'axios';

const axiosInstance = axios.create({
    headers: {
        baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
        'Content-Type': 'application/json',
        withCredentials: true,
    },
    responseType: 'json',
    timeout: 10000 // Optional: sets a timeout for requests
});

export default axiosInstance;