import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + ":" + process.env.NEXT_PUBLIC_SERVER_PORT,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // Optional: sets a timeout for requests
});

export default axiosInstance;
