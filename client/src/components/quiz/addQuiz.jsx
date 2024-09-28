import React, { useState } from 'react';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import quizService from '../../api/quizService';

const AddQuiz = () => {
    const [quizName, setQuizName] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', ''], correctAnswer: '' }]);

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleAddOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push(''); 
        setQuestions(updatedQuestions);
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.splice(optionIndex, 1); 
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', ''], correctAnswer: '' }]); 
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index); 
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!quizName.trim()) {
            return;
        }

        const formattedQuestions = questions.map(quiz => ({
            question: quiz.question.trim(),
            options: quiz.options.map(option => option.trim()).filter(option => option), 
            correct_answer: quiz.correctAnswer.trim(),
        }));

        if (formattedQuestions.some(q => !q.question || q.options.length < 2 || !q.correct_answer)) {
            alert("Please ensure all questions have at least two options and a correct answer.");
            return;
        }

        try {
            const quizData = {
                name: quizName,
                ...formattedQuestions.reduce((acc, curr) => {
                    acc.question = curr.question;
                    acc.options = curr.options;
                    acc.correct_answer = curr.correct_answer;
                    return acc;
                }, {}),
            };

            const response = await quizService.addQuiz(quizData); 
            alert(`Quiz created`);
            
            // Reset form after submission
            setQuizName('');
            setQuestions([{ question: '', options: ['', ''], correctAnswer: '' }]); 
        } catch (error) {
            console.error("Error adding quiz:", error);
            alert("Failed to add quiz. Please check the console for errors.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Add Quiz</h1>
            <div className="mb-4">
                <label className="block text-sm font-medium">Quiz Name:</label>
                <input 
                    type="text" 
                    value={quizName} 
                    onChange={(e) => setQuizName(e.target.value)} 
                    required 
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>
            {questions.map((quiz, questionIndex) => (
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
                                const updatedQuestions = [...questions];
                                updatedQuestions[questionIndex].correctAnswer = e.target.value;
                                setQuestions(updatedQuestions);
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
                Add Quiz
            </button>
        </form>
    );
};

export default AddQuiz;
