import React, { useEffect, useState } from 'react';
import quizService from '../../api/quizService';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; 
import Loader from '../utils/Loader';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await quizService.getAllQuizzes();
                setQuizzes(data);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const isAdmin = localStorage.getItem('admin') === 'true';

    if (loading) return <Loader text="Loading Quizzes..." />;

    return (
        <div className="p-6 mt-8 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
            <div className='flex mt-2 mb-4 justify-between items-center'>
                <h1 className="text-2xl font-bold">Quiz List</h1>
                {isAdmin && (
                    <Link to="/quiz/add" className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">
                        <FaPlus className="mr-2" /> Add a Quiz
                    </Link>
                )}
            </div>
            <ul className="space-y-4">
                {quizzes.map(quiz => (
                    <li key={quiz._id} className="flex justify-between items-center bg-gray-100 border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition duration-200">
                        <div className="font-semibold text-lg">{quiz.name}</div>
                        <Link to={`/quiz/${quiz._id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                            Answer
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizList;
