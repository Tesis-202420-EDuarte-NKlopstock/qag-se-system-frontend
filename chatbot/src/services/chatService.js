import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Cambia esta URL a tu API

export const sendMessage = async (message) => {
    try {
        console.log("Sending message", message);
        const response = await axios.post(`${API_URL}/chat`, message);
        console.log("API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending message", error);
        throw error;
    }
};
