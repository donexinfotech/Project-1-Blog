import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../../api/quizService';
import Loader from '../utils/Loader';

const AnswerQuiz = () => {
    const { id: quizId } = useParams();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [showQuestions, setShowQuestions] = useState(true);
    const [errorShown, setErrorShown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await quizService.getQuizById(quizId);
                setQuizData(data);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleOptionClick = (option) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [quizData.quiz[currentQuestionIndex]._id]: option,
        }));
    };

    const handleNext = () => {
        if (answers[quizData.quiz[currentQuestionIndex]._id]) {
            setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, quizData.quiz.length - 1));
        } else {
            setSubmissionMessage('Please select an answer before moving to the next question.');
        }
    };

    const handlePrev = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setSubmissionMessage(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(answers).length < quizData.quiz.length) {
            return;
        }

        setIsSubmitting(true);
        setLoading(true);
        let tempScore = 0;

        quizData.quiz.forEach((question) => {
            const userAnswer = answers[question._id];
            if (userAnswer === question.correct_answer) {
                tempScore += 1;
            }
        });

        try {
            await quizService.answerQuiz(quizId, answers);
            setScore(tempScore);
            setSubmissionMessage('Your answers have been submitted successfully!');
        } catch (error) {
            console.error("Error submitting answers:", error);
            if (error.response && error.response.status === 400 && !errorShown) {
                setSubmissionMessage('Maximum daily limit reached. Please try again tomorrow.');
                setShowQuestions(false); 
                setErrorShown(true); 
            } else {
                setSubmissionMessage('There was an error submitting your answers.');
            }
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    if (!quizData) return <Loader text="Loading Quiz!" />;
    if (loading) return <Loader text="Submitting Your Answers" />;

    const currentQuestion = quizData.quiz[currentQuestionIndex];

    return (
        <div className="mt-6 flex flex-col items-center justify-center h-auto">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{quizData.name}</h1>

                {showQuestions && score === null ? (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-center">{currentQuestion.question}</h2>
                        <div className="flex flex-wrap justify-between space-y-4">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleOptionClick(option)}
                                    className={`flex-1 p-5 text-center border rounded-lg cursor-pointer transition duration-200
                                        ${answers[currentQuestion._id] === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
                                        hover:bg-blue-400 hover:text-white m-1`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6">
                            <button 
                                type="button"
                                onClick={handlePrev}
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
                            >
                                Back
                            </button>
                            {currentQuestionIndex < quizData.quiz.length - 1 ? (
                                <button 
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
                                >
                                    Next
                                </button>
                            ) : (
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Submit Answers
                                </button>
                            )}
                        </div>
                        <div className="flex justify-center mt-4">
                            {quizData.quiz.map((_, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setCurrentQuestionIndex(index)} 
                                    className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center cursor-pointer transition duration-200
                                        ${index === currentQuestionIndex ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="mt-4 text-2xl font-bold text-center text-green-500">
                        {submissionMessage} <br />
                        {score !== null && (
                            <>
                                Your Score: 
                                <div className='text-black text-4xl'>{score} / {quizData.quiz.length}</div>
                            </>
                        )}
                    </div>
                )}
                
                {submissionMessage !== "Maximum daily limit reached. Please try again tomorrow." && score === null && (
                    <div className="mt-4 text-red-500 text-center">{submissionMessage}</div>
                )}
                
                {score !== null && (
                    <button 
                        onClick={() => navigate('/quiz')}
                        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Go Back to Quiz List
                    </button>
                )}

                {!showQuestions && (
                    <div className="mt-6">
                        <button 
                            onClick={() => navigate('/quiz')}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Go Back to Quiz List
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AnswerQuiz;
