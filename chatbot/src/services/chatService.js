import axios from 'axios';

// const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'https://34.170.32.46:8000'

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

export const getPointsCounter = async (userId) => {
    try {
        console.log("Getting points counter", userId);
        const response = await axios.get(`${API_URL}/user_points_counter/${userId}`);
        console.log("[GetPointsCounter] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting points counter", error);
        throw error;
    }
}

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
