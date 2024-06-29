import axios from 'axios';
require('dotenv').config();

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/" || process.env.NEXT_PUBLIC_API_URL+`:${process.env.PORT}/`
    ,
    headers: {
        'Content-Type': 'application/json',
        withCredentials: true,
    },
    responseType: 'json',
    timeout: 10000 // Optional: sets a timeout for requests
});

export default axiosInstance;
