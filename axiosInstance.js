import axios from 'axios';

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    },
    responseType: 'json',
    timeout: 10000 // Optional: sets a timeout for requests
});

export default axiosInstance;
