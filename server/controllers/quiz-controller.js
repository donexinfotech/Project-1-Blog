const Quiz = require("../models/quiz-model");
const User = require("../models/user-model");

const addQuiz = async (req, res)=>{
    try {
        const {name, question, options, correct_answer} = req.body

        const quiz = await Quiz.findOneAndUpdate(
            { name: name },
            { 
              $push: { 
                quiz: { 
                  question: question,
                  options: options,
                  correct_answer: correct_answer 
                }
              }
            },
            { 
              new: true,
              upsert: true
            }
          );

        res.status(200).json({
            message : `Quiz created ${quiz}`
        })
    } catch (error) {
        console.log(error);
    }
}

const answerQuiz = async (req, res)=>{
    try{
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
        res.status(200).json({
            attempt : user.quizActivity.questionsAttempted
        })
    }
    catch(err){
        console.log(err)
    }
}

const answerQuestions = async (req, res)=>{
    try {
        const quizId = req.params.quizid
        const questionId = req.params.questionid
        const {answer} = req.body

        const quiz = await Quiz.findOne({ _id: quizId });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const question = quiz.quiz.id(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if(answer == question.correct_answer){
            res.status(200).json({
                message: "Congratulations!!...Correct Answer"
            })
        }

        res.status(200).json({
            message: "Wrong Answer!!"
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

const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {addQuiz,answerQuestions, answerQuiz, getAllQuiz, getQuizById}