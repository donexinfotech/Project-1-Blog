import React, { useEffect, useState } from 'react';
import quizService from '../../api/quizService';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; // Importing an icon for the button

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await quizService.getAllQuizzes();
                setQuizzes(data);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };
        fetchQuizzes();
    }, []);

    // Check if the user is an admin
    const isAdmin = localStorage.getItem('admin') === 'true';

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Quiz List</h1>
            <ul className="space-y-4">
                {quizzes.map(quiz => (
                    <li key={quiz._id} className="flex justify-between items-center bg-gray-100 border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition">
                        <div className="font-semibold text-lg">{quiz.question}</div>
                        <Link to={`/quiz/${quiz._id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Answer</Link>
                    </li>
                ))}
            </ul>
            {isAdmin && (
                <Link to="/quiz/add" className="mt-6 inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                    <FaPlus className="mr-2" /> Add a Quiz
                </Link>
            )}
        </div>
    );
};

export default QuizList;
