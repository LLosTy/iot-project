import axios from 'axios';
require('dotenv').config();

let axiosInstance 
if (process.env.NEXT_PUBLIC_RUN === "dev") {
    axiosInstance = axios.create({
        baseURL: "http://localhost:8080"
        ,
        headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
        },
        responseType: 'json',
        timeout: 10000 // Optional: sets a timeout for requests
    });
} else {
    axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL+":"+process.env.NEXT_PUBLIC_PORT+"/"
        ,
        headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
        },
        responseType: 'json',
        timeout: 10000 // Optional: sets a timeout for requests
    });
}


export default axiosInstance;
