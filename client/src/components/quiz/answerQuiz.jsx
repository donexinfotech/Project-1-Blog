import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import quizService from '../../api/quizService';
import Loader from '../utils/Loader';

const AnswerQuiz = () => {
    const { id: quizId } = useParams(); // Get quiz ID from the URL
    const [quiz, setQuiz] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await quizService.getQuizById(quizId);
                setQuiz(data); // Set the fetched quiz data
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await quizService.answerQuiz(quizId, { answer: selectedOption });
            console.log("Response from server:", response); // Log the response
            alert(response.message); // Show success or error message from response
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

    if (!quiz) return <Loader text="Loading Quiz!" />; // Loader while fetching data

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">{quiz.question}</h1>
                <div className="space-y-4">
                    {quiz.options.map((option, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                id={`option-${index}`}
                                name="quiz-option"
                                value={option}
                                checked={selectedOption === option}
                                onChange={() => setSelectedOption(option)}
                                required
                                className="hidden" // Hide the default radio input
                            />
                            <label 
                                htmlFor={`option-${index}`}
                                className={`block p-3 text-center border rounded-lg cursor-pointer transition duration-200
                                    ${selectedOption === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
                                    hover:bg-blue-400 hover:text-white`}
                            >
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                <button 
                    type="submit" 
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Submit Answer
                </button>
            </form>
        </div>
    );
};

export default AnswerQuiz;
