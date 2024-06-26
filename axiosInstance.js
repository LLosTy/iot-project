import axios from 'axios';
require('dotenv').config();
let axiosInstance

if(process.env.NEXT_PUBLIC_ENV === "DEV"){
    console.log("ENVIRONMENT: DEV")
    axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL + ":8080",
        headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
        },
        responseType: 'json',
        timeout: 10000 // Optional: sets a timeout for requests
    });

}else if(process.env.NEXT_PUBLIC_ENV === "PROD"){
    console.log("ENVIRONMENT: PROD")
    axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
        },
        responseType: 'json',
        timeout: 10000 // Optional: sets a timeout for requests
    });
}

export default axiosInstance;
