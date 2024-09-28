const Quiz = require("../models/quiz-model");
const User = require("../models/user-model");

const addQuiz = async (req, res)=>{
    try {
        const {question, options, correct_answer} = req.body

        const quiz = await Quiz.create({question, options, correct_answer});

        res.status(200).json({
            message : `Quiz created ${quiz}`
        })
    } catch (error) {
        console.log(error);
    }
}

const answerQuiz = async (req, res)=>{
    try {
        const userId = req.userID;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(!user.quizActivity){
            user.quizActivity = {
                date : new Date(),
                questionsAttempted : 0
            }
        }

        const currentDate = new Date().toDateString();
        const lastQuizDate = new Date(user.quizActivity.date).toDateString();

        if (currentDate === lastQuizDate) {
            if (user.quizActivity.questionsAttempted >= 20) {
                return res.status(400).json({ message: 'You have reached the 20-question limit for today' });
            }

            user.quizActivity.questionsAttempted += 1;
        } else {
            user.quizActivity.date = new Date();
            user.quizActivity.questionsAttempted = 1;
        }

        await user.save();

        const quizId = req.params.id
        const {answer} = req.body

        const quiz = await Quiz.findOne({
            _id : quizId
        });

        if(!quiz){
            res.status(400).json({
                message: "No quiz found"
            })
        }

        if(answer == quiz.correct_answer){
            res.status(200).json({
                message: "Congratulations!!...Correct Answer",
                attempts : user.quizActivity.questionsAttempted
            })
        }

        res.status(200).json({
            message: "Wrong Answer!!",
            attempts : user.quizActivity.questionsAttempted
        })
        

    } catch (error) {
        console.log(error)
    }
}

const getAllQuiz = async (req, res)=>{
    try {
        const quiz = await Quiz.find();
        res.status(200).json(quiz);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {addQuiz, answerQuiz, getAllQuiz}