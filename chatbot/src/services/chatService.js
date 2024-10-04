import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Cambia esta URL a tu API

export const sendMessage = async (message) => {
    try {
        console.log("Sending message", message);
        const response = await axios.post(`${API_URL}/chat`, message);
        console.log("[SendMessage] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending message", error);
        throw error;
    }
};

export const getQuestions = async () => {
    try {
        const response = await axios.get(`${API_URL}/questions`);
        console.log("[GetQuestions] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting questions", error);
        throw error;
    }
}

export const evaluateAnswer = async (input) => {
    try {
        console.log("Evaluating answer", input);
        const response = await axios.post(`${API_URL}/evaluate`, input);
        console.log("[EvaluateAnswer] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error evaluating answer", error);
        throw error;
    }
}
