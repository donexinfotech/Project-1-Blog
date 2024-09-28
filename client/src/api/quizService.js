import axios from 'axios';

const API_URL = '/api/quiz';
const token = localStorage.getItem('authToken')
const quizService = {
    getAllQuizzes: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    getQuizById: async (id) => {
        const reponse = await axios.get(`${API_URL}/${id}`);
        return reponse.data;
    },
    addQuiz: async (quizData) => {
        const response = await axios.post(`${API_URL}/add`, quizData);
        return response.data;
    },
    answerQuiz: async (quizId, answerData) => {
        const response = await axios.post(`${API_URL}/answer/${quizId}`, answerData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
};

export default quizService;
