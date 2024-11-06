import axios from 'axios';

// const API_URL = 'http://localhost:8000';
const API_URL = 'https://34.72.171.141.nip.io'

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

export const getPointsCounter = async (userId, db_id) => {
    try {
        console.log(`Getting points counter for user ${userId} and db_id ${db_id}`);
        const response = await axios.get(`${API_URL}/user_points_counter/${userId}/${db_id}`);
        console.log("[GetPointsCounter] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting points counter", error);
        throw error;
    }
}

export const getQuestions = async (code) => {
    try {
        const response = await axios.get(`${API_URL}/questions/${code}`);
        console.log("[GetQuestions] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting questions", error);
        throw error;
    }
}

export const evaluateAnswer = async (input, code) => {
    try {
        console.log("Evaluating answer", input);
        const response = await axios.post(`${API_URL}/evaluate/${code}`, input);
        console.log("[EvaluateAnswer] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error evaluating answer", error);
        throw error;
    }
}

export const verifyKnowledgeCode = async (bdId) => {
    try {
        console.log("Getting code verification", bdId.toUpperCase());
        const response = await axios.get(`${API_URL}/knowledge_base_exists/${bdId.toUpperCase()}`);
        console.log("[VerifyKnowledgeCode] API Response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting points counter", error);
        throw error;
    }
}

export const uploadFile = async (selectedFiles1, selectedFiles2) => {
    try {
      console.log("Uploading file");
  
      // Crear una instancia de FormData para enviar los archivos
      const formData = new FormData();
  
      // Añadir cada archivo seleccionado al FormData
      selectedFiles1.forEach((file) => {
        formData.append('files1', file); // 'files' es el nombre del campo en el servidor
      });

      if (selectedFiles2 && selectedFiles2.length > 0) {
        selectedFiles2.forEach((file) => {
            formData.append('files2', file); // 'files2' es el nombre del campo en el servidor
        });
    }
  
      // Enviar el FormData a la API usando POST
      const response = await axios.post(`${API_URL}/upload_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Importante para subir archivos
        },
      });
  
      console.log("[UploadFile] API Response", response.data);
      return (response.data)['content'];
    } catch (error) {
      console.error("Error uploading file", error);
      throw error;
    }
  };
