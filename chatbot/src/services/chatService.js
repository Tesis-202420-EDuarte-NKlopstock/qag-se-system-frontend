import axios from 'axios';

const API_URL = 'http://localhost:8000';
// const API_URL = 'https://34.70.177.151.nip.io'

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

export const verifyKnowledgeCode = async (bdId) => {
    try {
        console.log("Getting code verification", bdId);
        const response = await axios.get(`${API_URL}/knowledge_base_exists/${bdId}`);
        console.log("[VerifyKnowledgeCode] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting points counter", error);
        throw error;
    }
}

export const uploadFile = async (selectedFiles) => {
    try {
      console.log("Uploading file");
  
      // Crear una instancia de FormData para enviar los archivos
      const formData = new FormData();
  
      // Añadir cada archivo seleccionado al FormData
      selectedFiles.forEach((file) => {
        formData.append('files', file); // 'files' es el nombre del campo en el servidor
      });
  
      // Enviar el FormData a la API usando POST
      const response = await axios.post(`${API_URL}/upload_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Importante para subir archivos
        },
      });
  
    //   console.log("[UploadFile] API Response", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading file", error);
      throw error;
    }
  };
