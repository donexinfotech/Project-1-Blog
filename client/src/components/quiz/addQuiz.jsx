import React, { useState } from 'react';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import quizService from '../../api/quizService';

const AddQuiz = () => {
    const [quizzes, setQuizzes] = useState([{ question: '', options: [''], correctAnswer: '' }]);

    const handleQuestionChange = (index, value) => {
        const updatedQuizzes = [...quizzes];
        updatedQuizzes[index].question = value;
        setQuizzes(updatedQuizzes);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuizzes = [...quizzes];
        updatedQuizzes[questionIndex].options[optionIndex] = value;
        setQuizzes(updatedQuizzes);
    };

    const handleAddOption = (questionIndex) => {
        const updatedQuizzes = [...quizzes];
        updatedQuizzes[questionIndex].options.push(''); // Add a new empty option
        setQuizzes(updatedQuizzes);
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const updatedQuizzes = [...quizzes];
        updatedQuizzes[questionIndex].options.splice(optionIndex, 1); // Remove the specified option
        setQuizzes(updatedQuizzes);
    };

    const handleAddQuestion = () => {
        setQuizzes([...quizzes, { question: '', options: [''], correctAnswer: '' }]); // Add a new question
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuizzes = quizzes.filter((_, i) => i !== index); // Remove the specified question
        setQuizzes(updatedQuizzes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create an array of quiz objects
            const formattedQuizzes = quizzes.map(quiz => ({
                question: quiz.question.trim(),
                options: quiz.options.map(option => option.trim()).filter(option => option), // Remove empty options
                correct_answer: quiz.correctAnswer.trim()
            }));

            // Send each quiz object to the backend
            const responses = await Promise.all(formattedQuizzes.map(quiz => quizService.addQuiz(quiz)));
            alert(responses.map(res => res.message).join('\n')); // Show messages for each quiz added
            
            // Reset form after submission
            setQuizzes([{ question: '', options: [''], correctAnswer: '' }]);
        } catch (error) {
            console.error("Error adding quiz:", error);
            alert("Failed to add quizzes. Please check the console for errors.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Add Quizzes</h1>
            {quizzes.map((quiz, questionIndex) => (
                <div key={questionIndex} className="mb-6 border p-4 rounded">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium">Question:</label>
                        <button type="button" onClick={() => handleRemoveQuestion(questionIndex)} className="text-red-500">
                            <FaTrashAlt />
                        </button>
                    </div>
                    <input 
                        type="text" 
                        value={quiz.question} 
                        onChange={(e) => handleQuestionChange(questionIndex, e.target.value)} 
                        required 
                        className="mt-1 p-2 border rounded w-full mb-4"
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Options:</label>
                        {quiz.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center mb-2">
                                <input 
                                    type="text" 
                                    value={option} 
                                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)} 
                                    required 
                                    className="mt-1 p-2 border rounded w-full" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveOption(questionIndex, optionIndex)} 
                                    className="ml-2 text-red-500"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={() => handleAddOption(questionIndex)} 
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
                        >
                            <FaPlus className="mr-2" />
                            Add Option
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Correct Answer:</label>
                        <input 
                            type="text" 
                            value={quiz.correctAnswer} 
                            onChange={(e) => {
                                const updatedQuizzes = [...quizzes];
                                updatedQuizzes[questionIndex].correctAnswer = e.target.value;
                                setQuizzes(updatedQuizzes);
                            }} 
                            required 
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                </div>
            ))}
            <button 
                type="button" 
                onClick={handleAddQuestion} 
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
            >
                <FaPlus className="mr-2" />
                Add Question
            </button>
            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
                Add Quizzes
            </button>
        </form>
    );
};

export default AddQuiz;
