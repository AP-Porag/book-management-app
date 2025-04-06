import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Replace with your API URL
    withCredentials: true, // Ensures cookies are sent with requests
});

// Automatically attach the access token from cookies
API.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
